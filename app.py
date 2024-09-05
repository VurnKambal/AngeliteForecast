from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

import os
import io
import json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import joblib
import xgboost as xgb

from statsmodels.tsa.api import SimpleExpSmoothing
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

from sqlalchemy import create_engine

from model import initialize_models, preprocess_data, create_lag_features, create_rolling_std, create_rolling_mean, ensemble_metrics


app = Flask(__name__)
CORS(app)
@app.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "Test successful"}), 200

USERNAME = 'postgres'
PASSWORD = 'thesis'
HOST = 'localhost'
PORT = '5432'
DATABASE = 'angeliteforecast'

# Global variables to store the DataFrames
enrollment_df = None
cpi_df = None
inflation_df = None
admission_df = None
hfce_df = None
models = {}

# Dictionary for major with incorrect department
incorrect_department_dict = {
    "BSBA-HRM": "SBA",
    "MAPEH-BSED": "SED",
}

department_dict = {
    "CHTM" : "SHTM",
    "CICT" : "SOC",
}

# Custom JSON encoder to handle NaN values
class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        if isinstance(obj, (np.float32, np.float64)):
            return float(obj)
        if pd.isna(obj):
            return None
        return super(NpEncoder, self).default(obj)

# Function to calculate CAGR
def calculate_cagr(beginning_value, ending_value, periods):
    return (ending_value / beginning_value) ** (1 / periods) - 1




def connect_to_database(_username, _password, _host, _port, _database):
    """
    Create a connection to a MySQL database.
    
    Args:
    username (str): Database username
    password (str): Database password
    host (str): Database host
    port (int): Database port
    database (str): Database name
    
    Returns:
    engine: SQLAlchemy engine object
    """
    _db_connection_string = f'postgresql://{_username}:{_password}@{_host}:{_port}/{_database}'
    _engine = create_engine(_db_connection_string)
    return _engine



def query_data(_engine):  # df_included=True, cpi_df_included=True, inflation_df_included=True, admission_df_included=True, hfce_df_included=True):
    global enrollment_df, cpi_df, inflation_df, admission_df, hfce_df
    # Query data from the database using the provided engine
    enrollment_df = pd.read_sql("SELECT * FROM enrollment", _engine)            # Changed to database query
    cpi_df = pd.read_sql("SELECT * FROM cpi_education", _engine)          # Changed to database query
    inflation_df = pd.read_sql("SELECT * FROM inflation_rate", _engine)   # Changed to database query
    admission_df = pd.read_sql("SELECT * FROM admission", _engine)   # Changed to database query
    hfce_df = pd.read_sql("SELECT * FROM hfce", _engine)                  # Changed to database query



ENGINE = connect_to_database(USERNAME, PASSWORD, HOST, PORT, DATABASE)


# Function to train models for each major
def train_models(data, weight_ses=0.2, weight_rf=0.4, weight_xgb=0.1, engine=ENGINE):
 # Endpoint to train models
    df = pd.DataFrame(data)
    
    # Tuned parameters during past training
    params = json.load(open("data/tuned_params.json"))
    rf_params = params["rf"]
    xgb_params = params["xgb"]

    print("df", df)
    # Train Random Forest model
    X_train = df.query("2018 < Start_Year < 2024").drop(columns=["1st_Year", "Major"])# 'Year_Level'])
    y_train = df.query("2018 < Start_Year < 2024")['1st_Year']
    rf_model = RandomForestRegressor(**rf_params, random_state=42)
    rf_model.fit(X_train, y_train)
    
    # Train XGBoost DART model
    dtrain = xgb.DMatrix(X_train, label=y_train)
    xgb_model = xgb.train(xgb_params, dtrain)
    
    # Train SES model and ensemble with Random Forest
    models = {
        "rf": rf_model,
        "xgb": xgb_model,
        "ses": {},
    }
    for major in df['Major'].unique():
        major_data = df[df['Major'] == major]
        X_major_train = major_data.drop(columns=['Major', 'Start_Year', '1st_Year'])
        y_major_train = major_data['1st_Year']
        if len(y_major_train) > 1:
            # Train SES model
            ses_model = SimpleExpSmoothing(y_major_train).fit(smoothing_level=0.8, optimized=False)
            models["ses"][major] = ses_model
        else:
            print(f"Skipping SES model for {major} because it has less than 2 data points.")
    
    return models

# Function to make predictions
def make_predictions(selectedModel, models, data, weight_ses=0.2, weight_rf=0.4, weight_xgb=0.1, engine=ENGINE):
    major = data['Major'][0]
    pred_year = data['Start_Year'].iloc[-1]
    pred_semester = data['Semester'].iloc[-1]
    major_data = data[data['Major'] == major]
    predictions = {}
    X_major = major_data.drop(columns=['Major']).reset_index(drop=True)
    print("X_major", X_major)
    
    # Split X_major into train and pred
    X_major_train = X_major[(X_major['Start_Year'] < pred_year) | ((X_major['Start_Year'] == pred_year) & (X_major['Semester'] < pred_semester))]
    X_major_pred = X_major[(X_major['Start_Year'] == pred_year) & (X_major['Semester'] == pred_semester)]
    print("pred_year", data)
    print(X_major_train, "\n\n\n", X_major_pred)
    match(selectedModel.lower()):
        case "randomforest":
            rf_model = models["rf"]
            y_major_train_pred = rf_model.predict(X_major_train)
            y_major_pred = rf_model.predict(X_major_pred)
            predictions = {
                "train_pred": y_major_train_pred,
                "test_pred": y_major_pred
            }
            print("predictions", predictions)
        
        case "xgboost":     
            xgb_model = models["xgb"]

            dtrain = xgb.DMatrix(X_major_train)
            dpred = xgb.DMatrix(X_major_pred)
            try:
                y_major_train_pred = xgb_model.predict(dtrain)
                y_major_pred = xgb_model.predict(dpred)
                predictions = {
                    "train_pred": y_major_train_pred,
                    "test_pred": y_major_pred
                }
            except Exception as e:
                print(f"Error during XGBoost prediction: {str(e)}")
                print("XGBoost model feature names:", xgb_model.feature_names)
                raise
            print("predictions", predictions)
        
        case "ensemble":
            # Ensure the weights sum to 1
            total_weight = weight_ses + weight_rf + weight_xgb
            weight_ses /= total_weight
            weight_rf /= total_weight
            weight_xgb /= total_weight

            rf_model = models["rf"]
            xgb_model = models["xgb"]
            ensembled_models = models["ensembled"].get(major)

            print("\n\n\ndata     ", data)
            major = data['Major'][0]
            ses_model = ensembled_models["ses"]
            
            dtrain = xgb.DMatrix(X_major_train)
            dpred = xgb.DMatrix(X_major_pred)
            print("data ", X_major, "\n", X_major.columns)

            y_major_train_pred_ses = ses_model.fittedvalues
            y_major_train_pred_rf = rf_model.predict(X_major_train)
            y_major_train_pred_xgb = xgb_model.predict(dtrain)
            print(len(y_major_train_pred_ses), len(y_major_train_pred_rf), len(y_major_train_pred_xgb))
            
            y_major_train_pred_combined = (weight_ses * y_major_train_pred_ses +
                                           weight_rf * y_major_train_pred_rf +
                                           weight_xgb * y_major_train_pred_xgb)
            
            y_major_pred_ses = ses_model.forecast(steps=len(X_major_pred))
            y_major_pred_rf = rf_model.predict(X_major_pred)
            y_major_pred_xgb = xgb_model.predict(dpred)

            y_major_pred_combined = (weight_ses * y_major_pred_ses +
                                     weight_rf * y_major_pred_rf +
                                     weight_xgb * y_major_pred_xgb)

            predictions = {
                "train_pred": y_major_train_pred_combined,
                "test_pred": y_major_pred_combined
            }

        case _:
            return jsonify({"message": "Invalid model"}), 400
        
    #   Save predictions to csv
    predictions_df = pd.DataFrame({
        'Prediction': np.concatenate([
            predictions["train_pred"], 
            predictions["test_pred"]
            ]),
        'Is_Train': np.concatenate([
            np.ones(len(predictions["train_pred"])),
            np.zeros(len(predictions["test_pred"]))
            ])
    })
    predictions_df['Is_Train'] = predictions_df['Is_Train'].astype(bool)
    print("predictions_df", predictions_df)
    
    # Concatenate predictions_df with major_data
    predictions_df = pd.concat([major_data[["Start_Year", "Semester", "Major"]], predictions_df], axis=1)
    
    # Save the concatenated data to CSV
    predictions_df.to_csv('prediction_results.csv', index=False)

    # Return the last prediction from predictions_df
    return predictions_df.iloc[-1]["Prediction"]
    

# Endpoint to train models
@app.route('/train', methods=['POST'])
def train():
    data = request.get_json()

    df = pd.DataFrame(data)
    models = train_models(df)
    return jsonify({"message": "Models trained successfully"}), 200

# Endpoint to make predictions
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    processed_data = data['processed_data']
    df = pd.DataFrame(processed_data)
    # models = train_models(df)  # Assuming models are trained on the same data
    selectedModel  = data['model']
    
    prediction = make_predictions(selectedModel, models, df)
    print("prediction", prediction)
    return jsonify(float(prediction)), 200

# New route to process data from React app
@app.route('/process-data', methods=['POST'])
def process_data(train=False):
    global models, enrollment_df, cpi_df, inflation_df, admission_df, hfce_df
    print(models)

    data = request.get_json()
    user_input = pd.DataFrame([data])
    numerical_features = ["Start_Year", "Semester"]
    user_input[numerical_features] = user_input[numerical_features].astype(int)

    # Ensure the data has been queried
    if enrollment_df is None:
        query_data(ENGINE)  # Assuming ENGINE is your database connection
    
    print("engine", ENGINE)
    print(inflation_df)
    if train:
        # Process the data here using the global DataFrames
        processed_data = preprocess_data(None, enrollment_df, cpi_df, inflation_df, admission_df, hfce_df)
        print("processed_data", processed_data)
        models = train_models(processed_data)

    else:
        if len(models) == 0:
            models = initialize_models()

    
    # processed_data = preprocess_data(combined_data, enrollment_df, cpi_df, inflation_df, admission_df, hfce_df)
    processed_data = preprocess_data(user_input, enrollment_df, cpi_df, inflation_df, admission_df, hfce_df)
         
       

    response = {
        'status': 'success',
        'message': 'Data processed successfully',
        'processed_data': json.dumps(processed_data.to_dict(orient='records'), cls=NpEncoder)
    }   
    print("Processed data response:", response)
    print(processed_data)
    return jsonify(response), 200


@app.route('/plot', methods=['POST'])
def plot():
    # Read the prediction results from the CSV file
    df = pd.read_csv('prediction_results.csv')
    major = df["Major"].iloc[0]
    print(df,"\n\n\n")
    print("major", df["Major"].iloc[0])
    # Filter the DataFrame for the selected major
    # Get actual values of major data from the database
    query = f"""
    SELECT "Start_Year", "Semester", "1st_Year"
    FROM enrollment
    WHERE "Major" = '{major}'
    ORDER BY "Start_Year", "Semester"
    """
    major_data = pd.read_sql(query, ENGINE)
    
    # Map semester to month
    semester_to_month = {1: 6, 2: 11}  # 1 -> June (6), 2 -> November (11)
    
    # Create a new column 'Date' by combining Start_Year and Semester
    major_data['Date'] = pd.to_datetime(major_data['Start_Year'].astype(str) + '-' + 
                                        major_data['Semester'].map(semester_to_month).astype(str) + '-01')
    df['Date'] = pd.to_datetime(df['Start_Year'].astype(str) + '-' + 
                                df['Semester'].map(semester_to_month).astype(str) + '-01')
    
    major_data = major_data.sort_values('Date')
    df = df.sort_values('Date')

    
    # Fill NaN values in the '1st_Year' column with 0 for years where we only have predictions
    major_data['1st_Year'].fillna(0, inplace=True)
    
    print("Major data:", major_data)
    print(major_data.query('2018 < Start_Year < 2024'))
    print(df)
    
    # Plot the time graph
    plt.figure(figsize=(10, 6))
    plt.plot(major_data['Date'], major_data['1st_Year'], label='Actual', marker='o')
    # Plot predictions for training data
    train_data = df[df['Is_Train']]
    plt.plot(train_data['Date'], train_data['Prediction'], label='Train Prediction', linestyle=':', marker='d', color='orange')

    # Plot predictions for test data
    test_data = df[~df['Is_Train']]
    plt.plot(test_data['Date'], test_data['Prediction'], label='Test Prediction', linestyle='-.', marker='x', color='red')
    plt.xlabel('Date')
    plt.ylabel('Total Enrollment')
    plt.title(f'Actual vs Predicted Enrollment for {major}')
    plt.legend()
    
    # Add grid for better readability
    plt.grid(True, linestyle='--', alpha=0.7)
    
    # Rotate x-axis labels for better visibility if needed
    plt.xticks(rotation=45)
    
    # Tight layout to prevent cutting off labels
    plt.tight_layout()
    
    print("current path", os.getcwd())
    # Save the plot to a file for debugging
    plt.savefig('debug_plot.png', format='png', dpi=300)
    print(f"plot saved on {os.getcwd()}/debug_plot.png")
    # Save the plot to a BytesIO object
    img = io.BytesIO()
    plt.savefig(img, format='png', dpi=300)
    img.seek(0)
    
    return send_file(img, mimetype='image/png')



if __name__ == '__main__':
    app.run(debug=True)

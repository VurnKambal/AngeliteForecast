from flask import Flask, request, jsonify
from flask_cors import CORS

import json
import pandas as pd
import numpy as np
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

    print("query DF", enrollment_df)
    print("query DF", cpi_df)
    print("query DF", inflation_df)
    print("query DF", admission_df)
    print("query DF", hfce_df)



ENGINE = connect_to_database(USERNAME, PASSWORD, HOST, PORT, DATABASE)


# Function to train models for each major
def train_models(data, weight_ses=0.3, weight_rf=0.4, weight_xgb=0.3, engine=ENGINE):
    

    models = {}
    for major in data['Major'].unique():
        major_data = data[data['Major'] == major]
        X_major_train = major_data.drop(columns=['major', 'start_year', '1st_year', 'grade_12'])
        y_major_train = major_data['1st_year']

        # Train SES model
        ses_model = SimpleExpSmoothing(y_major_train).fit(smoothing_level=0.8, optimized=False)
        models[major] = {'ses': ses_model}

        # Train RandomForest model
        rf_model = RandomForestRegressor()
        rf_model.fit(X_major_train, y_major_train)
        models[major]['rf'] = rf_model

        # Train XGBoost model
        xgb_model = XGBRegressor()
        xgb_model.fit(X_major_train, y_major_train)
        models[major]['xgb'] = xgb_model

    return models

# Function to make predictions
def make_predictions(selectedModel, models, data, weight_ses=0.2, weight_rf=0.4, weight_xgb=0.1, engine=ENGINE):
    major = data['Major'][0]
    major_data = data[data['Major'] == major]

    X_major = major_data.drop(columns=['Major', 'TOTAL_lag_2'])

    
    match(selectedModel.lower()):
        # case "ses":
        #     model = models["ses"]
        case "randomforest":
            rf_model = models["rf"]
            prediction = rf_model.predict(X_major)[0]
            print("prediction", prediction)
        
        case "xgboost":     
            xgb_model = models["xgb"]

            dpred = xgb.DMatrix(X_major)
            try:
                prediction = xgb_model.predict(dpred)[0]
            except Exception as e:
                print(f"Error during XGBoost prediction: {str(e)}")
                print("XGBoost model feature names:", xgb_model.feature_names)
                raise
            print("prediction", prediction)
        
        case "ensemble":
            # Ensure the weights sum to 1
            total_weight = weight_ses + weight_rf + weight_xgb
            weight_ses /= total_weight
            weight_rf /= total_weight
            weight_xgb /= total_weight

            rf_model = models["rf"]
            xgb_model = models["xgb"]
            ensemble_models = models["ensembled"]

            print("\n\n\ndata     ", data)
            major = data['Major'][0]
            ses_model = ensemble_models.get(major).get('ses')
            lr_model = ensemble_models.get(major).get('lr')
            major_data = data[data['Major'] == major]
            X_major = major_data.drop(columns=['Major', 'TOTAL_lag_2'])
            
            dpred = xgb.DMatrix(X_major)
            print("data ", X_major, "\n", X_major.columns)



            ses_pred = ses_model.forecast(steps=len(X_major))
            rf_pred = rf_model.predict(X_major)
            
            try:
                xgb_pred = xgb_model.predict(dpred)
            except Exception as e:
                print(f"Error during XGBoost prediction: {str(e)}")
                print("XGBoost model feature names:", xgb_model.feature_names)
                raise
            combined_pred = (weight_ses * ses_pred + weight_rf * rf_pred + weight_xgb * xgb_pred)
            # prediction = combined_pred

            return combined_pred.iloc[0]
        case _:
            return jsonify({"message": "Invalid model"}), 400
        

    return json.dumps(prediction, cls=NpEncoder)
    
    

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
    return jsonify(prediction), 200

# New route to process data from React app
@app.route('/process-data', methods=['POST'])
def process_data():
    global models, enrollment_df, cpi_df, inflation_df, admission_df, hfce_df
    print(models)
    if len(models) == 0:
        models = initialize_models()

    data = request.get_json()
    user_input = pd.DataFrame([data])
    numerical_features = ["Start_Year", "Semester"]
    user_input[numerical_features] = user_input[numerical_features].astype(int)

    # Ensure the data has been queried
    if enrollment_df is None:
        query_data(ENGINE)  # Assuming ENGINE is your database connection
    
    print("engine", ENGINE)
    print(inflation_df)
    # Process the data here using the global DataFrames
    processed_data = preprocess_data(user_input, enrollment_df, cpi_df, inflation_df, admission_df, hfce_df)
     
   

    response = {
        'status': 'success',
        'message': 'Data processed successfully',
        'processed_data': json.dumps(processed_data.to_dict(orient='records'), cls=NpEncoder)
    }   
    print("Processed data response:", response)
    return jsonify(response), 200

if __name__ == '__main__':
    app.run(debug=True)
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

import os
import io
import json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import joblib

from sqlalchemy import create_engine, text

from model import initialize_models, preprocess_data, make_predictions, train_models

app = Flask(__name__)
CORS(app)

# Initialize models
models = initialize_models()

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


# Endpoint to train models
@app.route('/api/train', methods=['POST'])
def train():
    data = request.get_json()
    selected_model = data.get('model')
    
    if not selected_model:
        return jsonify({"error": "Model type not specified"}), 400

    df = pd.DataFrame(data['processed_data'])
    models = train_models(ENGINE, df, selected_model)
    return jsonify({"message": f"{selected_model.capitalize()} model trained successfully"}), 200

# Endpoint to make predictions
@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.get_json()
    processed_data = data['processed_data']
    print("awewarwarwarwa", processed_data)
    df = pd.DataFrame(processed_data)
    selectedModel = data['model']
    start_year = data['start_year']
    semester = data['semester']
    
    prediction = make_predictions(ENGINE, selectedModel, models, df, start_year, semester)
    print("prediction", prediction)
    if type(prediction) == str:
        return jsonify({"status": "error", "message": prediction}), 400
    return jsonify({"status": "success", "prediction": float(prediction)}), 200

# New route to process data from React app
@app.route('/api/process-data', methods=['POST'])
def process_data(train=False):
    global models, enrollment_df, cpi_df, inflation_df, admission_df, hfce_df
    print(models)

    data = request.get_json()
    user_input = pd.DataFrame([data])
    numerical_features = ["Start_Year", "Semester"]
    user_input[numerical_features] = user_input[numerical_features].astype(int)

    # Ensure the data has been queried
    if enrollment_df is None:
        query_data(ENGINE)
    if train:
        # Process the data here using the global DataFrames
        processed_data = preprocess_data(None, enrollment_df, cpi_df, inflation_df, admission_df, hfce_df)
        print("processed_data", processed_data)
        models = train_models(processed_data)

    else:
        print("models", models)
        if len(models) == 0:
            models = initialize_models()
    # Process external data
    use_external_data = data.get('UseExternalData', False)
    external_data = {}
    if use_external_data:
        external_data = {
            'Number_of_Applicants': data.get('AdmissionRate'),
            'CPI_Region3': data.get('CPIEducation'),
            'HFCE': data.get('OverallHFCE'),
            'HFCE_Education': data.get('HFCEEducation'),
            'Inflation_Rate': data.get('InflationRate')
        }
        # Remove None values (where user didn't provide input)
        external_data = {k: v for k, v in external_data.items() if v is not None}

    # Process the data here using the global DataFrames and user input
    processed_data = preprocess_data(user_input, enrollment_df, cpi_df, inflation_df, admission_df, hfce_df, external_data)

    response = {
        'status': 'success',
        'message': 'Data processed successfully',
        'processed_data': processed_data.to_json(orient='records')
    }
    return jsonify(response), 200


@app.route('/api/plot', methods=['POST'])
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
    FROM processed_data
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

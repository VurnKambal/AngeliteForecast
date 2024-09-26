from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

import os
import io
import json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import joblib
from dotenv import load_dotenv

from sqlalchemy import create_engine

from model import initialize_models, preprocess_data
from model import make_predictions, train_models

load_dotenv()

app = Flask(__name__)
CORS(app)
@app.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "Test successful"}), 200

# Get database configuration from environment variables
USERNAME = os.getenv('DB_USER')
PASSWORD = os.getenv('DB_PASSWORD')
HOST = os.getenv('DB_HOST')
PORT = os.getenv('DB_PORT')
DATABASE = os.getenv('DB_NAME')

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

    df = pd.DataFrame(data['processed_factors'])
    models = train_models(ENGINE, df, selected_model)
    return jsonify({"message": f"{selected_model.capitalize()} model trained successfully"}), 200

# Endpoint to make predictions
@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.get_json()
     
    processed_factors = data['processed_factors']
    df = pd.DataFrame(processed_factors)
   
    print(processed_factors, "processedddd")
    selectedModel = data["model"]
    start_year = data["start_year"]
    semester = data["semester"]
    year_level = data["year_level"]
    window_size = data["window_size"]

    all_departments = True if data["department"] == "All Departments" else False

    prediction = make_predictions(ENGINE, selectedModel, models, df, start_year, semester,
                                  year_level, window_size=window_size, all_departments=all_departments)
    print("prediction", prediction)
    return jsonify(prediction.to_json(orient='records')), 200

# New route to process data from React app
@app.route('/api/process-data', methods=['POST'])
def process_data(train=False):
    global models, enrollment_df, cpi_df, inflation_df, admission_df, hfce_df

    data = request.get_json()
    print(data, "dataaa")
    
    all_departments = True if data["Department"] == "All Departments" else False

    user_input = pd.DataFrame([data])
    numerical_features = ["Start_Year", "Semester"]
    user_input[numerical_features] = user_input[numerical_features].astype(int)
    use_external_data = data.get("UseExternalData")
    # Ensure the data has been queried
    if enrollment_df is None:
        query_data(ENGINE)  # Assuming ENGINE is your database connection
    
    print("engine", ENGINE)
    print(inflation_df)

    # Prepare external data
    external_data = {}
    if use_external_data:
        if data.get('AdmissionRate'):
            external_data['AdmissionRate'] = data['AdmissionRate']
        if data.get('CPIEducation'):
            external_data['CPIEducation'] = data['CPIEducation']
        if data.get('OverallHFCE'):
            external_data['OverallHFCE'] = data['OverallHFCE']
        if data.get('HFCEEducation'):
            external_data['HFCEEducation'] = data['HFCEEducation']
        if data.get('InflationRatePast'):
            external_data['InflationRatePast'] = data['InflationRatePast']

    if train:
        # Process the data here using the global DataFrames
        processed_data = preprocess_data(ENGINE, None, enrollment_df, cpi_df, inflation_df, admission_df, hfce_df, use_external_data=use_external_data, external_data=external_data, all_departments=all_departments)
        print("processed_data", processed_data)
        models = train_models(processed_data)
    else:
        if len(models) == 0:
            models = initialize_models()
    processed_data = preprocess_data(ENGINE, user_input, enrollment_df, cpi_df, inflation_df, admission_df, hfce_df, use_external_data=use_external_data, external_data=external_data, all_departments=all_departments)
    
    processed_data.to_csv("b.csv")
    response = {
        'status': 'success',
        'message': 'Data processed successfully',
        'processed_data': json.dumps(processed_data.to_dict(orient='records'), cls=NpEncoder)
    }   
    return jsonify(response), 200







@app.route('/api/plot', methods=['POST'])
def plot():
    data = request.json
    year_level = data.get('year_level', '1st_Year')  # Default to '1st_Year' if not provided
    major = data.get('major')
    model_name = data.get('model')
    
    # Find the correct CSV file
    csv_filename = f'prediction_results.csv'
    # if not os.path.exists(csv_filename):
    #     return jsonify({"error": f"No prediction results found for {model_name} and {year_level}"}), 404
    
    # Read the prediction results from the SQL database
    query = "SELECT * FROM model_result"
    df = pd.read_sql(query, ENGINE)
    print(f"Prediction data:\n{df}\n\n")
    
    # Get actual values of major data from the database
    query = f"""
    SELECT "Start_Year", "Semester", "{year_level}"
    FROM processed_data
    WHERE "Major" = '{major}'
    ORDER BY "Start_Year", "Semester"
    """
    major_data = pd.read_sql(query, ENGINE)
    print(query)
    print(f"Major data:\n{major_data}\n\n")
    
    # Map semester to month
    semester_to_month = {1: 6, 2: 11}  # 1 -> June (6), 2 -> November (11)
    df[["Start_Year", "Semester"]] = df[["Start_Year", "Semester"]].astype(int)
    major_data[["Start_Year", "Semester"]] = major_data[["Start_Year", "Semester"]].astype(int)
    
    # Create a new column 'Date' by combining Start_Year and Semester
    major_data['Date'] = pd.to_datetime(major_data['Start_Year'].astype(str) + '-' + 
                                        major_data['Semester'].map(semester_to_month).astype(str) + '-01')
    df['Date'] = pd.to_datetime(df['Start_Year'].astype(str) + '-' + 
                                df['Semester'].map(semester_to_month).astype(str) + '-01')
    
    major_data = major_data.sort_values('Date')
    df = df.sort_values('Date')

    # Fill NaN values in the year_level column with 0 for years where we only have predictions
    major_data[year_level].fillna(0, inplace=True)
    
    # Plot the time graph
    plt.figure(figsize=(12, 6))
    plt.plot(major_data['Date'], major_data[year_level], label='Actual', marker='o')
    
    # Plot predictions for training data
    train_data = df[df['Is_Train']]
    plt.plot(train_data['Date'], train_data['Prediction'], label='Train Prediction', linestyle=':', marker='d', color='orange')

    # Plot predictions for test data
    test_data = df[~df['Is_Train']]
    plt.plot(test_data['Date'], test_data['Prediction'], label='Test Prediction', linestyle='-.', marker='x', color='red')
    
    plt.xlabel('Date')
    plt.ylabel(f'{year_level} Enrollment')
    plt.title(f'Actual vs Predicted {year_level} Enrollment for {major} using {model_name}')
    plt.legend()
    
    # Add grid for better readability
    plt.grid(True, linestyle='--', alpha=0.7)
    
    # Rotate x-axis labels for better visibility
    plt.xticks(rotation=45)
    
    # Tight layout to prevent cutting off labels
    plt.tight_layout()
    
    # Save the plot to a BytesIO object
    img = io.BytesIO()
    plt.savefig(img, format='png', dpi=300)
    img.seek(0)
    
    # Clear the current figure
    plt.clf()
    
    return send_file(img, mimetype='image/png')


# Update model hashes
from hash import update_model_hashes

try:
    update_model_hashes()
    print("Successfully updated model hashes")
except Exception as e:
    print(f"Error updating model hashes: {e}")

if __name__ == '__main__':

    app.run(host='0.0.0.0', debug=True, port=8000)
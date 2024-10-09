from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename

import os
import io
import json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import joblib
from dotenv import load_dotenv

from sqlalchemy import create_engine, text

from model import initialize_models, preprocess_data, preprocess_data_batch
from model import make_predictions, make_predictions_batch, train_models

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
@app.route('/python/train', methods=['POST'])
def train():
    data = request.get_json()
    selected_model = data.get('model')
    
    if not selected_model:
        return jsonify({"error": "Model type not specified"}), 400

    df = pd.DataFrame(data['processed_factors'])
    models = train_models(ENGINE, df, selected_model)
    return jsonify({"message": f"{selected_model.capitalize()} model trained successfully"}), 200

# Endpoint to make predictions
@app.route('/python/predict', methods=['POST'])
def predict():
    data = request.get_json()
     
    processed_factors = data['processed_factors']
    df = pd.DataFrame(processed_factors)
   
    
    year_level = data["year_level"]
    window_size = data["window_size"]
    print(year_level, "yearrrrrrrr")
    isBatch = data.get("isBatch", False)
    print(isBatch)
    if isBatch is False:
        selectedModel = data['model']
        start_year = data["start_year"]
        semester = data["semester"]
        prediction = make_predictions(ENGINE, selectedModel, models, df, start_year, semester,
                                      year_level, window_size=window_size)
    else:
        print("Batchhh")
        prediction = make_predictions_batch(ENGINE, models, year_level, window_size=window_size)
        print("finished batch", year_level)
    print("prediction", prediction)
    return jsonify(prediction.to_json(orient='records')), 200

# New route to process data from React app
@app.route('/python/process-data', methods=['POST'])
def process_data(train=False):
    global models, enrollment_df, cpi_df, inflation_df, admission_df, hfce_df

    data = request.get_json()
    user_input = pd.DataFrame([data])
    numerical_features = ["Start_Year", "Semester"]
    user_input[numerical_features] = user_input[numerical_features].astype(int)
    use_external_data = data.get("UseExternalData")
    print(data, "dataaaaaaaaaaa", use_external_data)
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
        processed_data = preprocess_data(ENGINE, None, enrollment_df, cpi_df, inflation_df, admission_df, hfce_df, use_external_data=use_external_data, external_data=external_data)
        print("processed_data", processed_data)
        models = train_models(processed_data)
    else:
        if len(models) == 0:
            models = initialize_models()
    processed_data = preprocess_data(ENGINE, user_input, enrollment_df, cpi_df, inflation_df, admission_df, hfce_df, use_external_data=use_external_data, external_data=external_data)
    
    response = {
        'status': 'success',
        'message': 'Data processed successfully',
        'processed_data': json.dumps(processed_data.to_dict(orient='records'), cls=NpEncoder)
    }   
    return jsonify(response), 200







@app.route('/python/plot', methods=['POST'])
def plot():
    data = request.json
    year_level = data.get('year_level', '1st_Year')  # Default to '1st_Year' if not provided
    major = data.get('major')
    model_name = data.get('model')
    
    # Find the correct CSV file
    # csv_filename = f'prediction_results.csv'
    # if not os.path.exists(csv_filename):
    #     return jsonify({"error": f"No prediction results found for {model_name} and {year_level}"}), 404
    
    # Read the prediction results from the SQL database
    print(model_name, "modellll")
    query = f"SELECT * FROM {model_name.lower()}_result"
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

@app.route('/python/plot-data', methods=['POST'])
def plot_data():
    data = request.json
    year_level = data.get('year_level', '1st_Year')
    major = data.get('major')
    model_name = data.get('model')
    
    # Read the prediction results from the SQL database
    query = f"SELECT * FROM {model_name.lower()}_result"
    df = pd.read_sql(query, ENGINE)
    
    # Get actual values of major data from the database
    query = f"""
    SELECT "Start_Year", "Semester", "{year_level}"
    FROM processed_data
    WHERE "Major" = '{major}'
    ORDER BY "Start_Year", "Semester"
    """
    major_data = pd.read_sql(query, ENGINE)
    
    # Map semester to month
    semester_to_month = {1: 6, 2: 11}
    df[["Start_Year", "Semester"]] = df[["Start_Year", "Semester"]].astype(int)
    major_data[["Start_Year", "Semester"]] = major_data[["Start_Year", "Semester"]].astype(int)
    
    # Create a new column 'Date' by combining Start_Year and Semester
    major_data['Date'] = pd.to_datetime(major_data['Start_Year'].astype(str) + '-' + 
                                        major_data['Semester'].map(semester_to_month).astype(str) + '-01')
    df['Date'] = pd.to_datetime(df['Start_Year'].astype(str) + '-' + 
                                df['Semester'].map(semester_to_month).astype(str) + '-01')
    
    major_data = major_data.sort_values('Date')
    df = df.sort_values('Date')

    # Prepare data for JSON response
    actual = major_data[['Date', year_level]].to_dict('records')
    train_prediction = df[df['Is_Train']][['Date', 'Prediction']].to_dict('records')
    test_prediction = df[~df['Is_Train']][['Date', 'Prediction']].to_dict('records')

    return jsonify({
        'actual': actual,
        'trainPrediction': train_prediction,
        'testPrediction': test_prediction
    })

# Update model hashes
from hash import update_model_hashes

try:
    update_model_hashes()
    print("Successfully updated model hashes")
except Exception as e:
    print(f"Error updating model hashes: {e}")

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'csv'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS



# Update the upload_csv function to use preprocess_data_batch
@app.route('/python/upload-csv', methods=['POST'])
def upload_csv():
    global models, enrollment_df, cpi_df, inflation_df, admission_df, hfce_df
    print("Csv_processingggg")
    if len(models) == 0:
        models = initialize_models()
    if 'file' not in request.files:
        return jsonify({"status": "error", "message": "No file part"}), 400
    
    file = request.files['file']

    if file.filename == '':
        return jsonify({"status": "error", "message": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            new_data = pd.read_csv(filepath)
            
            # Ensure the data has been queried
            if enrollment_df is None:
                query_data(ENGINE)

            # Convert Start_Year and Semester to integers
            numerical_features = ["Start_Year", "Semester"]
            new_data[numerical_features] = new_data[numerical_features].astype(int)
            

            # Prepare external data (assuming it's included in the CSV)
            external_data_columns = ['AdmissionRate', 'CPIEducation', 'OverallHFCE', 'HFCEEducation', 'InflationRatePast']
            use_external_data = any(col in new_data.columns for col in external_data_columns)
            external_data = {col: new_data[col].iloc[0] for col in external_data_columns if col in new_data.columns}

            processed_data = {}
            for year_level in ["1st_Year", "2nd_Year", "3rd_Year", "4th_Year"]:
                # Process the data
                print(year_level, "processing")
                processed = preprocess_data_batch(
                    ENGINE, 
                    new_data, 
                    enrollment_df, 
                    cpi_df, 
                    inflation_df, 
                    admission_df, 
                    hfce_df, 
                    year_level=year_level,
                    use_external_data=use_external_data,
                    external_data=external_data
                )
                # Convert DataFrame to dict
                processed_data[year_level] = processed.to_dict(orient='records')

            # Clean up the uploaded file
            os.remove(filepath)
            return jsonify({
                "status": "success",
                "message": "Processed CSV",
                'processed_data': json.dumps(processed_data)
            }), 200
        
        except Exception as e:
            print("Error processing CSV:", e)
            # Clean up the uploaded file in case of an error
            if os.path.exists(filepath):
                os.remove(filepath)
            return jsonify({"status": "error", "message": str(e)}), 500
    
    return jsonify({"status": "error", "message": "Invalid file type"}), 400

import joblib


@app.route('/python/compile-csv', methods=['GET'])
def compile_csv():
    try:
        # SQL query to fetch data from all year levels
        query = """
        SELECT 
            '1st Year' as "Year_Level", "Major", "Start_Year", "Semester", 
            "Prediction_Ensemble", "Prediction_SES", "Prediction_MA"
        FROM "1st_Year_predictions_result"
        UNION ALL
        SELECT 
            '2nd Year' as "Year_Level", "Major", "Start_Year", "Semester", 
            "Prediction_Ensemble", "Prediction_SES", "Prediction_MA"
        FROM "2nd_Year_predictions_result"
        UNION ALL
        SELECT 
            '3rd Year' as "Year_Level", "Major", "Start_Year", "Semester", 
            "Prediction_Ensemble", "Prediction_SES", "Prediction_MA"
        FROM "3rd_Year_predictions_result"
        UNION ALL
        SELECT 
            '4th Year' as "Year_Level", "Major", "Start_Year", "Semester", 
            "Prediction_Ensemble", "Prediction_SES", "Prediction_MA"
        FROM "4th_Year_predictions_result"
        ORDER BY "Major", "Year_Level", "Start_Year", "Semester"
        """

        # Execute the query and load results into a DataFrame
        df = pd.read_sql(text(query), ENGINE)
        print("compiling csv")
        print(df.head())

        try:
            # Create a buffer to store the CSV file
            buffer = io.StringIO()
            df.to_csv(buffer, index=False)
            buffer.seek(0)

            # Send the CSV file
            return send_file(
                io.BytesIO(buffer.getvalue().encode()),
                mimetype='text/csv',
                as_attachment=True,
                download_name='predictions_result.csv'  # Changed from attachment_filename

            )

        except Exception as e:
            print("error:", e)
            return jsonify({'error': str(e)}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/python/predict-batch', methods=['POST'])
def predict_batch():
    try:
        data = request.get_json()
        # print(data, "dataaaa")
      
        
        print("Batchhhh")
        start_year = data["start_year"]
        semester = data["semester"]
        window_size = data.get("window_size", 4)  # Use get() in case it's not provided
        
        # Load columns from columns.pkl
        columns_dict = joblib.load('data/columns.pkl')
        
        # Get unique majors from the data
        year_levels = ["1st_Year", "2nd_Year", "3rd_Year", "4th_Year"]
        
        all_predictions = []
        
        for year_level in year_levels:
            print(year_level, "Predicting Batch")
            processed_factors = pd.read_sql(f'SELECT * FROM "{year_level}_processed_data"', ENGINE)
           
            # Get the correct columns for this year level
            correct_columns = columns_dict.get(year_level, [])
            
            processed_factors = processed_factors[correct_columns]

            # Reindex the DataFrame to include only the correct columns
            processed_factors = processed_factors.reindex(columns=correct_columns, fill_value=0)
            
            prediction_data = {
                'processed_factors': processed_factors.to_dict(orient='records'),
                'start_year': start_year,
                'semester': semester,
                'year_level': year_level,
                'window_size': window_size,
                'isBatch': True
            }
            
            # Use the existing predict() function
            with app.test_request_context(json=prediction_data):
                response = predict()
                prediction = json.loads(response[0].get_data(as_text=True))
            
            # Convert prediction to a list if it's not already
            
            if isinstance(prediction, str):
                prediction = json.loads(prediction)
            # Add Major and Year_Level to the prediction
            for pred in prediction:
                pred['Year_Level'] = year_level
            
            # print(all_predictions,"allll")
            all_predictions.extend([prediction])
        
        # Convert all_predictions to a DataFrame
        final_predictions = pd.DataFrame(all_predictions)
        
        # print("Batch predictions:", final_predictions)
        return jsonify(final_predictions.to_dict(orient='records')), 200
    except Exception as e:
        print(e, "error")



if __name__ == '__main__':

    app.run(host='0.0.0.0', debug=True, port=8000)
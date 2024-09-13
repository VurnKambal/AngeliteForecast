import json
from flask import jsonify
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import xgboost as xgb
import os
import joblib
import hashlib

from hash import compute_file_hash
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA


from statsmodels.tsa.api import SimpleExpSmoothing
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.neighbors import KNeighborsRegressor
from sklearn.svm import SVR

from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

similar_majors_dict = {
    # CCJEF
    "Criminology": ["BS Criminology"], # Combine Criminology and BS Criminology

    
    # SAS
    "ABComm": ["BA Comm"],
    "CommArts": ["BA Comm"],
    "AdvPublicRel": ["BA Comm"], # Area of Specialization
    # "CommArts": "BA Comm",     # Lack of Data | Drop


    # SBA
    "Accounting": ["Accountancy"],
    "Accounting Tech": ["BSAcctgInfoSys"],
    "BSBA-BM-Marketi": ["BusMgt", "BSBA-MktgMgmt"],
    "BussMgmt-HRM": ["BusMgt", "BSBA-HRMgmt"],


    # SEA
    "ECE": ["ELECENG"],
    # "BSCE-CEM": ["CE", "BSCE-CEM"],
    # "BSCE-SE": ["CE", "BSCE-SE"],
    # "BSCE-TE": ["CE", "BSCE-TE"],




    # SED
    "BEED-MajSPED": ["BSNEd"],           # Name change?
    "BEED-SpecialEdu": ["BSNEd"],        # Name change?
    "BPE-SPE": ["BPEd"],                   # Name change?
    "BSED-ValEd": ["BSED-RelValEd"],
    "BSMath": ["Math"],
    

    # SHTM
    "BS EventMgmt": ["BSTM-Events"],


    # SOC
    "BSCSSysDev": ["BSCompsci"],              # New Curriculum
    "BSITAnimation": ["BSEMC-DA"],            # New Curriculum
    "BSITAreaAnimati": ["BSEMC-DA"],          # New Curriculum
    "BSCyberplusPSM": ["BSCybersecurity"],    # Same Major but with Professional Science Master's Degree
    # "BSInfoTech": "BSIT",                 # General IT Major | Lack of Data | Drop
    # "BSITMultiTec": "BSIT",               # Discontinued | Lack of Data | Drop
    "BSITAreaNetAdmi": ["BSITNetAdmin"], 
    "BSITAreaWebDev": ["BSITWebdev"],

    }


# List of majors to drop
drop_majors = [
    # MA
    # "MAPEH-BSED",     # Lack of data | Discontinued | SED Department?
    "MBM",              # Lack of data | only 1 student
    "MSEngMgmt",        # Lack of data | only 1 student
    

    # SAS
    # "CommArts",         # Lack of data | only 1 student
    "LanguageLit",      # Lack of data | only 1 student

    # SED
    
    # SHTM
    "BSBATourism",
    "BSTM-Tourism",     # Lack of data | BSTourism? | only 2 students


    # SOC
    "AssCompSci",       # Lack of data | only 1 student
    "BSITMultiTec",     # Lack of data | Discontinued
    "BSInfoTech",       # Lack of data | only 1 student

    # SEA
    "ECETech.",        # Lack of data | Discontinued


    # Extras | Aggregate Counts
    "TOTAL",
    "GRAND TOTAL",
]


# Threshold for the total number of students in a major in its lifetime
threshold = 10



def create_lag_features(data, lag_steps=1, group=["Major"], target="1st_Year"):
    if group:
        for i in range(1, lag_steps + 1):
            data[f'{target}_lag_{i}'] = data.groupby(group)[target].shift(i)
    else:
        for i in range(1, lag_steps + 1):
            data[f'{target}_lag_{i}'] = data[target].shift(i)
    return data

def create_rolling_mean(data, group=["Major"], window_size=3, target="1st_Year", min_periods=1, lag_steps=0):
    lag_string = f'_lag_{lag_steps}' if lag_steps else ""
    if group:
        data[f'{target}_rolling_mean{lag_string}'] = data.groupby(group)[target].shift(lag_steps).rolling(window=window_size, min_periods=min_periods).mean().values
    else:
        data[f'{target}_rolling_mean{lag_string}'] = data[target].shift(lag_steps).rolling(window=window_size, min_periods=min_periods).mean()
    return data

def create_rolling_std(data, group=["Major"], window_size=3, target="1st_Year", min_periods=1, lag_steps=0):
    lag_string = f'_lag_{lag_steps}' if lag_steps else ""
    if group:
        data[f'{target}_rolling_std{lag_string}'] = data.groupby(group)[target].shift(lag_steps).rolling(window=window_size, min_periods=min_periods).std().values
    else:
        data[f'{target}_rolling_std{lag_string}'] = data[target].shift(lag_steps).rolling(window=window_size, min_periods=min_periods).std()
    return data

def ensemble_metrics(train_true_values, train_pred_values, test_true_values, test_pred_values):
    train_true_values = np.array(train_true_values)
    train_pred_values = np.array(train_pred_values)
    test_true_values = np.array(test_true_values)
    test_pred_values = np.array(test_pred_values)
    print('-'*75)
    print('Ensemble (Simple Exponential Smoothing + Random Forest + XGBoost DART)')
    print('-'*75)


    print("TEST")
    modelresults(test_true_values, test_pred_values)
    print('-'*75)


    print("TRAIN")
    modelresults(train_true_values, train_pred_values)
    print('-'*75)



# SMAPE
def smape(y_true, y_pred):
    return np.mean(2 * np.abs((y_true - y_pred) /  (np.abs(y_true) + np.abs(y_pred)))) * 100

# MAPE
def mape(y_true, y_pred):
    return np.mean(np.abs((y_true - y_pred) /  y_true)) * 100


def modelresults(y_true, predictions):
    mae = mean_absolute_error(y_true, predictions)
    rmse = np.sqrt(mean_squared_error(y_true, predictions))
    r2 = r2_score(y_true, predictions)
    smape_score = smape(y_true, predictions)
    mape_score = mape(y_true, predictions)

    print(f"Symmetric Mean Absolute Percentage Error: {smape_score:.2f}%")
    print(f'Mean Absolute Percentage Error: {mape_score:.2f}%')
    print(f'Mean Absolute Error: {mae:.4f}')
    print(f'Root Mean Squared Error: {rmse:.4f}')
    print(f'R2 Score: {r2*100:.4f}')



def determine_start_month(semester):
    if semester == 1:
       return 6  # June
    else:
        
        return 11  # November
    


def safe_load_model(file_path, expected_hash):
    """Safely load a joblib-serialized model after verifying its hash."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Model file not found: {file_path}")
    
    actual_hash = compute_file_hash(file_path)
    if actual_hash != expected_hash:
        raise ValueError(f"Model file hash mismatch for {file_path}. File may have been tampered with.")
    
    return joblib.load(file_path)

def initialize_models():
    # Load expected hashes from JSON file
    try:
        with open(os.path.join("models", 'model_hashes.json'), 'r') as f:
            expected_hashes = json.load(f)
            
    except FileNotFoundError:
        raise FileNotFoundError("model_hashes.json not found. Please run the hash update script.")

    models = {}
    print("expected_hashes", expected_hashes, "\n\n\n\n\n")
    for model_name, expected_hash in expected_hashes.items():
        file_path = os.path.join("models", model_name)
        try:
            models[model_name.split('.')[0]] = safe_load_model(file_path, expected_hash)
        except (FileNotFoundError, ValueError) as e:
            print(f"Error loading {model_name}: {str(e)}")
            # Handle the error appropriately

    return models

def clean_data(df):
    
    similar_majors_dict = {
        # CCJEF
        "Criminology": ["BS Criminology"], # Combine Criminology and BS Criminology

        
        # SAS
        "ABComm": ["BA Comm"],
        "CommArts": ["BA Comm"],
        "AdvPublicRel": ["BA Comm"], # Area of Specialization
        # "CommArts": "BA Comm",     # Lack of Data | Drop


        # SBA
        "Accounting": ["Accountancy"],
        "Accounting Tech": ["BSAcctgInfoSys"],
        "BSBA-BM-Marketi": ["BusMgt", "BSBA-MktgMgmt"],
        "BussMgmt-HRM": ["BusMgt", "BSBA-HRMgmt"],


        # SEA
        "ECE": ["ELECENG"],
        # "BSCE-CEM": ["CE", "BSCE-CEM"],
        # "BSCE-SE": ["CE", "BSCE-SE"],
        # "BSCE-TE": ["CE", "BSCE-TE"],




        # SED
        "BEED-MajSPED": ["BSNEd"],           # Name change?
        "BEED-SpecialEdu": ["BSNEd"],        # Name change?
        "BPE-SPE": ["BPEd"],                   # Name change?
        "BSED-ValEd": ["BSED-RelValEd"],
        "BSMath": ["Math"],
        

        # SHTM
        "BS EventMgmt": ["BSTM-Events"],


        # SOC
        "BSCSSysDev": ["BSCompsci"],              # New Curriculum
        "BSITAnimation": ["BSEMC-DA"],            # New Curriculum
        "BSITAreaAnimati": ["BSEMC-DA"],          # New Curriculum
        "BSCyberplusPSM": ["BSCybersecurity"],    # Same Major but with Professional Science Master's Degree
        # "BSInfoTech": "BSIT",                 # General IT Major | Lack of Data | Drop
        # "BSITMultiTec": "BSIT",               # Discontinued | Lack of Data | Drop
        "BSITAreaNetAdmi": ["BSITNetAdmin"], 
        "BSITAreaWebDev": ["BSITWebdev"],

        }

    # Dictionary for major with incorrect department
    incorrect_department_dict = {
        "BSBA-HRM": "SBA",
        # "MAPEH-BSED": "SED",
    }

    department_dict = {
        "CHTM" : "SHTM",
        "CICT" : "SOC",
    }

    # List of majors to drop
    drop_majors = [
        # MA
        # "MAPEH-BSED",     # Lack of data | Discontinued | SED Department?
        "MBM",              # Lack of data | only 1 student
        "MSEngMgmt",        # Lack of data | only 1 student
        

        # SAS
        # "CommArts",         # Lack of data | only 1 student
        "LanguageLit",      # Lack of data | only 1 student

        # SED
        
        # SHTM
        "BSBATourism",
        "BSTM-Tourism",     # Lack of data | BSTourism? | only 2 students


        # SOC
        "AssCompSci",       # Lack of data | only 1 student
        "BSITMultiTec",     # Lack of data | Discontinued
        "BSInfoTech",       # Lack of data | only 1 student

        # SEA
        "ECETech.",        # Lack of data | Discontinued


        # Extras | Aggregate Counts
        "TOTAL",
        "GRAND TOTAL",
    ]
    
    # Step 1: Replace similar majors
    for old_majors, new_major  in similar_majors_dict.items():
        df['Major'] = df['Major'].replace(old_majors, new_major[0])

    # Step 2: Correct departments

    for major, department in incorrect_department_dict.items():
        df.loc[df["Major"]== major, 'Department'] = department
        
    # Step 3: Rename departments
    df['Department'] = df['Department'].replace(department_dict)

    # Step 4: Drop unwanted majors
    df = df[~df['Major'].isin(drop_majors)]

    # Step 6: Combine majors with the same name within the same semester
    df = df.groupby(['Start_Year', 'Semester', 'Major', 'Department'], as_index=False).sum(["1st_Year", "2nd_Year", "3rd_Year", "4th_Year", "5th_Year", "Grade_12", "TOTAL"])
    print(df[df["Department"] == "SHS"])
    shs_df = df[df["Department"] == "SHS"].pivot_table(index=["Start_Year", "Semester"], columns="Major", values="Grade_12").reset_index()
    shs_df["Start_Year"] += 1
    shs_df = shs_df.fillna(0)
    shs_df = shs_df.rename(columns={col: f"{col}_lag_1" for col in shs_df.columns.drop(["Start_Year", "Semester"])})

    print("zzzzzzzzzz", shs_df)
    df = df[~df['Department'].isin(['GS', 'JHS', 'SHS', 'HAUSPELL'])]
    df = df[~df['Major'].isin(['TOTAL', 'GRAND TOTAL'])]
    print(df)
    df = df.drop(df.loc[:, "2nd_Year":"Grade_11"].columns, axis=1)
    df = df.merge(shs_df, on=["Start_Year", "Semester"], how="left")
    df = df.reset_index(drop=True)
    

    return df


def preprocess_data(user_input, enrollment_df, cpi_df, inflation_df, admission_df, hfce_df, train=False):
    
    print(enrollment_df.columns)
    dept_encoder = joblib.load(os.path.join('data', 'dept_encoder.pkl'))
    major_encoder = joblib.load(os.path.join('data', 'major_encoder.pkl'))
    dept_pca = joblib.load(os.path.join('data', 'dept_pca.pkl'))
    major_pca = joblib.load(os.path.join('data', 'major_pca.pkl'))
    columns = joblib.load(os.path.join("data", "columns.pkl"))
    print("enrollment_df", enrollment_df[enrollment_df["Major"] == "SHS"])
    enrollment_df = clean_data(enrollment_df)
    
    # Combine user input with past major data
    major = user_input['Major'].iloc[0]
    start_year = user_input['Start_Year'].iloc[0]
    semester = user_input['Semester'].iloc[0]

    # Create a DataFrame from user input
    if user_input is not None:

        # Filter out rows from enrollment_df that match the Start_Year and Semester of the user input
        enrollment_df = enrollment_df.query(f"Start_Year < {start_year} or (Start_Year == {start_year} and Semester <= {semester})")

    else:
        columns.insert(3, "1st_Year")

    
    print("df", enrollment_df)

    # Create prediction DataFrame
    X_pred = enrollment_df[["Major", "Department", "Start_Year", "Semester"]].copy()
    # X_pred = pd.DataFrame()
    # X_pred["Major"] = df["Major"]
    # X_pred["Department"] = df["Department"]
    # X_pred["Start_Year"] = df["Start_Year"]
    # X_pred["Semester"] = df["Semester"]

    X_pred["Start_Month"] = X_pred["Semester"].apply(determine_start_month)
    
    # Process admission data
    admission_df_copy = admission_df.copy()
    admission_df_copy = admission_df_copy.drop(columns=["Number_of_Processed_Applicants", "Number_of_Enrolled_Applicants"])
    admission_df_copy["Department"] = admission_df_copy["Department"].replace("CICT", "SOC")
    
    admission_2024 = admission_df_copy[admission_df_copy["Start_Year"] == 2023].copy()
    admission_2024["Start_Year"] = 2024
    admission_2024["Number_of_Applicants"] = float('nan')
    admission_df_copy = pd.concat([admission_df_copy, admission_2024], ignore_index=True)
    admission_df_copy = admission_df_copy.sort_values(by=['Start_Year']).reset_index(drop=True)
    admission_df_copy = admission_df_copy[admission_df_copy["Start_Year"] <= 2024]
    admission_df_copy = create_rolling_std(admission_df_copy, group=["Department"], target="Number_of_Applicants", window_size=3, min_periods=1, lag_steps=1)
    admission_df_copy = admission_df_copy.fillna(0)

    # Process CPI data
    cpi_df_copy = cpi_df.copy()
    cpi_df_copy["Month"] = cpi_df_copy["Month"].map({
        "Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6,
        "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12,
    })
    cpi_df_copy = cpi_df_copy.dropna()
    cpi_df_copy[["Year", "Month"]] = cpi_df_copy[["Year", "Month"]].astype(int)
    cpi_df_copy = create_rolling_std(cpi_df_copy, group=None, target="CPI_Region3", window_size=6, lag_steps=1)

    # Process inflation data
    inflation_df_copy = inflation_df[["Start_Year", "Inflation_Rate"]].copy()
    inflation_df_copy = inflation_df_copy.dropna()
    inflation_2024 = inflation_df_copy[inflation_df_copy["Start_Year"] == 2023].copy()
    inflation_2024["Start_Year"] = 2024
    inflation_2024["Inflation_Rate"] = float('nan')
    inflation_df_copy = pd.concat([inflation_df_copy, inflation_2024], ignore_index=True)
    inflation_df_copy = inflation_df_copy.sort_values(by=['Start_Year']).reset_index(drop=True)
    inflation_df_copy = inflation_df_copy[inflation_df_copy["Start_Year"] <= 2024]
    inflation_df_copy = create_rolling_std(inflation_df_copy, group=None, target="Inflation_Rate", window_size=5, lag_steps=1)
    inflation_df_copy = inflation_df_copy.drop(columns=["Inflation_Rate"])

    # Process HFCE data
    hfce_df_copy = hfce_df.dropna()
    hfce_df_copy = create_lag_features(hfce_df_copy, group=None, target="HFCE_Education", lag_steps=2)
    hfce_df_copy = create_rolling_std(hfce_df_copy, group=None, target="HFCE_Education", window_size=3)
    hfce_df_copy = create_lag_features(hfce_df_copy, group=None, target="HFCE", lag_steps=2)
    hfce_df_copy = create_rolling_std(hfce_df_copy, group=None, target="HFCE", window_size=4)
    hfce_df_copy['Semester'] = hfce_df_copy['Quarter'].map({
        1: None,
        2: 1,
        3: None,
        4: 2,
    })
    hfce_df_copy = hfce_df_copy.dropna()
    hfce_df_copy = hfce_df_copy.drop(columns=["Quarter", "HFCE_Education", "HFCE"])

    # Merge processed data
    X_pred = X_pred.merge(cpi_df_copy, left_on=["Start_Year", "Start_Month"], right_on=["Year", "Month"], how="left")
    X_pred = X_pred.merge(inflation_df_copy, on=["Start_Year"], how="left")
    X_pred = X_pred.merge(admission_df_copy, on=["Department", "Start_Year"], how="left")
    X_pred = X_pred.merge(hfce_df_copy, on=["Start_Year", "Semester"], how="left")
    
    # Drop unnecessary columns
    X_pred = X_pred.drop(columns=["Year", "Month"])

    enrollment_df = create_lag_features(enrollment_df, lag_steps=1, target="TOTAL")
    

    print("enrollment_df", enrollment_df)
    
    enrollment_df = create_lag_features(enrollment_df, lag_steps=1)
    enrollment_df = create_rolling_std(enrollment_df, lag_steps=1, window_size=3)
    enrollment_df = enrollment_df.query("Start_Year > 2018")

    # Step 1: Group by year and major to get the sum of students in each major for each year
    grouped = enrollment_df.groupby(['Start_Year', 'Semester', 'Major'])['1st_Year_lag_1'].sum().reset_index()

    # Step 2: Calculate the total number of students for each year
    total_students_per_year = grouped.groupby(['Start_Year', 'Semester'])['1st_Year_lag_1'].sum().reset_index()
    total_students_per_year.rename(columns={'1st_Year_lag_1': 'Total_1st_Year_Students_lag_1'}, inplace=True)
    print("enrollment_df", enrollment_df, "\n\n\n\n\n")
 

    # Step 3: Merge the total students per year with the grouped data
    distribution_df = pd.merge(grouped, total_students_per_year, on=['Start_Year', 'Semester'])

    # Step 4: Calculate the percentage distribution of each major
    distribution_df['Percentage_Distribution_lag_1'] = (distribution_df['1st_Year_lag_1'] / distribution_df['Total_1st_Year_Students_lag_1']) * 100
    
    print(major, distribution_df.iloc[:,3:])
    distribution_df.to_csv("distribution_df.csv")
    enrollment_df = enrollment_df.query(f"Major == '{major}'")
    distribution_df = distribution_df.query(f"Major == '{major}'")
    print("enrollment_df", enrollment_df)
    X_pred = X_pred.merge(enrollment_df, on=["Major", "Department", "Start_Year", "Semester"], how="left")

    print(len(X_pred), X_pred)
    X_pred = X_pred.merge(distribution_df.drop(columns=["1st_Year_lag_1"]), on=['Start_Year', 'Semester', 'Major'])
    # Encode Department and Major
    dept_encoded = dept_encoder.transform(X_pred[['Department']])
    major_encoded = major_encoder.transform(X_pred[['Major']])

    # Apply PCA transformation
    dept_pca_result = dept_pca.transform(dept_encoded)
    major_pca_result = major_pca.transform(major_encoded)

    # Create PCA result DataFrames
    dept_pca_df = pd.DataFrame(dept_pca_result, columns=['Department_PC1', 'Department_PC2'])
    major_pca_df = pd.DataFrame(major_pca_result, columns=['Major_PC1', 'Major_PC2'])

    # Combine all processed data
    X_pred = pd.concat([X_pred, dept_pca_df, major_pca_df], axis=1)
    
    X_pred = X_pred.drop(columns=["CPI_Region3", "Number_of_Applicants", 'TOTAL', "Department", "Start_Month", "End_Year"])


    print("X_pred", X_pred.columns)
    print(X_pred)
    # Reorder the columns of X_pred to match the order in columns.pkl
    X_pred = X_pred.reindex(columns=columns, fill_value=0)

    # Check if all required columns are present
    missing_columns = set(columns) - set(X_pred.columns)
    if missing_columns:
        print(f"Warning: The following columns are missing: {missing_columns}")
        # You might want to handle missing columns here, e.g., by adding them with default values

    print(X_pred.info())
    # Ensure all columns in X_pred are in the correct order
    X_pred = X_pred[columns].fillna(0)
    return X_pred

# Helper functions (create_rolling_std, create_lag_features) should be defined here

# ensemble_metrics(train_true_values, train_pred_values, test_true_values, test_pred_values)


# Save models
# joblib.dump(models, "models/final/ensemble_models.pkl")





# Function to train models for each major
def train_models(engine, data, weight_ses=0.2, weight_rf=0.4, weight_xgb=0.1, end_year=None):
    """
    engine: SQLAlchemy engine object
    data: DataFrame containing the data
    weight_ses: weight for the SES model
    weight_rf: weight for the Random Forest model
    weight_xgb: weight for the XGBoost model
    end_year: end year for training data
    """
    # Endpoint to train models
    df = pd.DataFrame(data)
    
    # Tuned parameters during past training
    params = json.load(open(os.path.join("data", "tuned_params.json")))
    rf_params = params["rf"]
    xgb_params = params["xgb"]

    print("df", df)
    
    # Determine the end year for training data
    if end_year is None:
        end_year = df['Start_Year'].max() - 1
    
    # Train Random Forest model
    X_train = df[df['Start_Year'] <= end_year].drop(columns=["1st_Year", "Major"])
    y_train = df[df['Start_Year'] <= end_year]['1st_Year']
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
        major_data = df[(df['Major'] == major) & (df['Start_Year'] <= end_year)]
        X_major_train = major_data.drop(columns=['Major', 'Start_Year', '1st_Year'])
        y_major_train = major_data['1st_Year']
        if len(y_major_train) > 1:
            # Train SES model
            ses_model = SimpleExpSmoothing(y_major_train).fit(smoothing_level=0.8, optimized=False)
            models["ses_models"][major] = ses_model
        else:
            print(f"Skipping SES model for {major} because it has less than 2 data points.")
    
    return models

# Function to make predictions
def make_predictions(engine, selectedModel, models, data, start_year, semester, weight_ses=0.2, weight_rf=0.4, weight_xgb=0.1):
    """
    engine: SQLAlchemy engine objectl
    selectedModel: selected model for prediction
    models: models for prediction
    data: DataFrame containing the data
    weight_ses: weight for the SES model
    weight_rf: weight for the Random Forest model
    weight_xgb: weight for the XGBoost model
    engine: SQLAlchemy engine object
    """
    data_pred = data.query(f"Start_Year == {start_year} and Semester == {semester}")
    if len(data_pred) == 0:
        return "No data found"
    
    print("data_pred", data_pred)
    major = data['Major'].iloc[0]
    pred_year = data_pred['Start_Year'].iloc[0]
    pred_semester = data_pred['Semester'].iloc[0]
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
        case "random_forest":
            rf_model = models["rf_model"]
            y_major_train_pred = rf_model.predict(X_major_train)
            y_major_pred = rf_model.predict(X_major_pred)
            predictions = {
                "train_pred": y_major_train_pred,
                "test_pred": y_major_pred
            }
            print("predictions", predictions)
        
        case "xgboost":     
            xgb_model = models["xgb_model"]

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

        case "linear_regression":
            if "lr_models" not in models:
                lr_model = LinearRegression()
                lr_model.fit(X_major_train, y_major_train)
                models["lr"] = lr_model
            else:
                lr_model = models["lr_models"].get(major)
                print(lr_model)

            y_major_train_pred = lr_model.predict(X_major_train)
            y_major_pred = lr_model.predict(X_major_pred)
            predictions = {
                "train_pred": y_major_train_pred,
                "test_pred": y_major_pred
            }

        case "knn":
            if "knn_model" not in models:
                knn_model = KNeighborsRegressor(n_neighbors=5)  # You can adjust n_neighbors
                knn_model.fit(X_major_train, y_major_train)
                models["knn"] = knn_model
            else:
                knn_model = models["knn_model"]
            y_major_train_pred = knn_model.predict(X_major_train)
            y_major_pred = knn_model.predict(X_major_pred)
            predictions = {
                "train_pred": y_major_train_pred,
                "test_pred": y_major_pred
            }

        case "svr":
            if "svr_model" not in models:
                svr_model = SVR(kernel='rbf')  # You can adjust the kernel
                svr_model.fit(X_major_train, y_major_train)
                models["svr"] = svr_model
            else:
                svr_model = models["svr_model"]
            y_major_train_pred = svr_model.predict(X_major_train)
            y_major_pred = svr_model.predict(X_major_pred)
            predictions = {
                "train_pred": y_major_train_pred,
                "test_pred": y_major_pred
            }
        
        case "ensemble":
            # Ensure the weights sum to 1
            total_weight = weight_ses + weight_rf + weight_xgb
            weight_ses /= total_weight
            weight_rf /= total_weight
            weight_xgb /= total_weight

            rf_model = models["rf_model"]
            xgb_model = models["xgb_model"]
            ensembled_models = models["ensembled_models"].get(major)
            print("ensembled_models", models)
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
    return predictions_df["Prediction"].iloc[-1]
    
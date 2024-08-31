import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

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
    "MAPEH-BSED": "SED",
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
    

# def query_data():
#     # Query data from the database
#     pass
#     df = pd.read_csv("data/Enrollment_Data.csv")            # Change to database query
#     cpi_df = pd.read_csv("data/CPI_Education.csv")          # Change to database query
#     inflation_df = pd.read_csv("data/Inflation_Rate.csv")   # Change to database query
#     admission_df = pd.read_csv("data/Admission_Data.csv")   # Change to database query
#     hfce_df = pd.read_csv("data/HFCE.csv")                  # Change to database query




from sqlalchemy import create_engine
import pandas as pd

def connect_to_database(username, password, host='localhost', port=5432, db_name='angeliteforecast'):
    """Create a database connection."""
    connection_string = f'postgresql://{username}:{password}@{host}:{port}/{db_name}'
    engine = create_engine(connection_string)
    return engine

def query_data(engine):
    # Query data from the database using the provided engine
    df = pd.read_sql("SELECT * FROM enrollment", engine)            # Changed to database query
    cpi_df = pd.read_sql("SELECT * FROM cpi_education", engine)          # Changed to database query
    inflation_df = pd.read_sql("SELECT * FROM inflation_rate", engine)   # Changed to database query
    admission_df = pd.read_sql("SELECT * FROM admission", engine)   # Changed to database query
    hfce_df = pd.read_sql("SELECT * FROM hfce", engine)                  # Changed to database query

    return df, cpi_df, inflation_df, admission_df, hfce_df



# Example usage
if __name__ == "__main__":
    engine = connect_to_database('postgres', 'thesis')
    data = query_data(engine)

def initialize_models():
    # Load the models
    rf_model = joblib.load("models/final/rf_model.pkl")
    xgb_model = joblib.load("models/final/xgb_model.pkl")
    ensembled_models = joblib.load("models/final/ensembled_models.pkl")
    models = {
        "rf": rf_model,
        "xgb": xgb_model,
        "ensembled": ensembled_models
    }
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
        "MAPEH-BSED": "SED",
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
    df = df.groupby(['Start_Year', 'Semester', 'Major', 'Department'], as_index=False).sum(["1st_Year", "2nd_Year", "3rd_Year", "4th_Year", "5th_Year", "TOTAL"])

    shs_df = df[df["Department"] == "SHS"].pivot_table(index=["Start_Year", "Semester"], columns="Major", values="Grade_12").reset_index()

    df = df[~df['Department'].isin(['GS', 'JHS', 'SHS', 'HAUSPELL'])]
    df = df[~df['Major'].isin(['TOTAL', 'GRAND TOTAL'])]
    df = df.drop(df.loc[:, "2nd_Year":"Grade_12"].columns, axis=1)
    df = df.merge(shs_df, on=["Start_Year", "Semester"], how="left")
    df = df.reset_index(drop=True)
    

    return df


def preprocess_data(user_input, enrollment_df, cpi_df, inflation_df, admission_df, hfce_df):
    
    dept_encoder = joblib.load('data/dept_encoder.pkl')
    major_encoder = joblib.load('data/major_encoder.pkl')
    dept_pca = joblib.load('data/dept_pca.pkl')
    major_pca = joblib.load('data/major_pca.pkl')
    columns = joblib.load("data/columns.pkl")
   
    # Create a DataFrame from user input
    df = user_input

    # Create prediction DataFrame
    X_pred = pd.DataFrame()
    X_pred["Major"] = df["Major"]
    X_pred["Department"] = df["Department"]
    X_pred["Start_Year"] = df["Start_Year"]
    X_pred["Semester"] = df["Semester"]
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

    enrollment_df = clean_data(enrollment_df)
    print("-"*50, enrollment_df.columns)
    enrollment_df = create_lag_features(enrollment_df, lag_steps=1)
    enrollment_df = create_rolling_std(enrollment_df, lag_steps=1, window_size=3)
    enrollment_df = create_lag_features(enrollment_df, lag_steps=2, target="TOTAL")

    X_pred = X_pred.merge(enrollment_df, on=["Major", "Department", "Start_Year", "Semester"], how="left")

    # Step 1: Group by year and major to get the sum of students in each major for each year
    grouped = enrollment_df.groupby(['Start_Year', 'Semester', 'Major'])['1st_Year_lag_1'].sum().reset_index()

    # Step 2: Calculate the total number of students for each year
    total_students_per_year = grouped.groupby(['Start_Year', 'Semester'])['1st_Year_lag_1'].sum().reset_index()
    total_students_per_year.rename(columns={'1st_Year_lag_1': 'Total_1st_Year_Students_lag_1'}, inplace=True)

    # Step 3: Merge the total students per year with the grouped data
    distribution_df = pd.merge(grouped, total_students_per_year, on=['Start_Year', 'Semester'])

    # Step 4: Calculate the percentage distribution of each major
    distribution_df['Percentage_Distribution_lag_1'] = (distribution_df['1st_Year_lag_1'] / distribution_df['Total_1st_Year_Students_lag_1']) * 100


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

    # Reorder the columns of X_pred to match the order in columns.pkl
    X_pred = X_pred.reindex(columns=columns, fill_value=0)

    # Check if all required columns are present
    missing_columns = set(columns) - set(X_pred.columns)
    if missing_columns:
        print(f"Warning: The following columns are missing: {missing_columns}")
        # You might want to handle missing columns here, e.g., by adding them with default values

    # Ensure all columns in X_pred are in the correct order
    X_pred = X_pred[columns]
    return X_pred

# Helper functions (create_rolling_std, create_lag_features) should be defined here

# ensemble_metrics(train_true_values, train_pred_values, test_true_values, test_pred_values)


# Save models
# joblib.dump(models, "models/final/ensemble_models.pkl")
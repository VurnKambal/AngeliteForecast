import json
from flask import jsonify
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import xgboost as xgb

import joblib
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

def create_rolling_std(df, group=None, target=None, window_size=3, min_periods=1, lag_steps=0):
    lag_string = f'_lag_{lag_steps}' if lag_steps else ""
    if group:
        df[f'{target}_rolling_std{lag_string}'] = df.groupby(group)[target].shift(lag_steps).transform(lambda x: x.rolling(window=window_size, min_periods=min_periods).std())
    else:
        df[f'{target}_rolling_std{lag_string}'] = df[target].shift(lag_steps).rolling(window=window_size, min_periods=min_periods).std()
    return df

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





def initialize_models():
    # Load the models
    rf_models = joblib.load("models/rf_models.pkl")
    xgb_models = joblib.load("models/xgb_models.pkl")
    lr_models = joblib.load("models/lr_models.pkl")
    knn_models = joblib.load("models/knn_models.pkl")     # NOT USED
    models = {
        "rf": rf_models,
        "xgb": xgb_models,
        "lr": lr_models,
        "knn": knn_models,
    }
    # models = joblib.load("models/ensembled_models.pkl")

    return models

def clean_data(engine, df):
    
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
    
    # numerical_columns = ['Start_Year', 'Semester', '1st_Year', '2nd_Year',
    #                      '3rd_Year', '4th_Year', '5th_Year', 'TOTAL'] + \
    #                     [col for col in df.columns if col.startswith('Grade_')]
    # df[numerical_columns] = df[numerical_columns].fillna(0).astype(int)
    #     # Step 1: Replace similar majors
    for old_majors, new_major  in similar_majors_dict.items():
        df['Major'] = df['Major'].replace(old_majors, new_major[0])

    # Step 2: Correct departments

    for major, department in incorrect_department_dict.items():
        df.loc[df["Major"]== major, 'Department'] = department
        
    # Step 3: Rename departments
    df['Department'] = df['Department'].replace(department_dict)
    
    # Step 4: Drop unwanted majors
    df = df[~df['Major'].isin(drop_majors)]
    
    df = df.fillna(0)
    df = df.groupby(['Start_Year', 'Semester', 'Major', 'Department'], as_index=False).sum(["1st_Year", "2nd_Year", "3rd_Year", "4th_Year", "5th_Year", "Grade_12", "TOTAL"])
    
    

    df.to_sql("processed_data", engine, if_exists="replace", index=False)
    return df

def process_shs_data(df):
    # Step 6: Combine majors with the same name within the same semester
    shs_df = df[df["Department"] == "SHS"].pivot_table(index=["Start_Year", "Semester"], columns="Major", values="Grade_12").reset_index()
    shs_df['Semester'] = shs_df['Semester'] % 2 + 1
    shs_df.loc[shs_df['Semester'] == 1, 'Start_Year'] += 1
    shs_df = shs_df.fillna(0)
    shs_df = shs_df.rename(columns={col: f"{col}_lag_1" for col in shs_df.columns.drop(["Start_Year", "Semester"])})

    df = df[~df['Department'].isin(['GS', 'JHS', 'SHS', 'HAUSPELL'])]
    df = df[~df['Major'].isin(['TOTAL', 'GRAND TOTAL'])]

    grade_columns = [col for col in df.columns if col.startswith("Grade_")]
    df = df.drop(columns=grade_columns)
    df = df.merge(shs_df, on=["Start_Year", "Semester"], how="left")
    df = df.reset_index(drop=True)
    return df


def create_features_by_year_level(df, year_level):
    match year_level:
        case "1st_Year":
            df = create_lag_features(df, target="1st_Year", lag_steps=1)
            df = df.rename(columns={"1st_Year_lag_1": "Previous_Semester"})
            df = create_rolling_std(df, target="1st_Year", lag_steps=1, window_size=3)
        case "2nd_Year":
            df = create_lag_features(df, target="1st_Year", lag_steps=1)
            # df = df.drop(columns=["1st_Year_lag_1"])
            df = create_lag_features(df, target="2nd_Year", lag_steps=1)
            # Create a new column based on semester and lagged values
            df['Previous_Semester'] = df.apply(lambda row: 
                                           row['1st_Year_lag_1'] if row['Semester'] == 1 
                                           else row['2nd_Year_lag_1'] if row['Semester'] == 2
                                           else None, axis=1)
            df = df.drop(columns=["1st_Year_lag_1"])
            df = create_rolling_std(df, target="2nd_Year", lag_steps=1, window_size=3)
        
        case "3rd_Year":
            df = create_lag_features(df, target="2nd_Year", lag_steps=1)
            # df = df.drop(columns=["1st_Year_lag_1"])
            df = create_lag_features(df, target="3rd_Year", lag_steps=1)
            # Create a new column based on semester and lagged values
            df['Previous_Semester'] = df.apply(lambda row: 
                                           row['2nd_Year_lag_1'] if row['Semester'] == 1 
                                           else row['3rd_Year_lag_1'] if row['Semester'] == 2
                                           else None, axis=1)
            df = df.drop(columns=["2nd_Year_lag_1"])
            df = create_rolling_std(df, target="3rd_Year", lag_steps=1, window_size=3)
        
        case "4th_Year":
            df = create_lag_features(df, target="3rd_Year", lag_steps=1)
            # df = df.drop(columns=["1st_Year_lag_1"])
            df = create_lag_features(df, target="4th_Year", lag_steps=1)
            # Create a new column based on semester and lagged values
            df['Previous_Semester'] = df.apply(lambda row: 
                                           row['3rd_Year_lag_1'] if row['Semester'] == 1 
                                           else row['4th_Year_lag_1'] if row['Semester'] == 2
                                           else None, axis=1)
            df = df.drop(columns=["3rd_Year_lag_1"])
            df = create_rolling_std(df, target="4th_Year", lag_steps=1, window_size=3)
        
        case _:
            raise ValueError(f"Unsupported year level: {year_level}")
    
    return df


def preprocess_data(engine, user_input, enrollment_df, cpi_df, inflation_df, admission_df, hfce_df, use_external_data=False, external_data=None, train=False):
    dept_encoder = joblib.load('data/dept_encoder.pkl')
    major_encoder = joblib.load('data/major_encoder.pkl')
    dept_pca = joblib.load('data/dept_pca.pkl')
    major_pca = joblib.load('data/major_pca.pkl')
    year_level = user_input["Year_Level"].iloc[0]

    print(user_input, "inputtt")
    columns = joblib.load("data/columns.pkl").get(year_level)
    enrollment_df = clean_data(engine, enrollment_df)

    # Combine user input with past major data
    major = user_input['Major'].iloc[0]
    start_year = user_input['Start_Year'].iloc[0]
    semester = user_input['Semester'].iloc[0]

    # Create a DataFrame from user input
    if user_input is not None:
        # Filter out rows from enrollment_df that match the Start_Year and Semester of the user input
        enrollment_df = enrollment_df.query(f"Start_Year < {start_year} or (Start_Year == {start_year} and Semester <= {semester})")

    else:
        columns.insert(3, year_level)

    # Check if user input year and semester are in the data
    max_year = enrollment_df['Start_Year'].max()
    max_semester = enrollment_df[enrollment_df['Start_Year'] == max_year]['Semester'].max()
    
    if (user_input['Start_Year'].iloc[0] > max_year) or \
       (user_input['Start_Year'].iloc[0] == max_year and user_input['Semester'].iloc[0] > max_semester):
        new_year = user_input['Start_Year'].iloc[0]
        new_semester = user_input['Semester'].iloc[0]
        # Add a row with null values for enrollment data
        latest_year_data = enrollment_df[enrollment_df['Start_Year'] == enrollment_df['Start_Year'].max()].copy()
        new_row_enrollment = latest_year_data.copy()
        new_row_enrollment['Start_Year'] = new_year
        new_row_enrollment['Semester'] = new_semester
        new_row_enrollment['Department'] = enrollment_df[enrollment_df['Major'] == user_input['Major'].iloc[0]]['Department'].iloc[0]
            
        new_row_enrollment.loc[:, "1st_Year":] = 0

        enrollment_df = pd.concat([enrollment_df, new_row_enrollment], ignore_index=True)
        # Add a row with null values for CPI data
        new_row_cpi = cpi_df.iloc[-1].copy()
        new_row_cpi['Year'] = new_year
        new_row_cpi.loc[new_row_cpi.index != 'Year'] = 0
        cpi_df = pd.concat([cpi_df, new_row_cpi.to_frame().T], ignore_index=True)

       
        # Add a row with null values for admission data
        new_row_admission = admission_df.iloc[-1].copy()
        new_row_admission['Start_Year'] = new_year
        new_row_admission['Department'] = user_input['Major'].iloc[0]
        new_row_admission.loc[new_row_admission.index.difference(['Start_Year', 'Department'])] = 0
        admission_df = pd.concat([admission_df, new_row_admission.to_frame().T], ignore_index=True)

        # Add a row with null values for HFCE data
        new_row_hfce = hfce_df.iloc[-1].copy()
        new_row_hfce['Start_Year'] = new_year
        new_row_hfce.loc[new_row_hfce.index != 'Start_Year'] = 0
        hfce_df = pd.concat([hfce_df, new_row_hfce.to_frame().T], ignore_index=True)


    enrollment_df = process_shs_data(enrollment_df)
    # Create prediction DataFrame
    X_pred = enrollment_df[["Major", "Department", "Start_Year", "Semester"]].copy()

    X_pred["Start_Month"] = X_pred["Semester"].apply(determine_start_month)
    
    # Process admission data
    
    if use_external_data and 'AdmissionRate' in external_data:
        admission_df.loc[admission_df['Start_Year'] == start_year, 'Number_of_Applicants'] = external_data['AdmissionRate']
    admission_df = admission_df.drop(columns=["Number_of_Processed_Applicants", "Number_of_Enrolled_Applicants"])

    admission_df = admission_df.sort_values(by=['Start_Year']).reset_index(drop=True)
    admission_df = create_lag_features(admission_df, group=["Department"], target="Number_of_Applicants", lag_steps=1)
    admission_df = create_rolling_std(admission_df, group=["Department"], target="Number_of_Applicants", window_size=3, min_periods=1, lag_steps=0)
    admission_df = admission_df.fillna(0)


    # Process CPI data
    cpi_df_copy = cpi_df.copy()
    cpi_df_copy = cpi_df_copy[cpi_df_copy["Month"] != "Ave"]  # Exclude "Ave" rows
    
    cpi_df_copy = cpi_df_copy.dropna()
    cpi_df_copy[["Year"]] = cpi_df_copy[["Year"]].astype(int)
    cpi_df_copy = cpi_df_copy.groupby("Year")["CPI_Region3"].mean().reset_index()
    print(use_external_data , "sssss", 'CPIEducation' in external_data)
    if use_external_data and 'CPIEducation' in external_data:
        cpi_df_copy.loc[cpi_df_copy['Year'] == start_year, 'CPI_Region3'] = external_data['CPIEducation']
        print(cpi_df_copy, "cpiiii", external_data['CPIEducation'])

    cpi_df_copy = create_rolling_std(cpi_df_copy, group=None, target="CPI_Region3", window_size=6, lag_steps=0)
    print(cpi_df_copy, "cccccc")
    # Process inflation data
    inflation_df_copy = inflation_df[["Start_Year", "Inflation_Rate"]].copy()
    inflation_df_copy = inflation_df_copy.dropna()

    inflation_next_year = None
    if use_external_data and 'InflationRatePast' in external_data:
        inflation_df_copy.loc[inflation_df_copy['Start_Year'] == start_year, 'Inflation_Rate'] = external_data['InflationRatePast']
    else:
        latest_year = inflation_df_copy["Start_Year"].max()
        next_year = latest_year + 1
        inflation_next_year = inflation_df_copy[inflation_df_copy["Start_Year"] == latest_year].copy()
        inflation_next_year["Start_Year"] = next_year
        inflation_next_year["Inflation_Rate"] = float('nan')
    inflation_df_copy = pd.concat([inflation_df_copy, inflation_next_year], ignore_index=True)
    inflation_df_copy = inflation_df_copy.sort_values(by=['Start_Year']).reset_index(drop=True)
    inflation_df_copy = inflation_df_copy[inflation_df_copy["Start_Year"] <= 2024]
    inflation_df_copy = create_rolling_std(inflation_df_copy, group=None, target="Inflation_Rate", window_size=5, lag_steps=1)
    inflation_df_copy = inflation_df_copy.drop(columns=["Inflation_Rate"])

    
    hfce_df = hfce_df.groupby('Start_Year').mean().reset_index()
    if use_external_data and 'OverallHFCE' in external_data:
        hfce_df.loc[hfce_df['Start_Year'] == start_year, 'HFCE'] = external_data['OverallHFCE']

    if use_external_data and 'HFCEEducation' in external_data:
        hfce_df.loc[hfce_df['Start_Year'] == start_year, 'HFCE_Education'] = external_data['HFCEEducation']


    hfce_df = create_lag_features(hfce_df, group=None, target="HFCE_Education", lag_steps=1)
    hfce_df = create_rolling_std(hfce_df, group=None, target="HFCE_Education", window_size=6)

    hfce_df = create_lag_features(hfce_df, group=None, target="HFCE", lag_steps=1)
    hfce_df = create_rolling_std(hfce_df, group=None, target="HFCE", window_size=6)
   
    hfce_df = hfce_df.dropna()
    hfce_df = hfce_df.drop(columns=["Quarter", "HFCE_Education", "HFCE"])

    # Merge processed data
    X_pred = X_pred.merge(cpi_df_copy, left_on=["Start_Year"], right_on=["Year"], how="left")
    X_pred = X_pred.drop(columns=["Year"])

    X_pred = X_pred.merge(inflation_df_copy, on=["Start_Year"], how="left")

    if year_level == "1st_Year":
        X_pred = X_pred.merge(admission_df, on=["Department", "Start_Year"], how="left")
        X_pred = X_pred.drop(columns=["Number_of_Applicants"])

    X_pred = X_pred.merge(hfce_df, on=["Start_Year"], how="left")
    enrollment_df = enrollment_df.drop_duplicates()
    
    enrollment_df = create_features_by_year_level(enrollment_df, year_level)
    enrollment_df = create_lag_features(enrollment_df, lag_steps=1, target="TOTAL")
    
    enrollment_df = enrollment_df.query("Start_Year > 2018")
    # Step 1: Group by year and major to get the sum of students in each major for each year
    grouped = enrollment_df.groupby(['Start_Year', 'Semester', 'Major'])['Previous_Semester'].sum().reset_index()

    # Step 2: Calculate the total number of students for each year
    total_students_per_year = grouped.groupby(['Start_Year', 'Semester'])['Previous_Semester'].sum().reset_index()
    total_students_per_year = total_students_per_year.rename(columns={'Previous_Semester': 'Total_Previous_Semester_Students_lag_1'})

    # Step 3: Merge the total students per year with the grouped data
    distribution_df = pd.merge(grouped, total_students_per_year, on=['Start_Year', 'Semester'])

    # Step 4: Calculate the percentage distribution of each major
    distribution_df['Percentage_Distribution_lag_1'] = (distribution_df['Previous_Semester'] / distribution_df['Total_Previous_Semester_Students_lag_1']) * 100
    
    distribution_df = distribution_df.query(f"Major == '{major}'")
    X_pred = X_pred.merge(enrollment_df, on=["Major", "Department", "Start_Year", "Semester"], how="left")
    X_pred = X_pred.merge(distribution_df.drop(columns=["Previous_Semester"]), on=['Start_Year', 'Semester', 'Major'])

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
    
    X_pred = X_pred.drop(columns=["CPI_Region3", 'TOTAL', "Department", "Start_Month"])

    # Reorder the columns of X_pred to match the order in columns.pkl
    X_pred = X_pred.reindex(columns=columns, fill_value=None)

    # Check if all required columns are present
    missing_columns = set(columns) - set(X_pred.columns)
    if missing_columns:
        print(f"Warning: The following columns are missing: {missing_columns}")
        # You might want to handle missing columns here, e.g., by adding them with default values

    # Ensure all columns in X_pred are in the correct order
    X_pred = X_pred[columns].fillna(0)
    X_pred.to_sql("model_data", engine, if_exists="replace", index=False)
    print(X_pred.columns,"ssadad")
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
    params = json.load(open("data/tuned_params.json"))
    rf_params = params["rf"]
    xgb_params = params["xgb"]

    # Determine the end year for training data
    if end_year is None:
        end_year = df['Start_Year'].max() - 1
    
    # Train Random Forest model
    X_train = df[df['Start_Year'] <= end_year].drop(columns=[year_level])
    y_train = df[df['Start_Year'] <= end_year][year_level]
    rf_model = RandomForestRegressor(**rf_params, random_state=42)
    rf_model.fit(X_train, y_train)
    
    # Train XGBoost DART model
    dtrain = xgb.DMatrix(X_train, label=y_train, enable_categorical=True)
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
            models["ses"][major] = ses_model
        else:
            print(f"Skipping SES model for {major} because it has less than 2 data points.")
    
    return models

# Function to make predictions
def make_predictions(engine, selectedModel, models, data, start_year, semester, year_level, weight_ses=0.2, weight_rf=0.4, weight_xgb=0.1, window_size=None):
    """
    engine: SQLAlchemy engine object
    selectedModel: selected model for prediction
    models: models for prediction
    data: DataFrame containing the data
    weight_ses: weight for the SES model
    weight_rf: weight for the Random Forest model
    weight_xgb: weight for the XGBoost model
    engine: SQLAlchemy engine object
    """
    
    major = data['Major'][0]
    start_year = int(start_year)
    semester = int(semester)
    major_data = data[data['Major'] == major]
    predictions = {}
    X_major = major_data.reset_index(drop=True)
    X_major["Major"] = X_major["Major"].astype("category")

    # Query actual enrollment data
    actual_enrollment_query = f"""
    SELECT "Start_Year", "Semester", "1st_Year"
    FROM processed_data
    WHERE "Major" = '{major}'
    AND (
        ("Start_Year" > 2018 AND "Start_Year" < {start_year})
        OR 
        ("Start_Year" = {start_year} AND "Semester" <= '{semester}')
    )
    ORDER BY "Start_Year" ASC, "Semester" ASC
    """
    actual_enrollment = pd.read_sql_query(actual_enrollment_query, engine).fillna(0)
    # Split the data into training and prediction sets
    y_major_train = actual_enrollment[
        (actual_enrollment['Start_Year'].astype(int) < start_year) | 
        ((actual_enrollment['Start_Year'].astype(int) == start_year) & (actual_enrollment['Semester'].astype(int) < semester))
    ]['1st_Year'].values

    y_major_pred = actual_enrollment[
        (actual_enrollment['Start_Year'] == start_year) & 
        (actual_enrollment['Semester'] == semester)
    ]['1st_Year'].values

    # Check if y_major_pred is empty
    if len(y_major_pred) == 0:
        print(f"No actual data available for prediction period: {start_year} Semester {semester}")
    else:
        print(f"Actual enrollment for {start_year} Semester {semester}: {y_major_pred[0]}")
        
    # Split X_major into train and pred
    X_major_train = X_major[(X_major['Start_Year'] < start_year) | ((X_major['Start_Year'] == start_year) & (X_major['Semester'] < semester))]
    X_major_pred = X_major[(X_major['Start_Year'] == start_year) & (X_major['Semester'] == semester)]

    X_major_train_non_xgb = X_major_train.drop(columns=["Major"])
    X_major_pred_non_xgb = X_major_pred.drop(columns=["Major"])

    match(selectedModel.lower()):
        case "random_forest":
            X_major_train_non_xgb = X_major_train.drop(columns=["Major"])
            X_major_pred_non_xgb = X_major_pred.drop(columns=["Major"])

            rf_model = models["rf"].get(year_level)
            y_major_train_pred = rf_model.predict(X_major_train_non_xgb)
            y_major_pred = rf_model.predict(X_major_pred_non_xgb)
            predictions = {
                "train_pred": y_major_train_pred,
                "test_pred": y_major_pred
            }
        
        case "xgboost":     
            xgb_model = models["xgb"].get(year_level)
            X_major_pred.to_sql("model_major", engine, if_exists="replace", index=False)
            dtrain = xgb.DMatrix(X_major_train, enable_categorical=True)
            dpred = xgb.DMatrix(X_major_pred, enable_categorical=True)
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

        case "linear_regression":
            if "lr" not in models:
                lr_model = LinearRegression()
                lr_model.fit(X_major_train_non_xgb, y_major_train)
                models["lr"] = lr_model
            else:
                lr_model = models["lr"].get(year_level).get(major)

            y_major_train_pred = lr_model.predict(X_major_train_non_xgb)
            y_major_pred = lr_model.predict(X_major_pred_non_xgb)
            predictions = {
                "train_pred": y_major_train_pred,
                "test_pred": y_major_pred
            }

        case "knn":
            if "knn" not in models:
                knn_model = KNeighborsRegressor(n_neighbors=4) 
                knn_model.fit(X_major_train_non_xgb, y_major_train)
                models["knn"] = knn_model
            else:
                knn_model = models["knn"].get(year_level)
        

            y_major_train_pred = knn_model.predict(X_major_train_non_xgb)
            # y_major_train_pred = scaler_y.inverse_transform(y_major_train_pred.reshape(-1,1)).flatten()
            y_major_pred = knn_model.predict(X_major_pred_non_xgb)
            # y_major_pred = scaler_y.inverse_transform(y_major_pred.reshape(-1,1)).flatten()
            predictions = {
                "train_pred": y_major_train_pred,
                "test_pred": y_major_pred
            }

        case "svr":     # NOT USED
            if "svr" not in models:
                svr_model = SVR(kernel='rbf')  # You can adjust the kernel
                svr_model.fit(X_major_train_non_xgb, y_major_train)
                models["svr"] = svr_model
            else:
                svr_model = models["svr"]
            y_major_train_pred = svr_model.predict(X_major_train_non_xgb)
            y_major_pred = svr_model.predict(X_major_pred_non_xgb)
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


            rf_model = models["rf"].get(year_level)
            xgb_model = models["xgb"].get(year_level)

            ses_model = SimpleExpSmoothing(y_major_train, initialization_method="estimated").fit(smoothing_level=0.6, optimized=True, use_brute=True)
            dtrain = xgb.DMatrix(X_major_train, enable_categorical=True)
            dpred = xgb.DMatrix(X_major_pred, enable_categorical=True)

            y_major_train_pred_ses = ses_model.fittedvalues
            y_major_train_pred_rf = rf_model.predict(X_major_train_non_xgb)
            y_major_train_pred_xgb = xgb_model.predict(dtrain)
            
            y_major_train_pred_combined = (weight_ses * y_major_train_pred_ses +
                                           weight_rf * y_major_train_pred_rf +
                                           weight_xgb * y_major_train_pred_xgb)
            
            y_major_pred_ses = ses_model.forecast(steps=len(X_major_pred_non_xgb))
            y_major_pred_rf = rf_model.predict(X_major_pred_non_xgb)
            y_major_pred_xgb = xgb_model.predict(dpred)

            y_major_pred_combined = (weight_ses * y_major_pred_ses +
                                     weight_rf * y_major_pred_rf +
                                     weight_xgb * y_major_pred_xgb)

            predictions = {
                "train_pred": y_major_train_pred_combined,
                "test_pred": y_major_pred_combined
            }
        case "moving_average":
            # Define the window size for the moving average

            # Ensure we have enough data points for the moving average
            if len(y_major_train) < window_size:
                print(f"Warning: Not enough data points for moving average. Using all available data.")
                window_size = len(y_major_train)

            # Calculate moving average for training data
            y_major_train_pred_ma = pd.Series(y_major_train).rolling(window=window_size, min_periods=1).mean().values

            # Calculate moving average for test data (forecasting)
            last_window = y_major_train[-window_size:]
            y_major_pred_ma = np.array([last_window.mean()])
            # If we need to forecast multiple steps ahead, we can use this approach:
            # for _ in range(len(X_major_pred)):
            #     next_forecast = last_window.mean()
            #     y_major_pred_ma = np.append(y_major_pred_ma, next_forecast)
            #     last_window = np.append(last_window[1:], next_forecast)

            predictions = {
                "train_pred": y_major_train_pred_ma,
                "test_pred": y_major_pred_ma
            }

            # print(f"Moving Average (window size {window_size}):")
            # print(f"Last training prediction: {y_major_train_pred_ma[-1]}")
            # print(f"Test prediction: {y_major_pred_ma[0]}")

            # # Calculate error metrics for training data
            # train_rmse = np.sqrt(mean_squared_error(y_major_train, y_major_train_pred_ma))
            # train_mae = mean_absolute_error(y_major_train, y_major_train_pred_ma)
            # train_r2 = r2_score(y_major_train, y_major_train_pred_ma)

            # print(f"Training RMSE: {train_rmse}")
            # print(f"Training MAE: {train_mae}")
            # print(f"Training R2: {train_r2}")

            # # If we have actual test data, calculate error metrics
            # if len(y_major_pred) > 0:
            #     test_rmse = np.sqrt(mean_squared_error(y_major_pred, y_major_pred_ma))
            #     test_mae = mean_absolute_error(y_major_pred, y_major_pred_ma)
            #     print(f"Test RMSE: {test_rmse}")
            #     print(f"Test MAE: {test_mae}")
            # else:
            #     print("No actual test data available for error calculation.")
        case "simple_exponential_smoothing":
            ses_model = SimpleExpSmoothing(y_major_train, initialization_method="estimated").fit(smoothing_level=0.6, optimized=True, use_brute=True)
            y_major_train_pred_ses = ses_model.fittedvalues
            y_major_pred_ses = ses_model.forecast(steps=len(X_major_pred))

            predictions = {
                "train_pred": y_major_train_pred_ses,
                "test_pred": y_major_pred_ses
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
    
    # Concatenate predictions_df with major_data
    predictions_df = pd.concat([major_data[["Start_Year", "Semester", "Major"]], predictions_df], axis=1)
    
    # Save the concatenated data to SQL
    predictions_df.to_sql(f'{selectedModel.lower()}_result', engine, if_exists="replace", index=False)

    predictions_df = predictions_df.merge(X_major[["Start_Year", "Semester", "Previous_Semester"]], on=["Start_Year", "Semester"])
    
    # Calculate attrition rate
    predictions_df['Attrition_Rate'] = (predictions_df['Previous_Semester'] - predictions_df['Prediction']) / predictions_df['Previous_Semester'] * 100
    
    # Return the last prediction, previous semester, and attrition rate
    last_prediction = predictions_df.iloc[-1]
    print(predictions_df)
    return predictions_df[["Prediction", "Previous_Semester", "Attrition_Rate"]]

    
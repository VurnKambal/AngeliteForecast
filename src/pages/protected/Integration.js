import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import axios from "axios";
import { useDropzone } from 'react-dropzone';

import DashboardStats from "../../features/dashboard/components/DashboardStats";
import TitleCard from "../../components/Cards/TitleCard";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import CircleStackIcon from "@heroicons/react/24/outline/CircleStackIcon";
import CreditCardIcon from "@heroicons/react/24/outline/CreditCardIcon";
import InteractivePlot from "../../components/InteractivePlot";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Forecast" }));
  }, [dispatch]);

  const [formData, setFormData] = useState({
    Start_Year: "",
    Semester: "",
    Department: "",
    Major: "",
    Year_Level: "",
    UseExternalData: false,
    AdmissionRate: "",
    CPIEducation: "",
    OverallHFCE: "",
    HFCEEducation: "",
    InflationRate: "",
  });

  const [selectedModel, setSelectedModel] = useState("");
  const [movingAverageRange, setMovingAverageRange] = useState(2);
  const [departments, setDepartments] = useState([]);
  const [majors, setMajors] = useState([]);
  const [latestDataYear, setLatestDataYear] = useState(null);
  const [latestExternalData, setLatestExternalData] = useState({});
  const [predictionResult, setPredictionResult] = useState({
    Prediction: null,
    Previous_Semester: null,
    Attrition_Rate: null,
  });

  const [latestSchoolYear, setLatestSchoolYear] = useState(null);
  const [latestSemester, setLatestSemester] = useState(null);
  const [statsData, setStatsData] = useState([]);

  const [showResults, setShowResults] = useState(false);

  const [batchPredictionResults, setBatchPredictionResults] = useState({});
  const [batchPlotData, setBatchPlotData] = useState({});
  const [showBatchResults, setShowBatchResults] = useState(false);

  const [file, setFile] = useState(null);

  const [plotData, setPlotData] = useState({});

  const [batchSummary, setBatchSummary] = useState([]);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);


  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.csv',
    multiple: false
  });

  const uploadCSV = async () => {
    if (!file) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsBatchProcessing(true);

      // Upload CSV and get processed data
      const uploadResponse = await axios.post(
        `${process.env.REACT_APP_PYTHON_API_BASE_URL}/python/upload-csv`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(uploadResponse.data)
      if (uploadResponse.data.status !== "success" || !uploadResponse.data.processed_data) {
        console.error("Error processing CSV data:", uploadResponse.data);
        return;
      }

      const processedData = JSON.parse(uploadResponse.data.processed_data);
      const batchPredictions = {};
      const batchPlotData = {};
      console.log(processedData, "processed")
      for (const year_level in processedData){
        const data = processedData[year_level]
        console.log("data:", data)
        const dataPredictions = {};

        const predictPayload = {
          year_level: year_level,
          start_year: data[data.length - 1].Start_Year,
          semester: data[data.length - 1].Semester,
          processed_factors: data,
        };

        try {
          // Make prediction
          const predictionResult = await axios.post(
            `${process.env.REACT_APP_PYTHON_API_BASE_URL}/python/predict-batch`,
            predictPayload
          );
          

        } catch (error) {
          console.log(error)
        }
        
       
        const dataKey = `${year_level}_${data[data.length - 1].Start_Year}_${data[data.length - 1].Semester}`;
        batchPredictions[dataKey] = dataPredictions;
      }


    

      // Call the compile-csv API after the prediction loop
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_PYTHON_API_BASE_URL}/python/compile-csv`,
          { responseType: 'blob' }
        );
        
        // Create a URL for the blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
        
        // Create a link element and trigger download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'prediction_results.csv');
        document.body.appendChild(link);
        link.click();
        
        // // Clean up
        // link.parentNode.removeChild(link);
        // window.URL.revokeObjectURL(url);

        setShowBatchResults(true);
        console.log("batch result")
      } catch (error) {
        console.error("Error downloading CSV:", error);
        // Handle error (e.g., show error message to user)
      } finally {
        setIsBatchProcessing(false);
      }
    } catch (error) {
      console.error("Error processing CSV and making predictions:", error);
      setIsBatchProcessing(false);
      // Handle error (e.g., show error message to user)
    }
  };

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        let selectedYear = formData.Start_Year;
        let selectedSemester = formData.Semester;
        let selectedDepartment = formData.Department;
        
      
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/dashboard-selected-stats`, {
          params: { selectedYear: selectedYear,
                    selectedSemester: selectedSemester,
                    selectedDepartment: selectedDepartment}
          }
        );
        const data = response.data;
        
        setStatsData([
          {
            title: `${data.admission.year} ${data.admission.department}`,
            value: data.admission.number_of_applicants.toLocaleString(),
            icon: <UserGroupIcon className="w-8 h-8" />,
            description: "Total Number of Applicants",
          },
          {
            title: `${data.enrollment.year}-${data.enrollment.year + 1} ${data.enrollment.semester} Sem`,
            value: data.enrollment.total.toLocaleString(),
            icon: <UserGroupIcon className="w-8 h-8" />,
            description: "Total Students",
          },
          {
            title: `${data.inflation.year} `,
            value: `${data.inflation.rate.toFixed(4)}%`,
            icon: <CreditCardIcon className="w-8 h-8" />,
            description: "Philippines Inflation Rate",
          },
          {
            title: `${data.hfce.year}`,
            value: data.hfce.value.toLocaleString(),
            icon: <CircleStackIcon className="w-8 h-8" />,
            description: 'Household Final Consumption Expenditure',
          },
          {
            title: `${data.cpi.year}`,
            value: data.cpi.value.toFixed(1),
            icon: <UsersIcon className="w-8 h-8" />,
            description: `${data.cpi.region} Consumer Price Index`,
          },
        ]);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        // Handle error (e.g., show error message to user)
      }
    };

    fetchStatsData();
  }, [formData.Start_Year, formData.Semester, formData.Department]);


  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/departments`
        );
        if (response.data && Array.isArray(response.data)) {
          setDepartments(response.data);
        } else {
          console.error("Unexpected department data structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  const fetchLatestDataYear = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/latest-data-year`
      );
      if (response.data && response.data.latestYear) {
        setLatestDataYear(response.data.latestYear);
      } else {
        console.error("Unexpected latest year data structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching latest data year:", error);
    }
  };

  useEffect(() => {
    fetchLatestDataYear();

    // Add this new fetch
    const fetchLatestSchoolYearAndSemester = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/latest-school-year-semester`
        );

        console.log(response.data);
        if (response.data) {
          setLatestSchoolYear(response.data.latestYear);
          setLatestSemester(response.data.latestSemester);
          
          // Set default values
          setFormData(prevData => ({
            ...prevData,
            Start_Year: response.data.latestYear,
            Semester: response.data.latestSemester === '1' ? '2' : '1'
          }));
        }
      } catch (error) {
        console.error("Error fetching latest school year and semester:", error);
      }
    };

    fetchLatestSchoolYearAndSemester();
  }, []);

  const fetchLatestExternalData = async (schoolYear, department) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/external-data`,
        {
          params: { schoolYear, department },
        }
      );
      console.log(response.data);
      setLatestExternalData(response.data);
    } catch (error) {
      console.error("Error fetching external data:", error);
      setLatestExternalData({});
    }
  };

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));

    // If school year or department changes, update external factors
    if (name === "Start_Year" || name === "Department") {
      const latestData = await fetchLatestExternalData(
        name === "Start_Year" ? value : formData.Start_Year,
        name === "Department" ? value : formData.Department
      );

      if (latestData) {
        setFormData((prevData) => ({
          ...prevData,
          CPIEducation: prevData.CPIEducation || latestData.CPIEducation,
          InflationRatePast:
            prevData.InflationRatePast || latestData.InflationRatePast,
          AdmissionRate: prevData.AdmissionRate || latestData.AdmissionRate,
          OverallHFCE: prevData.OverallHFCE || latestData.OverallHFCE,
          HFCEEducation: prevData.HFCEEducation || latestData.HFCEducation,
        }));
        setLatestExternalData(latestData);
      }
    }
  };

  const handleDepartmentChange = async (e) => {
    const department = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      Department: department,
      Major: "",
    }));

    if (formData.Start_Year) {
      const latestData = await fetchLatestExternalData(
        formData.Start_Year,
        department
      );
      if (latestData) {
        setFormData((prevData) => ({
          ...prevData,
          CPIEducation: prevData.CPIEducation || latestData.CPIEducation,
          InflationRatePast:
            prevData.InflationRatePast || latestData.InflationRatePast,
          AdmissionRate: prevData.AdmissionRate || latestData.AdmissionRate,
          OverallHFCE: prevData.OverallHFCE || latestData.OverallHFCE,
          HFCEEducation: prevData.HFCEEducation || latestData.HFCEducation,
        }));
        setLatestExternalData(latestData);
      }
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/majors`,
        {
          params: { department },
        }
      );
      if (response.data && Array.isArray(response.data)) {
        setMajors(response.data);
      } else {
        console.error("Unexpected majors data structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching majors:", error);
    }
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleMovingAverageRangeChange = (e) => {
    setMovingAverageRange(parseInt(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const processFactorsResponse = await axios.post(
        `${process.env.REACT_APP_PYTHON_API_BASE_URL}/python/process-data`,
        formData
      );
      if (
        processFactorsResponse.data.status !== "success" ||
        !processFactorsResponse.data.processed_data
      ) {
        console.error("Error processing data:", processFactorsResponse.data);
        return;
      }

      const processedFactors = JSON.parse(
        processFactorsResponse.data.processed_data
      );
      const cleanedProcessedFactors = processedFactors.map((item) =>
        Object.fromEntries(
          Object.entries(item).map(([key, value]) => [
            key,
            value === null ? 0 : value,
          ])
        )
      );

      const baseModelField = {
        major: formData.Major,
        year_level: formData.Year_Level,
        start_year: formData.Start_Year,
        semester: formData.Semester,
      };
      console.log(formData.Year_Level)
      const models = ['Ensemble', 'Simple_Exponential_Smoothing', 'Moving_Average'];
      const predictions = {};
      const newPlotData = {};

      for (const model of models) {
        const predictPayload = {
          ...baseModelField,
          model: model,
          processed_factors: cleanedProcessedFactors,
          use_external_data: formData.UseExternalData,
          admission_rate: formData.AdmissionRate,
          cpi_education: formData.CPIEducation,
          overall_hfce: formData.OverallHFCE,
          hfce_education: formData.HFCEEducation,
          inflation_rate_past: formData.InflationRatePast,
          window_size: model === "Moving_Average" ? movingAverageRange : null,
        };

        try {
          const predictionResult = await axios.post(
            `${process.env.REACT_APP_PYTHON_API_BASE_URL}/python/predict`,
            predictPayload
          );
          console.log(predictionResult, "result")
          const predictionsList = JSON.parse(predictionResult.data);
          const lastPrediction = predictionsList[predictionsList.length - 1];
          console.log(predictionsList)
          predictions[model] = {
            Prediction: Math.round(lastPrediction.Prediction),
            Previous_Semester: Math.round(lastPrediction.Previous_Semester),
            Attrition_Rate: lastPrediction.Attrition_Rate
          };

          try {
            const plotPayload = {
              ...baseModelField,
              model: model,
            };

            const plotResponse = await axios.post(
              `${process.env.REACT_APP_PYTHON_API_BASE_URL}/python/plot-data`,
              plotPayload
            );

            newPlotData[model] = plotResponse.data;
          } catch (error) {
            console.error(`Error fetching plot data for ${model}:`, error);
            newPlotData[model] = null;
          }
        } catch (error) {
          console.error(`Error predicting with ${model}:`, error);
          predictions[model] = null;
        }
      }

      setPredictionResult(predictions);
      setPlotData(newPlotData);
      setShowResults(true);
      console.log("Predictions:", predictions);
      console.log("Plot Data:", newPlotData);
    } catch (error) {
      console.error("Error submitting form:", error);
      document.getElementById("Prediction").innerHTML = "Error submitting form";
    }
  };

  useEffect(() => {
    console.log(showBatchResults)
    if (showBatchResults) {
      fetchBatchSummary();
    }
  }, [showBatchResults]);

  const fetchBatchSummary = async () => {
    try {
      console.log("summarizing")
      const response = await axios.get(`${process.env.REACT_APP_PYTHON_API_BASE_URL}/python/summarize-batch`);
      setBatchSummary(response.data);
    } catch (error) {
      console.error('Error fetching batch summary:', error);
    }
  };

  // Modify the school year options generation
  const schoolYearOptions = [];
  if (latestSchoolYear) {
    for (let year = 2019; year <= parseInt(latestSchoolYear); year++) {
      schoolYearOptions.push(`${year}-${year + 1}`);
    }
  }

  const isTimeSeriesModel = (model) => {
    console.log(model);
    const timeSeriesModels = ["Moving_Average", "Simple_Exponential_Smoothing"];
    return timeSeriesModels.includes(model);
  };

  const groupByDepartment = (summary) => {
    return summary.reduce((acc, item) => {
      if (!acc[item.Department]) {
        acc[item.Department] = {};
      }
      acc[item.Department][item.Year_Level] = item;
      return acc;
    }, {});
  };

  return (
    <>
      <style jsx>{`
        .required:after {
          content: " *";
          color: red;
        }
      `}</style>
      {/** ---------------------- Different stats content 1 ------------------------- */}
      <div className="grid lg:grid-cols-5 mt-2 md:grid-cols-2 grid-cols-1 gap-6">
        {statsData.map((d, k) => {
          return <DashboardStats key={k} {...d} colorIndex={k} />;
        })}
      </div>
      <TitleCard title="Forecasting Algorithm" topMargin="mt-10">
        {latestDataYear ? (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            {/* Department and Major Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text required">Department</span>
                </label>
                <select
                  name="Department"
                  value={formData.Department}
                  onChange={handleDepartmentChange}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="" disabled>
                    Select Department
                  </option>
                  {departments.map((dept) => (
                    <option key={dept.Department} value={dept.Department}>
                      {dept.Department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text required">Major</span>
                </label>
                <select
                  name="Major"
                  value={formData.Major}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                  disabled={!formData.Department}
                  required
                >
                  <option value="" disabled>
                    Select Major
                  </option>
                  {majors.map((major) => (
                    <option key={major.major} value={major.major}>
                      {major.major}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* School Year and Year Level Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text required">School Year</span>
                </label>
                <select
                  name="Start_Year"
                  value={formData.Start_Year}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="" disabled>
                    Select School Year
                  </option>
                  {schoolYearOptions.map((year) => (
                    <option key={year} value={year.split("-")[0]}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text required">Semester</span>
                </label>
                <select
                  name="Semester"
                  value={formData.Semester}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                  disabled={!formData.Start_Year}
                  required
                >
                  <option value="" disabled>
                    Select Semester
                  </option>
                  <option value="1" selected={latestSemester === '1'}>1st Semester</option>
                  <option value="2" selected={latestSemester === '2'}>2nd Semester</option>
                </select>
              </div>
            </div>

            {/* Semester and Model Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text required">Year Level</span>
                </label>
                <select
                  name="Year_Level"
                  value={formData.Year_Level}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="" disabled>
                    Select Year Level
                  </option>
                  <option value="1st_Year">1st Year</option>
                  <option value="2nd_Year">2nd Year</option>
                  <option value="3rd_Year">3rd Year</option>
                  <option value="4th_Year">4th Year</option>
                </select>
              </div>
              
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div></div>
              {/* Moving Average Range Selection */}
              {selectedModel === "Moving_Average" && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text required">
                      Number of Semesters for Moving Average
                    </span>
                  </label>
                  <input
                    type="number"
                    value={movingAverageRange}
                    onChange={handleMovingAverageRangeChange}
                    className="input input-bordered w-full"
                    min="2"
                    max="10"
                    required
                  />
                </div>
              )}
            </div>

            {/* External Factors Inputs */}
            {formData.UseExternalData && !isTimeSeriesModel(selectedModel) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">
                      CPI Education (Mean Current Year)
                    </span>
                  </label>
                  <input
                    type="number"
                    name="CPIEducation"
                    value={formData.CPIEducation || ""}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder={
                      latestExternalData.CPIEducation
                        ? `Latest for ${formData.Start_Year}: ${latestExternalData.CPIEducation}`
                        : "No data available for selected year"
                    }
                  />
                  <label className="label">
                    <span className="label-text-alt">
                      Average Consumer Price Index for education in the selected
                      year
                    </span>
                  </label>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">
                      Inflation Rate (Previous Year)
                    </span>
                  </label>
                  <input
                    type="number"
                    name="InflationRatePast"
                    value={formData.InflationRatePast || ""}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder={
                      latestExternalData.InflationRatePast
                        ? `Latest for ${formData.Start_Year}: ${latestExternalData.InflationRatePast}`
                        : "No data available for selected year"
                    }
                  />
                  <label className="label">
                    <span className="label-text-alt">
                      Inflation rate from the previous year
                    </span>
                  </label>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">
                      Admission Rate (Current Year)
                    </span>
                  </label>
                  <input
                    type="number"
                    name="AdmissionRate"
                    value={formData.AdmissionRate || ""}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder={
                      latestExternalData.AdmissionRate
                        ? `Latest for ${formData.Start_Year}: ${latestExternalData.AdmissionRate}`
                        : "No data available for selected year"
                    }
                  />
                  <label className="label">
                    <span className="label-text-alt">
                      Current year's admission rate
                    </span>
                  </label>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">
                      Overall HFCE (Mean Current Year)
                    </span>
                  </label>
                  <input
                    type="number"
                    name="OverallHFCE"
                    value={formData.OverallHFCE || ""}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder={
                      latestExternalData.OverallHFCE
                        ? `Latest for ${formData.Start_Year}: ${latestExternalData.OverallHFCE}`
                        : "No data available for selected year"
                    }
                  />
                  <label className="label">
                    <span className="label-text-alt">
                      Average overall Household Final Consumption Expenditure
                      for the current year
                    </span>
                  </label>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">
                      HFCE Education (Mean Current Year)
                    </span>
                  </label>
                  <input
                    type="number"
                    name="HFCEEducation"
                    value={formData.HFCEEducation || ""}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder={
                      latestExternalData.HFCEEducation
                        ? `Latest for ${formData.Start_Year}: ${latestExternalData.HFCEEducation}`
                        : "No data available for selected year"
                    }
                  />
                  <label className="label">
                    <span className="label-text-alt">
                      Average Household Final Consumption Expenditure on
                      education for the current year
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Add CSV upload section */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Upload CSV for Batch Prediction</span>
              </label>
              <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                <div className="text-center p-10 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                  {isDragActive ? (
                    <p>Drop the CSV file here...</p>
                  ) : (
                    <p>Drag and drop a CSV file here, or click to select a file</p>
                  )}
                </div>
              </div>
              {file && (
                <div className="mt-2">
                  <p>Selected file: {file.name}</p>
                  <button 
                    type="button" 
                    onClick={uploadCSV} 
                    className="btn btn-primary mt-2"
                  >
                    Process and Download Batch Predictions
                  </button>
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary">
              Submit
            </button>

            <div className="divider"></div>

            {showResults && (
              <div className="grid grid-cols-1 gap-4">
                {Object.entries(predictionResult).map(([model, result]) => (
                  <div key={model} className="grid grid-cols-1 md:grid-cols-[25%,75%] gap-4">
                    {/* Prediction Container */}
                    <div className="prediction-container card shadow-md bg-info p-4">
                      <h2 className="text-error font-semibold mb-2">{model.replaceAll("_", " ")} Results:</h2>
                      <div className="results-content">
                        <div
                          className="text-neutral prediction-text p-4 bg-warning rounded-xl overflow-y-auto mb-2"
                        >
                          <h3 className="font-semibold mb-1">Prediction:</h3>
                          {result?.Prediction ?? "N/A"}
                        </div>

                        <div
                          className="text-neutral previous-semester-text p-4 bg-warning rounded-xl overflow-y-auto mb-2"
                        >
                          <h3 className="font-semibold mb-1">Previous Semester:</h3>
                          {result?.Previous_Semester ?? "N/A"}
                        </div>

                        <div
                          className="text-neutral attrition-text p-4 bg-warning rounded-xl overflow-y-auto"
                        >
                          <h3 className="font-semibold mb-1">Attrition Rate:</h3>
                          {result?.Attrition_Rate
                            ? `${result.Attrition_Rate.toFixed(2)}%`
                            : "N/A"}
                        </div>
                      </div>
                    </div>

                    {/* Plot Container */}
                    <div className="plot-container card shadow-md bg-base-100 border-2 border-accent">
                      <h2 className="text-lg font-semibold mb-1 text-primary px-4 py-3">
                        {model.replaceAll("_", " ")} Plot:
                      </h2>
                      <div
                        id={`plot-${model}`}
                        className="p-3 bg-base-100 rounded-xl overflow-hidden h-full"
                      >
                        {plotData[model] && (
                          <InteractivePlot
                            data={plotData[model]}
                            yearLevel={formData.Year_Level}
                            major={formData.Major}
                            modelName={model}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Display batch results */}
            {showBatchResults && !isBatchProcessing && (
              <div className="mt-6">
                <h2 className="text-xl font-bold mb-4">Batch Prediction Summary</h2>
                <div className="overflow-x-auto">
                  <table className="table table-compact w-full">
                    <thead>
                      <tr>
                        <th>Department</th>
                        {['1st Year', '2nd Year', '3rd Year', '4th Year'].map(year => (
                          <th key={year}>{year}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(groupByDepartment(batchSummary)).map(([department, yearData]) => (
                        <tr key={department}>
                          <td className="font-semibold">{department}</td>
                          {['1st Year', '2nd Year', '3rd Year', '4th Year'].map(year => (
                            <td key={year} className="p-2">
                              {yearData[year] ? (
                                <div>
                                  <p>Previous: {yearData[year].Total_Previous_Semester.toFixed(2)}</p>
                                  <p>Ensemble: {yearData[year].Total_Prediction_Ensemble.toFixed(2)}</p>
                                  <p>SES: {yearData[year].Total_Prediction_SES.toFixed(2)}</p>
                                  <p>MA: {yearData[year].Total_Prediction_MA.toFixed(2)}</p>
                                </div>
                              ) : (
                                'N/A'
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {isBatchProcessing && (
              <div className="mt-6">
                <p>Processing batch predictions... Please wait.</p>
              </div>
            )}
          </form>
        ) : (
          <p className="text-info">Loading...</p>
        )}
      </TitleCard>
    </>
  );
}

export default InternalPage;
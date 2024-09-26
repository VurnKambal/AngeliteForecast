import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import axios from "axios";
import TitleCard from "../../components/Cards/TitleCard";

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
          HFCEEducation: prevData.HFCEEducation || latestData.HFCEEducation,
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
          HFCEEducation: prevData.HFCEEducation || latestData.HFCEEducation,
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
        `${process.env.REACT_APP_PYTHON_API_BASE_URL}/api/process-data`,
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

      const modelField = {
        model: selectedModel,
        major: formData.Major,
        year_level: formData.Year_Level,
        start_year: formData.Start_Year,
        semester: formData.Semester,
      };

      const predictPayload = {
        ...modelField,
        processed_factors: cleanedProcessedFactors,
        use_external_data: formData.UseExternalData,
        admission_rate: formData.AdmissionRate,
        cpi_education: formData.CPIEducation,
        overall_hfce: formData.OverallHFCE,
        hfce_education: formData.HFCEEducation,
        inflation_rate_past: formData.InflationRatePast,
        window_size:
          selectedModel === "Moving_Average" ? movingAverageRange : null,
      };

      try {
        var predictionResult = await axios.post(
          `${process.env.REACT_APP_PYTHON_API_BASE_URL}/api/predict`,
          predictPayload
        );
        const predictionsList = JSON.parse(predictionResult.data);
        var lastPrediction = predictionsList[predictionsList.length - 1];
        console.log("Last prediction:", lastPrediction.Previous_Semester);
        lastPrediction = {
          ...lastPrediction,
          Prediction: Math.round(lastPrediction.Prediction),
          Previous_Semester: Math.round(lastPrediction.Previous_Semester),
        };
        setPredictionResult(lastPrediction);

        console.log(lastPrediction);
      } catch (error) {
        console.error("Error submitting form:", error);
        document.getElementById("Prediction").innerHTML =
          "Error submitting form";
      }

      try {
        console.log("aaa", predictionResult);
        const plotResponse = await axios.post(
          `${process.env.REACT_APP_PYTHON_API_BASE_URL}/api/plot`,
          {
            ...predictionResult.data,
            ...modelField,
          },
          {
            responseType: "blob", // Important for getting binary data
          }
        );
        console.log("Plot Response:", plotResponse.data);

        // Create a URL for the blob
        const plotBlob = new Blob([plotResponse.data], { type: "image/png" });
        const plotUrl = URL.createObjectURL(plotBlob);

        // Create an image element and set the src to the blob URL
        const plotImage = new Image();
        plotImage.src = plotUrl;
        plotImage.alt = `Enrollment trend for ${formData.Major}`;
        plotImage.hidden = false;

        // Append the image to the plot div
        const plotDiv = document.getElementById("plot");
        plotDiv.innerHTML = ""; // Clear any existing content
        plotDiv.appendChild(plotImage);
      } catch (error) {
        console.error(
          `${process.env.REACT_APP_PYTHON_API_BASE_URL}/api/plot Error submitting form:`,
          error
        );
        document.getElementById("plot").innerHTML = "Error submitting form";
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      document.getElementById("Prediction").innerHTML = "Error submitting form";
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

  return (
    <>
      <style jsx>{`
        .required:after {
          content: " *";
          color: red;
        }
      `}</style>

      <TitleCard title="Forecasting Algorithm" topMargin="mt-2">
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
              <div className="form-control">
                <label className="label">
                  <span className="label-text required">Model</span>
                </label>
                <select
                  name="Model"
                  value={selectedModel}
                  onChange={handleModelChange}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="" disabled>
                    Select Model
                  </option>
                  <optgroup label="Tree-based Models">
                    <option value="XGBoost">XGBoost</option>
                    <option value="Random_Forest">Random Forest</option>
                  </optgroup>
                  <optgroup label="Ensemble Models">
                    <option value="Ensemble">Ensemble</option>
                  </optgroup>
                  <optgroup label="Classical Models">
                    <option value="Linear_Regression">Linear Regression</option>
                    <option value="KNN">KNN</option>
                  </optgroup>
                  <optgroup label="Time Series Models">
                    <option value="Moving_Average">Moving Average</option>
                    <option value="Simple_Exponential_Smoothing">
                      Simple Exponential Smoothing
                    </option>
                  </optgroup>
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

            <button type="submit" className="btn btn-primary">
              Submit
            </button>

            <div className="divider"></div>

            <div className="grid grid-cols-1 md:grid-cols-[25%,75%] gap-4">
              {/* Prediction Container */}
              <div className="prediction-container card shadow-md bg-info p-4">
                <h2 className="text-error font-semibold mb-2">Results:</h2>
                <div className="results-content">
                  <div
                    id="Prediction"
                    className="text-neutral prediction-text p-4 bg-warning rounded-xl overflow-y-auto mb-2"
                  >
                    <h3 className="font-semibold mb-1">Prediction:</h3>
                    {predictionResult.Prediction
                      ? predictionResult.Prediction
                      : "N/A"}
                  </div>

                  <div
                    id="PreviousSemester"
                    className="text-neutral previous-semester-text p-4 bg-warning rounded-xl overflow-y-auto mb-2"
                  >
                    <h3 className="font-semibold mb-1">Previous Semester:</h3>
                    {predictionResult.Previous_Semester
                      ? predictionResult.Previous_Semester
                      : "N/A"}
                  </div>

                  <div
                    id="AttritionRate"
                    className="text-neutral attrition-text p-4 bg-warning rounded-xl overflow-y-auto"
                  >
                    <h3 className="font-semibold mb-1">Attrition Rate:</h3>
                    {predictionResult.Attrition_Rate
                      ? `${predictionResult.Attrition_Rate.toFixed(2)}%`
                      : "N/A"}
                  </div>
                </div>
              </div>

              {/* Plot Container */}
              <div className="plot-container card shadow-md bg-base-100 border-2 border-accent">
                <h2 className="text-lg font-semibold mb-1 text-primary px-4 py-3">
                  Plot:
                </h2>
                <div
                  id="plot"
                  className="p-3 bg-base-100 rounded-xl overflow-hidden h-full"
                >
                  {/* Plot content goes here */}
                </div>
              </div>
            </div>
          </form>
        ) : (
          <p className="text-info">Loading...</p>
        )}
      </TitleCard>
    </>
  );
}

export default InternalPage;
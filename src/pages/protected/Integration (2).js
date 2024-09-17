import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import axios from 'axios';
import TitleCard from "../../components/Cards/TitleCard";

function InternalPage() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Integrations" }));
    }, [dispatch]);

    const [formData, setFormData] = useState({
        Start_Year: '',
        Semester: '',
        Department: '',
        Major: '',
        Year_Level: '',
        UseExternalData: false,
        AdmissionRate: '',
        CPIEducation: '',
        OverallHFCE: '',
        HFCEEducation: '',
        InflationRate: ''
    });

    const [selectedModel, setSelectedModel] = useState('');
    const [movingAverageRange, setMovingAverageRange] = useState(2);
    const [departments, setDepartments] = useState([]);
    const [majors, setMajors] = useState([]);
    const [latestDataYear, setLatestDataYear] = useState(null);
    const [latestExternalData, setLatestExternalData] = useState({});

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/departments`);
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
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/latest-data-year`);
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
    }, []);

    const fetchExternalData = async (schoolYear, department) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/external-data`, {
                params: { schoolYear, department }
            });
            console.log(response.data)
            setLatestExternalData(response.data);
        } catch (error) {
            console.error("Error fetching external data:", error);
            setLatestExternalData({});
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setFormData(prevData => ({
            ...prevData,
            [name]: newValue,
        }));

        if (name === 'Start_Year' && value && formData.Department) {
            fetchExternalData(value, formData.Department);
        }
    };

    const handleDepartmentChange = async (e) => {
        const department = e.target.value;
        setFormData(prevData => ({
            ...prevData,
            Department: department,
            Major: '',
        }));

        if (formData.Start_Year) {
            fetchExternalData(formData.Start_Year, department);
        }

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/majors`, {
                params: { department },
            });
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
            const processDataResponse = await axios.post(`${process.env.REACT_APP_PYTHON_API_BASE_URL}/api/process-data`, formData);
            if (processDataResponse.data.status !== 'success' || !processDataResponse.data.processed_data) {
                console.error('Error processing data:', processDataResponse.data);
                return;
            }

            const processedData = JSON.parse(processDataResponse.data.processed_data);
            const cleanedProcessedData = processedData.map(item =>
                Object.fromEntries(
                    Object.entries(item).map(([key, value]) => [key, value === null ? 0 : value])
                )
            );

            const predictPayload = {
                processed_data: cleanedProcessedData,
                model: selectedModel,
                year_level: formData.Year_Level,
                start_year: formData.Start_Year,
                semester: formData.Semester,
                use_external_data: formData.UseExternalData,
                admission_rate: formData.AdmissionRate,
                cpi_education: formData.CPIEducation,
                overall_hfce: formData.OverallHFCE,
                hfce_education: formData.HFCEEducation,
                inflation_rate_past: formData.InflationRatePast,
                window_size: selectedModel === 'Moving_Average' ? movingAverageRange : null
            };

            try {
                var predictions = await axios.post(`${process.env.REACT_APP_PYTHON_API_BASE_URL}/api/predict`, predictPayload);
                console.log(predictions)
                const roundedPrediction = Math.round(predictions.data);
                document.getElementById('Prediction').innerHTML = `Prediction: ${roundedPrediction}`;
            } catch (error) {
                console.error("Error submitting form:", error);
                document.getElementById('Prediction').innerHTML = 'Error submitting form';
            }
            
            try {
                const plotResponse = await axios.post(`${process.env.REACT_APP_PYTHON_API_BASE_URL}/api/plot`, predictions.data, {
                    
                    responseType: 'blob', // Important for getting binary data
                });
                console.log('Plot Response:', plotResponse.data);
                
                // Create a URL for the blob
                const plotBlob = new Blob([plotResponse.data], { type: 'image/png' });
                const plotUrl = URL.createObjectURL(plotBlob);
                
                // Create an image element and set the src to the blob URL
                const plotImage = new Image();
                plotImage.src = plotUrl;
                plotImage.alt = `Enrollment trend for ${formData.Major}`;
                plotImage.hidden = false;
                
                // Append the image to the plot div
                const plotDiv = document.getElementById('plot');
                plotDiv.innerHTML = ''; // Clear any existing content
                plotDiv.appendChild(plotImage);
            } catch (error) {
                console.error(`${process.env.REACT_APP_PYTHON_API_BASE_URL}/api/plot Error submitting form:`, error);
                document.getElementById('plot').innerHTML = 'Error submitting form';
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            document.getElementById('Prediction').innerHTML = 'Error submitting form';
        }
    };

    // Generate school year options
    const currentYear = new Date().getFullYear();
    const schoolYearOptions = [];
    if (latestDataYear >= currentYear) {
        for (let year = 2018; year <= latestDataYear; year++) {
            schoolYearOptions.push(`${year}-${year + 1}`);
        }
    } else {
        console.log("Loading...");
    }

    const isTimeSeriesModel = (model) => {
        const timeSeriesModels = ['Moving_Average', 'Simple_Exponential_Smoothing'];
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
                                    <option value="" disabled>Select Department</option>
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
                                    <option value="" disabled>Select Major</option>
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
                                    <option value="" disabled>Select School Year</option>
                                    {schoolYearOptions.map((year) => (
                                        <option key={year} value={year.split('-')[0]}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
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
                                    <option value="" disabled>Select Year Level</option>
                                    <option value="1st_Year">1st Year</option>
                                    <option value="2nd_Year">2nd Year</option>
                                    <option value="3rd_Year">3rd Year</option>
                                    <option value="4th_Year">4th Year</option>
                                </select>
                            </div>
                        </div>

                        {/* Semester and Model Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    <option value="" disabled>Select Semester</option>
                                    <option value="1">1st Semester</option>
                                    <option value="2">2nd Semester</option>
                                </select>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text required">Model</span>
                                </label>
                                <select
                                    value={selectedModel}
                                    onChange={handleModelChange}
                                    className="select select-bordered w-full"
                                    required
                                >
                                    <option value="" disabled>Select Model</option>
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
                                        <option value="Moving_Average" disabled>Moving Average</option>
                                        <option value="Simple_Exponential_Smoothing">Simple Exponential Smoothing</option>
                                    </optgroup>
                                </select>
                            </div>
                        </div>

                        {/* External Factors Checkbox */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label cursor-pointer justify-start">
                                    <span className="label-text mr-2">Modify External Factors</span>
                                    <input
                                        type="checkbox"
                                        name="UseExternalData"
                                        checked={formData.UseExternalData}
                                        onChange={handleChange}
                                        className="checkbox checkbox-primary"
                                    />
                                </label>
                            </div>
                            {/* Moving Average Range Selection */}
                            {selectedModel === 'Moving_Average' && (
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text required">Number of Semesters for Moving Average</span>
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
                                        <span className="label-text">CPI Education (Mean Current Year)</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="CPIEducation"
                                        value={formData.CPIEducation || latestExternalData.CPIEducation || ''}
                                        onChange={handleChange}
                                        className="input input-bordered w-full"
                                        placeholder={latestExternalData.CPIEducation ? `Latest: ${latestExternalData.CPIEducation}` : "No updated data available"}
                                    />
                                    <label className="label">
                                        <span className="label-text-alt">Average Consumer Price Index for education in the current year</span>
                                    </label>
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Inflation Rate (Previous Year)</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="InflationRatePast"
                                        value={formData.InflationRatePast || latestExternalData.InflationRatePast || ''}
                                        onChange={handleChange}
                                        className="input input-bordered w-full"
                                        placeholder={latestExternalData.InflationRatePast ? `Latest: ${latestExternalData.InflationRatePast}` : "No updated data available"}
                                    />
                                    <label className="label">
                                        <span className="label-text-alt">Inflation rate from the previous year</span>
                                    </label>
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Admission Rate (Current Year)</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="AdmissionRate"
                                        value={formData.AdmissionRate || latestExternalData.AdmissionRate || ''}
                                        onChange={handleChange}
                                        className="input input-bordered w-full"
                                        placeholder={latestExternalData.AdmissionRate ? `Latest: ${latestExternalData.AdmissionRate}` : "No updated data available"}
                                    />
                                    <label className="label">
                                        <span className="label-text-alt">Current year's admission rate</span>
                                    </label>
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Overall HFCE (Mean Current Year)</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="OverallHFCE"
                                        value={formData.OverallHFCE || latestExternalData.OverallHFCE || ''}
                                        onChange={handleChange}
                                        className="input input-bordered w-full"
                                        placeholder={latestExternalData.OverallHFCE ? `Latest: ${latestExternalData.OverallHFCE}` : "No updated data available"}
                                    />
                                    <label className="label">
                                        <span className="label-text-alt">Average overall Household Final Consumption Expenditure for the current year</span>
                                    </label>
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">HFCE Education (Mean Current Year)</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="HFCEEducation"
                                        value={formData.HFCEEducation || latestExternalData.HFCEEducation || ''}
                                        onChange={handleChange}
                                        className="input input-bordered w-full"
                                        placeholder={latestExternalData.HFCEEducation ? `Latest: ${latestExternalData.HFCEEducation}` : "No updated data available"}
                                    />
                                    <label className="label">
                                        <span className="label-text-alt">Average Household Final Consumption Expenditure on education for the current year</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary">Submit</button>
                        
                        <div className="divider"></div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="prediction-container">
                                <div id="Prediction" className="prediction-text"></div>
                            </div>
                            <div className="plot-container">
                                <div id="plot"></div>
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
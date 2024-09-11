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
        Year_Level: '1st_Year',
    });

    const [selectedModel, setSelectedModel] = useState('XGBoost');
    const [departments, setDepartments] = useState([]);
    const [majors, setMajors] = useState([]);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleDepartmentChange = async (e) => {
        const department = e.target.value;
        setFormData({
            ...formData,
            Department: department,
            Major: '',
        });

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

    const handleSubmit = async (e) => {
        let predictions = [];
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
            };

            try {
                predictions = await axios.post(`${process.env.REACT_APP_PYTHON_API_BASE_URL}/api/predict`, predictPayload);
                const roundedPrediction = Math.round(predictions.data);
                document.getElementById('Prediction').innerHTML = `Predictions: ${roundedPrediction}`;
            } catch (error) {
                console.error("Error submitting form:", error);
                document.getElementById('Prediction').innerHTML = 'Error submitting form';
            }
            
            try {
                console.log(`${process.env.REACT_APP_PYTHON_API_BASE_URL}/api/plot`, predictions.data)
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

    return (
        <TitleCard title="Forecasting Algorithm" topMargin="mt-2">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
                {/* Department and Major Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Department</span>
                        </label>
                        <select
                            name="Department"
                            value={formData.Department}
                            onChange={handleDepartmentChange}
                            className="select select-bordered w-full"
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
                            <span className="label-text">Major</span>
                        </label>
                        <select
                            name="Major"
                            value={formData.Major}
                            onChange={handleChange}
                            className="select select-bordered w-full"
                            disabled={!formData.Department}
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

                {/* Year Level and Start Year Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Start Year</span>
                        </label>
                        <input
                            type="text"
                            name="Start_Year"
                            value={formData.Start_Year}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                            placeholder="Enter Start Year"
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Year Level</span>
                        </label>
                        <select
                            name="Year_Level"
                            value={formData.Year_Level}
                            onChange={handleChange}
                            className="select select-bordered w-full"
                        >
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
                            <span className="label-text">Semester</span>
                        </label>
                        <input
                            type="text"
                            name="Semester"
                            value={formData.Semester}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                            placeholder="Enter Semester"
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Model</span>
                        </label>
                        <select
                            value={selectedModel}
                            onChange={handleModelChange}
                            className="select select-bordered w-full"
                        >
                            <option value="XGBoost">XGBoost</option>
                            <option value="RandomForest">Random Forest</option>
                            <option value="Ensemble">Ensemble</option>
                        </select>
                    </div>
                </div>

                <button type="submit" className="btn px-6 btn-sm normal-case btn-primary">Submit</button>
                <div className="divider"></div>
                <div id="Prediction" className="text-gray-700 mt-4"></div>
                <div id="plot"></div>
            </form>
        </TitleCard>
    );
}

export default InternalPage;

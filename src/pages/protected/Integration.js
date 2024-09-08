import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import axios from 'axios';

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
        Year_Level: '', // Default Year_Level
    });

    const [selectedModel, setSelectedModel] = useState('XGBoost');
    const [departments, setDepartments] = useState([]);
    const [majors, setMajors] = useState([]);
    // const [plot, setPlot] = useState([]);
    
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                console.log(`${process.env.REACT_APP_API_BASE_URL}/api/departments`);
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/departments`);
                console.log(response.data)
                setDepartments(response.data);
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
            [name]: value
        });
    };

    const handleDepartmentChange = async (e) => {
        const department = e.target.value;
        setFormData({
            ...formData,
            Department: department,
            Major: '' // Reset major when department changes
        });

        try {
            console.log(`${process.env.REACT_APP_API_BASE_URL}/api/majors`)
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/majors`, {
                params: { department }
            });
            setMajors(response.data);
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
            console.log(`${process.env.REACT_APP_PYTHON_API_BASE_URL}/api/process-data`)
            const processDataResponse = await axios.post(`${process.env.REACT_APP_PYTHON_API_BASE_URL}/api/process-data`, formData);
            console.log('Process Data Response:', processDataResponse.data);

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
                year_level: formData.Year_Level // Include Year_Level in the payload
            };
            
            try {
                console.log('Sending to predict:', predictPayload);
                const predictions = await axios.post(`${process.env.REACT_APP_PYTHON_API_BASE_URL}/api/predict`, predictPayload);
                console.log('Predictions:', predictions.data);

                // Round off the prediction if it is a float
                const roundedPrediction = Math.round(predictions.data);

                // Set innerHTML of the Prediction div
                document.getElementById('Prediction').innerHTML = `Predictions: ${roundedPrediction}`;
            } catch (error) {
                console.error(`${process.env.REACT_APP_PYTHON_API_BASE_URL}/api/predict Error submitting form:`, error);
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
            console.error(`${process.env.REACT_APP_PYTHON_API_BASE_URL}/api/process-data Error submitting form:`, error);
            document.getElementById('Prediction').innerHTML = 'Error submitting form';
        }
       
    };

    return (
        <div>
            <h1>Integrations</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Year Level</label>
                    <select name="Year_Level" value={formData.Year_Level} onChange={handleChange}>
                        <option value="" disabled>Select Year Level</option>
                        <option value="1st_Year">1st Year</option>
                        <option value="2nd_Year">2nd Year</option>
                        <option value="3rd_Year">3rd Year</option>
                        <option value="4th_Year">4th Year</option>
                    </select>
                </div>
                <div>
                    <label>Department</label>
                    <select name="Department" value={formData.Department} onChange={handleDepartmentChange}>
                        <option value="" disabled>Select Department</option>
                        {departments.map((dept) => (
                            <option key={dept.Department} value={dept.Department}>
                                {dept.Department}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Major</label>
                    <select name="Major" value={formData.Major} onChange={handleChange} disabled={!formData.Department}>
                        <option value="" disabled>Select Major</option>
                        {majors.map((major) => (
                            <option key={major.major} value={major.major}>
                                {major.major}
                            </option>
                        ))}
                    </select>
                </div>
                
                {Object.keys(formData).map((key) => (
                    key !== 'Department' && key !== 'Major' && key !== 'Year_Level' && (
                        <div key={key}>
                            <label>{key.replace(/_/g, ' ')}</label>
                            <input
                                type="text"
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                            />
                        </div>
                    )
                ))}
                <div>
                    <label>Model</label>
                    <select value={selectedModel} onChange={handleModelChange}>
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
                            <option value="SVR">SVR</option>
                        </optgroup>
                    </select>
                </div>
                <button type="submit">Submit</button>
            </form>
            <div id="Prediction"></div>
            <div id="plot"></div>
            <img id="plotImage" alt="Enrollment trend plot" hidden style={{width: '80%', height: '80%'}}/>
        </div>
        
        
    );
}

export default InternalPage;
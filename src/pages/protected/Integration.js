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
        Major: '',
        Department: '',
        // CPI_Region3_Education: '',
        // Inflation_Rate: '',
        // Number_of_Applicants: '',
        // HFCE_Education: '',
        // HFCE: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const processDataResponse = await axios.post(`${process.env.REACT_APP_ML_BASE_URL}/process-data`, formData);
            console.log('Process Data Response:', processDataResponse.data);
    
            if (processDataResponse.data.status !== 'success' || !processDataResponse.data.processed_data) {
                console.error('Error processing data:', processDataResponse.data);
                return;
            }
    
            // Parse the processed_data string back into an object
            const processedData = JSON.parse(processDataResponse.data.processed_data);
    
            // Replace null values with a default value (e.g., 0 or '')
            const cleanedProcessedData = processedData.map(item => 
                Object.fromEntries(
                    Object.entries(item).map(([key, value]) => [key, value === null ? 0 : value])
                )
            );
    
            const predictPayload = {
                processed_data: cleanedProcessedData
            };
            console.log('Sending to predict:', predictPayload);
    
            const predictions = await axios.post(`${process.env.REACT_APP_ML_BASE_URL}/predict`, predictPayload);
            console.log('Predictions:', predictions.data);
        } catch (error) {
            console.error(`${process.env.REACT_APP_ML_BASE_URL}/process-data Error submitting form:`, error);
        }
    };

    return (
        <div>
            <h1>Integrations</h1>
            <form onSubmit={handleSubmit}>
                {Object.keys(formData).map((key) => (
                    <div key={key}>
                        <label>{key.replace(/_/g, ' ')}</label>
                        <input
                            type="text"
                            name={key}
                            value={formData[key]}
                            onChange={handleChange}
                        />
                    </div>
                ))}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default InternalPage;
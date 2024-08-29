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
        CPI_Region3_Education: '',
        Inflation_Rate: '',
        Number_of_Applicants: '',
        HFCE_Education: '',
        HFCE: '',
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
            const response = await axios.post(`${process.env.REACT_APP_ML_BASE_URL}/process-data`, formData);
            console.log('Response:', response.data);
        } catch (error) {
            console.error(`${process.env.REACT_APP_ML_BASE_URL}/process-dataError submitting form:`, error);
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
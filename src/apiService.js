import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_ML_BASE_URL;

export const trainModels = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/train`, data);
        return response.data;
    } catch (error) {
        console.error('Error training models:', error);
        throw error;
    }
};

export const makePredictions = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/predict`, data);
        return response.data;
    } catch (error) {
        console.error('Error making predictions:', error);
        throw error;
    }
};
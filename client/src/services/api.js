import axios from 'axios';

const API_BASE_URL =
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ||
    (typeof process !== 'undefined' && process.env && (process.env.VITE_API_URL || process.env.API_URL)) ||
    'http://127.0.0.1:5000/api';
    
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

export const getCurrencies = async () => {
    try {
        const res = await apiClient.get('/currencies');
        return res.data;
    } catch (error) {
        console.error('Error fetching currencies:', error);
        throw new Error(error.response?.data?.error || 'Failed to fetch currencies');
    }
}

export const convertCurrency = async (from, to, amount) => {
    try {
        const res = await apiClient.post('/convert', { from, to, amount });
        return res.data;
    } catch (error) {
        console.error('Error converting currency:', error);
        throw new Error(error.response?.data?.error || 'Failed to convert currency');
    }
}

export const getConversionHistory = async (limit = 10) => {
    try {
        const res = await apiClient.get('/history', { params: { limit } });
        return res.data.history;
    } catch (error) {
        console.error('Error fetching conversion history:', error);
        throw new Error(error.response?.data?.error || 'Failed to fetch conversion history');
    }
}

export const getExchangeRates = async (base) => {
    try {
        const res = await apiClient.get(`/rates/${base}`);
        return res.data.rates;
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        throw error;
    }
}



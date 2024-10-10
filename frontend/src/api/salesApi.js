import axios from 'axios';

// Correct API URL with versioned path
const API_URL = 'http://localhost:5000/api/v1/sales';

export const addSale = async (saleData) => {
    return axios.post(API_URL, saleData);
};

export const getAllSales = async () => {
    return axios.get(API_URL);
};



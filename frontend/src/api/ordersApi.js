import axios from 'axios';

// Correct API URL with versioned path
const API_URL = 'http://localhost:5000/api/v1/orders';

export const placeOrder = async (orderData) => {
    return axios.post(`${API_URL}/orders`, orderData);
};

export const updateOrderStatus = async (orderId, status) => {
    return axios.put(`${API_URL}/orders/${orderId}/status`, { status });
};


// Add the missing getAllOrders function
export const getAllOrders = async () => {
    return axios.get(`${API_URL}/orders`);
};

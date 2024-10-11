import axios from 'axios';

// Correct API URL with versioned path
const API_URL = 'http://localhost:5000/api/v1/orders';

export const placeOrder = async (orderData) => {
    return axios.post(`${API_URL}/orders`, orderData);
};

export const updateOrderStatus = async (orderId, updatedData) => {
    try {
        const response = await axios.put(`http://localhost:5000/api/v1/orders/orders/${orderId}/status`, updatedData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating order status:', error.response ? error.response.data : error.message);
        throw error;
    }
};


// Add the missing getAllOrders function
export const getAllOrders = async () => {
    return axios.get(`${API_URL}/orders`);
};

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RequestChart = () => {
    const [requestData, setRequestData] = useState([]);

    useEffect(() => {
        const fetchRequestData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/request/requests');
                const formattedData = response.data.map((request) => ({
                    product_id: request.product_id,
                    quantity_requested: request.quantity_requested,
                }));
                setRequestData(formattedData);
            } catch (error) {
                console.error('Error fetching request data:', error);
            }
        };

        fetchRequestData();
    }, []);

    return (
        <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Product Requests vs Quantity</h2>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={requestData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="product_id" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantity_requested" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RequestChart;

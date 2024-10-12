import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MonthlySalesChart = ({ year }) => { // Accepting year as a prop
    const [monthlySalesData, setMonthlySalesData] = useState([]);
    const API_URL = 'http://localhost:5000/api/v1/analytics';

    useEffect(() => {
        const fetchMonthlySales = async () => {
            try {
                const response = await axios.get(`${API_URL}/sales-by-year/${year}`);
                // Assuming the response contains data for monthly sales breakdown
                const salesData = response.data.monthlySalesBreakdown.map((revenue, index) => ({
                    month: index + 1,
                    monthly_revenue: revenue,
                }));
                setMonthlySalesData(salesData);
            } catch (error) {
                console.error('Error fetching monthly sales data:', error);
            }
        };
        fetchMonthlySales();
    }, [year]);

    return (
        <div className="flex flex-wrap justify-between mt-3 ">
            <div className="flex-1 min-w-0 p-2 bg-white shadow rounded-lg mx-3">
                <h2 className="text-xl font-semibold mb-4">Monthly Sales</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={monthlySalesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="monthly_revenue" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="flex-1 min-w-0 p-2 bg-white shadow rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Predicted Demands</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={monthlySalesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="monthly_revenue" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default MonthlySalesChart;

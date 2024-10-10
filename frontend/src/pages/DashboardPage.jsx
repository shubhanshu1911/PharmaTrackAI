import React from 'react';

const DashboardPage = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold">Total Sales</h2>
                    <p className="text-2xl mt-2">₹ 1,25,000</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold">Pending Orders</h2>
                    <p className="text-2xl mt-2">8</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold">Low Stock Alerts</h2>
                    <p className="text-2xl mt-2">5</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;

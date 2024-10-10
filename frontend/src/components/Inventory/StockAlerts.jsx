import React, { useEffect, useState } from 'react';
import { getLowStockAlerts } from '../../api/inventoryApi';

const StockAlerts = () => {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const fetchAlerts = async () => {
            const response = await getLowStockAlerts();
            setAlerts(response.data);
        };
        fetchAlerts();
    }, []);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Low Stock Alerts</h2>
            <ul className="space-y-4">
                {alerts.map(alert => (
                    <li key={alert.product_id} className="bg-red-100 p-4 rounded shadow-md">
                        <div>Product ID: {alert.product_id}</div>
                        <div>Stock: {alert.stock}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StockAlerts;

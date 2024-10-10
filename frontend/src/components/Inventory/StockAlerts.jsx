import React, { useEffect, useState } from 'react';
import { getAllInventory } from '../../api/inventoryApi';

const StockAlerts = () => {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const fetchAlerts = async () => {
            const response = await getAllInventory();
            console.log(response.data);
            // Filter alerts based on quantity and reorder level
            const lowStockAlerts = response.data.filter(alert => alert.quantity < alert.reorder_level);
            setAlerts(lowStockAlerts);
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
                        <div>Quantity: {alert.quantity}</div>
                        <div>Reorder Level: {alert.reorder_level}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StockAlerts;

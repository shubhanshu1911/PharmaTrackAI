import React, { useEffect, useState } from 'react';
import { getAllOrders } from '../../api/ordersApi';

const OrdersList = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const response = await getAllOrders();
            setOrders(response.data);
        };
        fetchOrders();
    }, []);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Orders List</h2>
            <ul className="space-y-4">
                {orders.map(order => (
                    <li key={order.id} className="bg-white p-4 rounded shadow-md">
                        <div>Product ID: {order.product_id}</div>
                        <div>Quantity: {order.quantity}</div>
                        <div>Status: {order.status}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrdersList;

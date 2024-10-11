import React, { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../../api/ordersApi';
import OrderItem from './OrderItem';

const OrdersList = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    // Fetch all orders when the component loads
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getAllOrders();
                setOrders(response.data);  // Align with backend response
            } catch (error) {
                setError('Error fetching orders. Please try again later.');
            }
        };
        fetchOrders();
    }, []);

    // Function to update the order status
    const handleUpdateOrderStatus = async (orderId, updatedData) => {
        try {
            await updateOrderStatus(orderId, updatedData);  // Pass the updatedData including actual_delivery_date
            const response = await getAllOrders();  // Fetch updated orders after status update
            setOrders(response.data);  // Align with backend response
        } catch (error) {
            setError('Error updating order status. Please try again later.');
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Orders List</h2>
            {error && <div className="text-red-500">{error}</div>}
            <ul className="space-y-4">
                {orders.map((order) => (
                    <OrderItem
                        key={order.order_id}  // Use `order_id` as the key
                        order={order}
                        onUpdateStatus={handleUpdateOrderStatus}
                    />
                ))}
            </ul>
        </div>
    );
};

export default OrdersList;

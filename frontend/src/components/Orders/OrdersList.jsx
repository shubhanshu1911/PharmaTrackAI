import React, { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../../api/ordersApi';
import OrderItem from './OrderItem';
import { getProductByID } from '../../api/productApi';  // Import the function to get product details


const OrdersList = () => {
    const [orders, setOrders] = useState([]);
    const [ordersWithProductNames, setOrdersWithProductNames] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch orders and product names
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getAllOrders();
                const ordersData = response.data;
                console.log(ordersData);

                // For each order, fetch the corresponding product name by product_id
                const ordersWithNames = await Promise.all(
                    ordersData.map(async (order) => {
                        try {
                            // Fetch the product by its ID
                            const productResponse = await getProductByID(order.product_id);
                            const product = productResponse.data; // Assuming the response is a single object
                            return { ...order, product_name: product.product_name }; // Add product name to order object
                        } catch (error) {
                            console.error('Error fetching product name:', error);
                            return { ...order, product_name: 'Unknown' }; // Fallback if product fetch fails
                        }
                    })
                );

                setOrdersWithProductNames(ordersWithNames);
                setLoading(false);
            } catch (error) {
                setError('Error fetching orders. Please try again later.');
                setLoading(false);
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

    if (loading) return <div>Loading orders...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Orders List</h2>
            <ul className="space-y-4">
                {ordersWithProductNames.slice().reverse().map((order) => (
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

import React, { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../../api/ordersApi';

const OrdersList = () => {
    const [orders, setOrders] = useState([]);
    const [editingOrderId, setEditingOrderId] = useState(null); // Track the currently edited order's ID
    const [formInputs, setFormInputs] = useState({}); // Track form inputs for each order using order ID as key

    // Fetch all orders when the component loads
    useEffect(() => {
        const fetchOrders = async () => {
            const response = await getAllOrders();
            setOrders(response.data);
            console.log(response.data);
        };
        fetchOrders();
    }, []);

    // Handle input changes for specific fields of the form per order
    const handleInputChange = (orderId, field, value) => {
        setFormInputs((prev) => ({
            ...prev,
            [orderId]: {
                ...prev[orderId],
                [field]: value,
            },
        }));
    };

    // Handle status update form submission for specific order
    const handleUpdateStatus = async (orderId) => {
        const { status, actualDeliveryDate, actualLeadTime } = formInputs[orderId] || {};

        if (!status) {
            alert('Please select a status.');
            return;
        }

        try {
            const updatedData = {
                status,
                actual_delivery_date: actualDeliveryDate,
                actual_lead_time: actualLeadTime,
            };

            await updateOrderStatus(orderId, updatedData); // Send updated order data to the backend

            // Optionally, fetch updated orders again to reflect the changes immediately
            const response = await getAllOrders();
            setOrders(response.data);

            alert('Order status updated successfully!');
            setEditingOrderId(null); // Reset the form after updating
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Orders List</h2>
            <ul className="space-y-4">
                {orders.map((order) => (
                    <li key={order.id} className="bg-white p-4 rounded shadow-md">
                        <div>Product ID: {order.product_id}</div>
                        <div>Order Date: {order.order_date}</div>
                        <div>Total Cost: {order.total_cost}</div>
                        <div>Quantity: {order.quantity}</div>
                        <div>Actual Delivery Date: {order.actual_delivery_date || 'Not delivered yet'}</div>
                        <div>Actual Lead Time: {order.actual_lead_time || 'Not delivered yet'}</div>
                        <div>Claimed Lead Time: {order.claimed_lead_time}</div>
                        <div>Status: {order.status}</div>

                        {/* Show editing form only if this is the order being edited */}
                        {editingOrderId === order.id ? (
                            <div className="mt-4">
                                {/* Form to update the order status and delivery details */}
                                <div className="mb-2">
                                    <label htmlFor={`status-${order.id}`} className="block">Status</label>
                                    <select
                                        id={`status-${order.id}`}
                                        value={formInputs[order.id]?.status || order.status}
                                        onChange={(e) =>
                                            handleInputChange(order.id, 'status', e.target.value)
                                        }
                                        className="border p-2 w-full"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>

                                {/* Only show actual delivery inputs if status is 'delivered' */}
                                {formInputs[order.id]?.status === 'delivered' && (
                                    <>
                                        <div className="mb-2">
                                            <label htmlFor={`actualDeliveryDate-${order.id}`} className="block">
                                                Actual Delivery Date
                                            </label>
                                            <input
                                                type="date"
                                                id={`actualDeliveryDate-${order.id}`}
                                                value={formInputs[order.id]?.actualDeliveryDate || ''}
                                                onChange={(e) =>
                                                    handleInputChange(order.id, 'actualDeliveryDate', e.target.value)
                                                }
                                                className="border p-2 w-full"
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor={`actualLeadTime-${order.id}`} className="block">
                                                Actual Lead Time (days)
                                            </label>
                                            <input
                                                type="number"
                                                id={`actualLeadTime-${order.id}`}
                                                value={formInputs[order.id]?.actualLeadTime || ''}
                                                onChange={(e) =>
                                                    handleInputChange(order.id, 'actualLeadTime', e.target.value)
                                                }
                                                className="border p-2 w-full"
                                            />
                                        </div>
                                    </>
                                )}

                                <button
                                    onClick={() => handleUpdateStatus(order.id)}
                                    className="bg-blue-600 text-white py-2 px-4 rounded mt-4"
                                >
                                    Update Status
                                </button>

                                <button
                                    onClick={() => setEditingOrderId(null)} // Cancel editing
                                    className="ml-4 bg-gray-600 text-white py-2 px-4 rounded mt-4"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => {
                                    setEditingOrderId(order.id); // Set this order as being edited
                                    setFormInputs((prev) => ({
                                        ...prev,
                                        [order.id]: {
                                            status: order.status,
                                            actualDeliveryDate: order.actual_delivery_date || '',
                                            actualLeadTime: order.actual_lead_time || '',
                                        },
                                    }));
                                }}
                                className="bg-green-600 text-white py-2 px-4 rounded mt-4"
                            >
                                Edit Order
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrdersList;

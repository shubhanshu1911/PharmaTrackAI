import React, { useState } from 'react';

const OrderItem = ({ order, onUpdateStatus }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [status, setStatus] = useState(order.status);
    const [actualDeliveryDate, setActualDeliveryDate] = useState(order.actual_delivery_date || '');

    const handleSubmit = () => {
        const updatedData = {
            status,
            actual_delivery_date: status === 'delivered' ? actualDeliveryDate : null,
        };
        onUpdateStatus(order.order_id, updatedData);  // Update order using `order_id`
        setIsEditing(false); // Exit editing mode after updating
    };

    return (
        <li className="bg-white p-4 rounded shadow-md">
            <div>Product ID: {order.product_id}</div>
            <div>Order Date: {order.order_date}</div>
            <div>Total Cost: {order.total_cost}</div>
            <div>Quantity: {order.quantity}</div>
            <div>Actual Delivery Date: {order.actual_delivery_date || 'Not delivered yet'}</div>
            <div>Claimed Lead Time: {order.claimed_lead_time}</div>
            <div>Status: {order.status}</div>

            {isEditing ? (
                <div className="mt-4">
                    <div className="mb-2">
                        <label className="block">Status</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border p-2 w-full">
                            <option value="pending">Pending</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    {status === 'delivered' && (
                        <>
                            <div className="mb-2">
                                <label className="block">Actual Delivery Date</label>
                                <input
                                    type="date"
                                    value={actualDeliveryDate}
                                    onChange={(e) => setActualDeliveryDate(e.target.value)}
                                    className="border p-2 w-full"
                                />
                            </div>
                        </>
                    )}

                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 text-white py-2 px-4 rounded mt-4"
                    >
                        Update Status
                    </button>

                    <button
                        onClick={() => setIsEditing(false)}
                        className="ml-4 bg-gray-600 text-white py-2 px-4 rounded mt-4"
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setIsEditing(true)}
                    className="bg-green-600 text-white py-2 px-4 rounded mt-4"
                >
                    Edit Order
                </button>
            )}
        </li>
    );
};

export default OrderItem;

import React, { useState } from 'react';
import { placeOrder } from '../../api/ordersApi';

const OrderForm = () => {
    const [orderData, setOrderData] = useState({
        product_id: '',
        quantity: '',
        supplier_id: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await placeOrder(orderData);
            alert('Order placed successfully!');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Place New Order</h2>
            <input
                type="text"
                placeholder="Product ID"
                value={orderData.product_id}
                onChange={e => setOrderData({ ...orderData, product_id: e.target.value })}
                className="border p-2 w-full mb-4"
            />
            <input
                type="number"
                placeholder="Quantity"
                value={orderData.quantity}
                onChange={e => setOrderData({ ...orderData, quantity: e.target.value })}
                className="border p-2 w-full mb-4"
            />
            <input
                type="text"
                placeholder="Supplier ID"
                value={orderData.supplier_id}
                onChange={e => setOrderData({ ...orderData, supplier_id: e.target.value })}
                className="border p-2 w-full mb-4"
            />
            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
                Place Order
            </button>
        </form>
    );
};

export default OrderForm;

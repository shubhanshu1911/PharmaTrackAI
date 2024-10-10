import React, { useState } from 'react';
import { addSale } from '../../api/salesApi';

const SalesForm = () => {
    const [saleData, setSaleData] = useState({
        product_id: '',
        quantity_sold: '',
        customer_name: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addSale(saleData);
            alert('Sale recorded successfully!');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Record New Sale</h2>
            <input
                type="text"
                placeholder="Product ID"
                value={saleData.product_id}
                onChange={e => setSaleData({ ...saleData, product_id: e.target.value })}
                className="border p-2 w-full mb-4"
            />
            <input
                type="number"
                placeholder="Quantity Sold"
                value={saleData.quantity_sold}
                onChange={e => setSaleData({ ...saleData, quantity_sold: e.target.value })}
                className="border p-2 w-full mb-4"
            />
            <input
                type="text"
                placeholder="Customer Name"
                value={saleData.customer_name}
                onChange={e => setSaleData({ ...saleData, customer_name: e.target.value })}
                className="border p-2 w-full mb-4"
            />
            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
                Record Sale
            </button>
        </form>
    );
};

export default SalesForm;

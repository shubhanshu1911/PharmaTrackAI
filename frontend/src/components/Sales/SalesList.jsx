import React, { useEffect, useState } from 'react';
import { getAllSales } from '../../api/salesApi';

const SalesList = () => {
    const [sales, setSales] = useState([]);

    useEffect(() => {
        const fetchSales = async () => {
            const response = await getAllSales();
            setSales(response.data);
        };
        fetchSales();
    }, []);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Sales List</h2>
            <ul className="space-y-4">
                {sales.map(sale => (
                    <li key={sale.id} className="bg-white p-4 rounded shadow-md">
                        <div>Product ID: {sale.product_id}</div>
                        <div>Quantity Sold: {sale.quantity_sold}</div>
                        <div>Customer: {sale.customer_name}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SalesList;



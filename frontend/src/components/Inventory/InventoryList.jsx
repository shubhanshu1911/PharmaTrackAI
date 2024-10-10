import React, { useEffect, useState } from 'react';
import { getAllInventory } from '../../api/inventoryApi';

const InventoryList = () => {
    const [inventory, setInventory] = useState([]);

    useEffect(() => {
        const fetchInventory = async () => {
            const response = await getAllInventory();
            setInventory(response.data);
            console.log(response.data);
        };
        fetchInventory();
    }, []);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Inventory List</h2>
            <ul className="space-y-4">
                {inventory.map(item => (
                    <li key={item.id} className="bg-white p-4 rounded shadow-md">
                        <div>Product ID: {item.product_id}</div>
                        <div>Stock: {item.quantity}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default InventoryList;

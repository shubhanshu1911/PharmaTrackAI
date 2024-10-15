import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LowInventory = () => {
    const [lowInventoryProducts, setLowInventoryProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch products with quantity less than ROP when the component loads
    useEffect(() => {
        const fetchLowInventoryProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/sales/below-rop');
                setLowInventoryProducts(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch low inventory products');
                setLoading(false);
            }
        };

        fetchLowInventoryProducts();
    }, []);

    return (
        <div className="p-6 bg-white rounded shadow-md">
            <h1 className="text-2xl font-bold mb-4">Low Inventory Products</h1>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : lowInventoryProducts.length === 0 ? (
                <p>No products have low inventory.</p>
            ) : (
                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-4 py-2">Product ID</th>
                            <th className="border px-4 py-2">Product Name</th>
                            <th className="border px-4 py-2">Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lowInventoryProducts.map((product) => (
                            <tr key={product.product_id}>
                                <td className="border px-4 py-2">{product.product_id}</td>
                                <td className="border px-4 py-2">{product.product_name}</td>
                                <td className="border px-4 py-2">{product.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default LowInventory;

import React, { useState, useEffect } from 'react';
import { placeOrder } from '../../api/ordersApi';
import axios from 'axios';

const OrderForm = () => {
    const [orderData, setOrderData] = useState({
        product_id: '',
        quantity: '',
        supplier_id: '', // Added supplier_id to orderData
    });
    const [productName, setProductName] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null); // State for selected supplier

    // Fetch product suggestions based on the input value
    const fetchProductSuggestions = async (query) => {
        if (query.length < 2) {
            setSuggestions([]); // Don't fetch for short queries
            return;
        }
        try {
            const response = await axios.get(`http://localhost:5000/api/v1/products?query=${query}`);
            setSuggestions(response.data);
        } catch (error) {
            console.error('Error fetching product suggestions:', error);
        }
    };

    // Handle changes in the product name input
    const handleProductNameChange = (e) => {
        const value = e.target.value;
        setProductName(value);
        fetchProductSuggestions(value); // Fetch suggestions on input change
    };

    // Fetch suppliers based on the selected product
    const fetchSuppliers = async () => {
        if (!orderData.product_id) {
            alert("Please select a product first.");
            return;
        }
        try {
            const response = await axios.get(`http://localhost:5000/api/v1/suppliers?product_id=${orderData.product_id}`);
            setSuppliers(response.data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSupplier) {
            alert("Please select a supplier before placing the order.");
            return;
        }
        try {
            // Include selected supplier ID in the order data
            await placeOrder({ ...orderData, supplier_id: selectedSupplier.supplier_id });
            alert('Order placed successfully!');
            // Reset the form
            setProductName('');
            setOrderData({ product_id: '', quantity: '', supplier_id: '' });
            setSelectedSupplier(null);
            setSuppliers([]);
            setSuggestions([]);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSuggestionClick = (product) => {
        setProductName(product.name); // Set the product name
        setOrderData({ ...orderData, product_id: product.id }); // Set the product ID in orderData
        setSuggestions([]); // Clear suggestions
    };

    const handleSupplierClick = (supplier) => {
        setSelectedSupplier(supplier); // Set the selected supplier
        setOrderData({ ...orderData, supplier_id: supplier.supplier_id }); // Set supplier ID in order data
        setSuppliers([]); // Clear the suppliers list after selection
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Place New Order</h2>
            <input
                type="text"
                placeholder="Product Name"
                value={productName}
                onChange={handleProductNameChange}
                className="border p-2 w-full mb-4"
            />
            {/* Suggestions dropdown */}
            {suggestions.length > 0 && (
                <ul className="border border-gray-300 rounded mt-2">
                    {suggestions.map(product => (
                        <li
                            key={product.id}
                            onClick={() => handleSuggestionClick(product)}
                            className="p-2 cursor-pointer hover:bg-gray-200"
                        >
                            {product.name}
                        </li>
                    ))}
                </ul>
            )}
            <input
                type="number"
                placeholder="Quantity"
                value={orderData.quantity}
                onChange={e => setOrderData({ ...orderData, quantity: e.target.value })}
                className="border p-2 w-full mb-4"
            />
            {/* Get Suppliers Button */}
            <button
                type="button"
                onClick={fetchSuppliers}
                className="bg-green-600 text-white py-2 px-4 rounded mb-4"
            >
                Get Suppliers
            </button>

            {/* Suppliers List */}
            {suppliers.length > 0 && (
                <div className="bg-white border border-gray-300 rounded p-4">
                    <h3 className="text-lg font-semibold mb-2">Suppliers:</h3>
                    <ul>
                        {suppliers.map(supplier => (
                            <li
                                key={supplier.supplier_id}
                                onClick={() => handleSupplierClick(supplier)} // Clickable supplier
                                className={`mb-2 cursor-pointer hover:bg-gray-200 ${selectedSupplier?.supplier_id === supplier.supplier_id ? 'bg-blue-100' : ''}`} // Highlight selected supplier
                            >
                                {supplier.name}
                            </li>
                        ))}
                    </ul>
                    <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
                        Place Order
                    </button>
                </div> 
            )}

        </form>
    );
};

export default OrderForm;

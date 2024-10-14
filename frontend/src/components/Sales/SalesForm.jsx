import React, { useState } from 'react';
import { addSale } from '../../api/salesApi';
import axios from 'axios';

const SalesForm = () => {
    const [saleData, setSaleData] = useState({
        product_id: '',
        quantity_sold: '',
        sale_date: '',
        total_amount: '',
        customer_name: '',
    });
    const [productName, setProductName] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [quantityError, setQuantityError] = useState(null); // Error state for quantity validation
    const [dateError, setDateError] = useState(null); // Error state for date validation
    const [isSubmitting, setIsSubmitting] = useState(false); // State to manage the submitting status

    const fetchProductSuggestions = async (query) => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`http://localhost:5000/api/v1/products/products?query=${query}`);
            setSuggestions(response.data);
        } catch (error) {
            console.error('Error fetching product suggestions:', error);
            setError('Failed to fetch product suggestions');
        } finally {
            setLoading(false);
        }
    };

    const handleProductNameChange = (e) => {
        const value = e.target.value;
        setProductName(value);
        fetchProductSuggestions(value);
    };

    const handleSuggestionClick = (product) => {
        setProductName(product.product_name);
        setSaleData({ ...saleData, product_id: product.product_id, total_amount: product.price || '' }); // Assuming product has a price field
        setSuggestions([]);
    };

    // Function to check if the date is in the future
    const isFutureDate = (date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        return selectedDate > today;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!saleData.product_id || !saleData.quantity_sold || !saleData.sale_date) {
            alert('Please fill in all required fields.');
            return;
        }

        // Check if quantity sold is negative
        if (saleData.quantity_sold < 0) {
            setQuantityError('Quantity cannot be negative.');
            return;
        }

        // Check if sale date is in the future
        if (isFutureDate(saleData.sale_date)) {
            alert('Sale date cannot be in the future.');
            return;
        }

        setIsSubmitting(true); // Set loading state to true
        try {
            await addSale(saleData);
            alert('Sale recorded successfully!');

            // Clear the form fields after successful submission
            setSaleData({
                product_id: '',
                quantity_sold: '',
                sale_date: '',
                total_amount: '',
                customer_name: '',
            });
            setProductName('');
            setQuantityError(null); // Clear error on successful submission
        } catch (err) {
            console.error(err);
            alert('Error recording sale. Please try again.'); // Notify user of the error
        } finally {
            setIsSubmitting(false); // Reset loading state
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Record New Sale</h2>
            <input
                type="text"
                placeholder="Customer Name (Optional)"
                value={saleData.customer_name}
                onChange={(e) => setSaleData({ ...saleData, customer_name: e.target.value })}
                className="border p-2 w-full mb-4"
            />
            <input
                type="text"
                placeholder="Product Name"
                value={productName}
                onChange={handleProductNameChange}
                className="border p-2 w-full mb-4"
            />
            {error && <p className="text-red-500">{error}</p>}
            {loading && <p>Loading suggestions...</p>}
            {suggestions.length > 0 && (
                <ul className="border border-gray-300 rounded mt-2">
                    {suggestions.map((product) => (
                        <li
                            key={product.product_id}
                            onClick={() => handleSuggestionClick(product)}
                            className="p-2 cursor-pointer hover:bg-gray-200"
                        >
                            {product.product_name}
                        </li>
                    ))}
                </ul>
            )}

            <input
                type="number"
                placeholder="Quantity Sold"
                value={saleData.quantity_sold}
                onChange={(e) => {
                    const value = parseInt(e.target.value,10);
                    if (value < 0) {
                        setQuantityError('Quantity cannot be negative.');
                        setSaleData({ ...saleData, quantity_sold: '' }); // Reset value if negative
                    } else {
                        setQuantityError(null);
                        setSaleData({ ...saleData, quantity_sold: value });
                    }
                }}
                className="border p-2 w-full mb-4"
            />
            {quantityError && <p className="text-red-500">{quantityError}</p>} {/* Display error if quantity is negative */}


            {/* Date Input */}
            <input
                type="date"
                placeholder="Sale Date"
                value={saleData.sale_date}
                onChange={(e) => {
                    const date = e.target.value;
                    if (isFutureDate(date)) {
                        setDateError('Sale date cannot be in the future.');
                    } else {
                        setDateError(null);
                        setSaleData({ ...saleData, sale_date: date });
                    }
                }}
                className="border p-2 w-full mb-4"
            />
            {dateError && <p className="text-red-500">{dateError}</p>} {/* Show error if date is in future */}

            <button
                type="submit"
                className={`bg-blue-600 text-white py-2 px-4 rounded ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmitting} // Disable button while submitting
            >
                {isSubmitting ? 'Recording...' : 'Record Sale'}
            </button>
        </form>
    );
};

export default SalesForm;

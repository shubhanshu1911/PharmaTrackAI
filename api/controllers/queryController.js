const pool = require('../db');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Define database schema context
const dbSchemaDescription = `
Schema description:
- Table: products (product_id, product_name, company_name, formula, mrp, cost_price, tabs_per_strip, quantity_strips, total_pills, discount_percent, sale_price)
- Table: suppliers (supplier_id, supplier_name, lead_time_claimed, lead_time_actual, reliability, contact)
- Table: product_suppliers (product_supplier_id, product_id, supplier_id, claimed_lead_time_avg, actual_lead_time_avg, cost_price)
- Table: supplier_product_reliability (supplier_product_reliability_id, supplier_id, product_id, claimed_lead_time, actual_lead_time, reliability_score)
- Table: orders (order_id, order_date, product_id, quantity, supplier_id, total_cost, status, claimed_lead_time, actual_delivery_date, actual_lead_time)
- Table: inventory (inventory_id, product_id, quantity, reorder_level)
- Table: sales (sale_id, product_id, quantity_sold, sale_date, total_amount, customer_name)
- Table: customer_requests (request_id, customer_name, product_id, request_date, quantity_requested, status)

Relationships:
- sales.product_id references products.product_id
- sales.customer_id references customers.customer_id
- orders.product_id references products.product_id
- orders.supplier_id references suppliers.supplier_id
- inventory.product_id references products.product_id
- product_suppliers.product_id references products.product_id
- product_suppliers.supplier_id references suppliers.supplier_id
- supplier_product_reliability.product_id references products.product_id
- supplier_product_reliability.supplier_id references suppliers.supplier_id
- customer_requests.product_id references products.product_id
`;

// Controller function to handle the LLM query
const executeLLMQuery = async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ message: 'No prompt provided.' });
    }

    try {
        // Combine the schema context with the natural language prompt
        const fullPrompt = `${dbSchemaDescription}\nTranslate this natural language query into an SQL query: "${prompt}"`;

        // Use Gemini API to generate the SQL query with schema context
        const aiResponse = await model.generateContent({
            prompt: fullPrompt
        });

        // Extract the SQL query from the Gemini API response
        const sqlQuery = aiResponse.data.generations[0].text.trim();
        console.log('Generated SQL Query:', sqlQuery);

        // Execute the generated SQL query on the database
        const dbResult = await pool.query(sqlQuery);

        // Check if the query is a SELECT query
        if (sqlQuery.toLowerCase().startsWith('select')) {
            // Handle SELECT queries: Convert result to natural language
            const dbResultString = JSON.stringify(dbResult.rows);
            const aiNaturalLanguageResponse = await model.generateContent({
                prompt: `Convert this SQL result into a natural language response: "${dbResultString}"`
            });

            const naturalLanguageResponse = aiNaturalLanguageResponse.data.generations[0].text.trim();
            res.json({ naturalLanguageResponse, sqlQuery, dbResult: dbResult.rows });
        } else {
            // Handle non-SELECT queries (INSERT, UPDATE, DELETE)
            res.json({ message: 'Query executed successfully.', sqlQuery });
        }
    } catch (err) {
        console.error('Error processing the query:', err);
        res.status(500).json({ message: 'Error processing the query.', error: err.message });
    }
};

module.exports = { executeLLMQuery };

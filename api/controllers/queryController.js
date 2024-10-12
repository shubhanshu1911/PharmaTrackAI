const pool = require('../db');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Define database schema context
const dbSchemaDescription = `
Schema description:
- Table: products (product_id, product_name, price, quantity)
- Table: sales (sale_id, product_id, quantity_sold, sale_date, total_amount, customer_name)
- Table: customers (customer_id, customer_name, email, phone_number)
Relationships:
- sales.product_id references products.product_id
- sales.customer_id references customers.customer_id
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

const pool = require('../db');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Controller function to handle the LLM query
const executeLLMQuery = async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ message: 'No prompt provided.' });
    }

    try {
        // Use Gemini API to generate the SQL query
        const result = await model.generateContent(prompt);
        const sqlQuery = result.response.text();

        // Execute the generated SQL query
        const dbResult = await pool.query(sqlQuery);
        res.json(dbResult.rows);
    } catch (err) {
        console.error('Error processing the query:', err);
        res.status(500).json({ message: 'Error processing the query.', error: err.message });
    }
};

module.exports = { executeLLMQuery };

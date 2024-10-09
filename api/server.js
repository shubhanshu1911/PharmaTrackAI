const express = require('express');
const pool = require('./db');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 5000;

pool.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the database');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pkg = require('pg');
const { Client } = pkg;

const app = express();
const port = 3000;

// Use cors and bodyParser middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL client setup
const client = new Client({
    user: 'dailyjokes_admin',
    host: 'localhost',
    database: 'dailyjokes',
    password: process.env.DB_PASSWORD,
    port: 5432,
});

// Connect to the database
client.connect();

// Close DB
client.end();

// GET request handler
app.get("/", (req, res) => {
    res.send({"hello": "world!"});
});

// GET request handler
app.get("/ping", (req, res) => {
    res.send({"pong": "2"});
});

// POST request handler for posting a joke
app.post("/joke", async (req, res) => {
    try {
        const { userId, textBody, topic } = req.body;
        const insertQuery = 'INSERT INTO joke (userId, textBody, topic, createdTimeStamp, createdDate, score) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_DATE, 0) RETURNING *';
        
        const response = await client.query(insertQuery, [userId, textBody, topic]);
        res.status(201).json(response.rows[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Start the server
const server = app.listen(port, () => console.log(`Listening on ${port}`));

module.exports = { app, server };

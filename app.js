import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import pkg from 'pg';
const { Client } = pkg;

const app = express();
const port = 3000;

// Use cors and bodyParser middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL client setup
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'jokes',
    password: process.env.DB_PASSWORD,
    port: 5432,
});

// Connect to the database
client.connect();

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
app.listen(port, () => console.log("Listening on", port));
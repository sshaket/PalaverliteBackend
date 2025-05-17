import express from 'express';
import { json } from 'body-parser';
import { createServer } from 'http';
import { sequelize } from './config/dbConfig';
import app from './app';

const server = createServer(app);

// Middleware
app.use(json());

// Database connection
sequelize.authenticate()
    .then(() => {
        console.log('Database connected');
        return sequelize.sync(); // Synchronize models with the database
    })
    .then(() => {
        console.log('Database synchronized');
    })
    .catch((err: any) => console.error('Database connection failed', err));

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
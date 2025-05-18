import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import { createServer } from 'http';
import { sequelize } from './config/dbConfig';
import app from './app';

const server = createServer(app);

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

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
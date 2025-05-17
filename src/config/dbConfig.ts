import { S3Client } from '@aws-sdk/client-s3';
import { Sequelize } from 'sequelize';
import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const sequelize = new Sequelize(
    process.env.DB_NAME || 'echomatelite',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || 'Shaket@123',
    {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        dialect: 'mysql',
        logging: console.log, // Enable logging
    }
);
//Aurora DB password: Shaket123
const pool = createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Shaket@123',
    database: process.env.DB_NAME || 'echomatelite',
    port: Number(process.env.DB_PORT) || 3306,
});

const s3 = new S3Client({
    
    region: process.env.AWS_REGION || 'us-east-1',
});

export { sequelize, pool, s3 };
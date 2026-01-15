import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  max: Number(process.env.MAX),
  idleTimeoutMillis: Number(process.env.IDLE_TIMEOUT_MILLIS),
  connectionTimeoutMillis: Number(process.env.CONNECTION_TIMEOUT_MILLIS),
  mainapiurl: process.env.MAIN_API_URL,
});

pool.on('connect', () => {
    console.log('Connected to the database');
});

export { pool };





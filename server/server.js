import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import conversionRoutes from './routes/conversion.js';
import { pool } from './config/database.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Currency Converter API is running',
        endpoint: {
            convert: '/api/convert',
            currencies: '/api/currencies',
            rates: '/api/rates/:base'
        }
    })
})

// Routes
app.use('/api', conversionRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(err.status || 500).json({
        success: false,
        error: {
            message: err.message || 'Internal Server Error'
        }
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        Path: req.originalUrl,
        method: req.method
    });
});

async function startServer() {
    try {
        // Test database connection
        await pool.query('SELECT NOW()');
        console.log('Connected to the database successfully.');

        app.listen(PORT, () => {
            console.log(` Server is running on port ${PORT}`);
            console.log(` API: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(' Failed to start the server:', error);    
    }
}

startServer();
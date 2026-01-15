import { pool } from '../config/database.js';

export async function saveConversion(fromCurrency, toCurrency, amount, result, rate) {
    try {
        await pool.query(
            `
            INSERT INTO conversions (from_currency, to_currency, amount, result, rate, created_at)
            VALUES ($1, $2, $3, $4, $5, NOW())
            `,
            [fromCurrency, toCurrency, amount, result, rate]
        );
    } catch (error) {
        console.error('Error saving conversion:', error);
        throw error;
    } 
}

export async function getConversionHistory(limit = 10) {
    try {
        const res = await pool.query(
            `
            SELECT id, from_currency, to_currency as to_currency, amount, result, rate, created_at
            FROM conversions
            ORDER BY created_at DESC
            LIMIT $1
            `,
            [limit]
        );
        return res.rows;
    } catch (error) {
        console.error('Error fetching conversion history:', error);
        throw error;
    }
}


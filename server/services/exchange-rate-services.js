import axios from 'axios';
import { pool } from '../config/database.js';

const API_URL = process.env.EXCHANGE_API_URL;
const CACHE_DURATION = process.env.CACHE_DURATION || 3600; // in seconds
const baseCurrency = 'USD';

export async function getExchangeRates(baseCurrency) {
    try {
        const res = await axios.get(`${API_URL}/${baseCurrency}`);
        const rates = res.data.conversion_rates;
        return rates;
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        throw new Error('Failed to fetch exchange rates');
    }
}

export async function getCachedRates(base, target) {
  const client = await pool.connect();

  try {
    const res = await client.query(
      `
      SELECT rate, updated_at
      FROM exchange_rates
      WHERE base_currency = $1 AND target_currency = $2
      `,
      [base, target]
    );

    if (res.rows.length === 0) {
      return null;
    }

    const cachedData = res.rows[0];
    const currentTime = Date.now();
    const cacheTime = new Date(cachedData.updated_at).getTime();
    const diffInSeconds = (currentTime - cacheTime) / 1000;

    if (diffInSeconds < CACHE_DURATION) {
      return cachedData.rate;
    }

    return null;

  } catch (error) {
    console.error('Error retrieving cached rates:', error);
    throw new Error('Failed to retrieve cached rates');
  } finally {
    client.release();
  }
}

export async function saveRateToCache(base, target, rate) {
  try {
    await pool.query(
      `
      INSERT INTO exchange_rates (base_currency, target_currency, rate, updated_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (base_currency, target_currency)
      DO UPDATE SET 
        rate = $3, 
        updated_at = NOW()
      `,
      [base, target, rate]
    );
  } catch (error) {
    console.error('Error saving rates to cache:', error);
    throw new Error('Failed to save rates to cache');
  } 
}

export async function getRateWithCache(base, target) {
  const cache = await getCachedRates(base, target);
  if (cache) {
    return cache;
  }

  const rates = await getExchangeRates(base);
  if (!rates || !rates[target]) {
    throw new Error(`Exchange rate for ${target} not found`);
  }
  await saveRateToCache(base, target, rates[target]);
  return rates[target];
}

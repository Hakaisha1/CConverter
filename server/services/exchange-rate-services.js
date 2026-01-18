import axios from 'axios';
import { prisma } from '../config/database.js';
import { saveHistoricalRate } from './database-service.js';

const API_URL = process.env.EXCHANGE_API_URL;
const CACHE_DURATION = process.env.CACHE_DURATION || 3600; // in seconds

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
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const cachedRate = await prisma.exchangeRate.findFirst({
      where: {
        baseCurrency: base,
        targetCurrency: target,
        rateDate: new Date(today)
      }
    });

    if (!cachedRate) {
      return null;
    }

    const currentTime = Date.now();
    const cacheTime = new Date(cachedRate.createdAt).getTime();
    const diffInSeconds = (currentTime - cacheTime) / 1000;

    if (diffInSeconds < CACHE_DURATION) {
      return parseFloat(cachedRate.rate);
    }

    return null;

  } catch (error) {
    console.error('Error retrieving cached rates:', error);
    throw new Error('Failed to retrieve cached rates');
  }
}

export async function saveRateToCache(base, target, rate) {
  try {
    const today = new Date();
    await saveHistoricalRate(base, target, rate, today);
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


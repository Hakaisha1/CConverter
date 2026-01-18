import { prisma } from '../config/database.js';

// Save historical rate with date
export async function saveHistoricalRate(baseCurrency, targetCurrency, rate, rateDate = new Date()) {
    try {
        await prisma.exchangeRate.upsert({
            where: {
                baseCurrency_targetCurrency_rateDate: {
                    baseCurrency,
                    targetCurrency,
                    rateDate: new Date(rateDate.toISOString().split('T')[0]) // Date only
                }
            },
            update: { rate },
            create: {
                baseCurrency,
                targetCurrency,
                rate,
                rateDate: new Date(rateDate.toISOString().split('T')[0])
            }
        });
    } catch (error) {
        console.error('Error saving historical rate:', error);
        throw error;
    }
}

// Get historical rates for chart (last N days)
export async function getHistoricalRates(baseCurrency, targetCurrency, days = 7) {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const rates = await prisma.exchangeRate.findMany({
            where: {
                baseCurrency,
                targetCurrency,
                rateDate: {
                    gte: startDate
                }
            },
            orderBy: {
                rateDate: 'asc'
            }
        });

        return rates;
    } catch (error) {
        console.error('Error fetching historical rates:', error);
        throw error;
    }
}

// Delete rates older than N days
export async function deleteOldRates(days = 7) {
    try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const result = await prisma.exchangeRate.deleteMany({
            where: {
                rateDate: {
                    lt: cutoffDate
                }
            }
        });

        console.log(`Deleted ${result.count} old rate records`);
        return result.count;
    } catch (error) {
        console.error('Error deleting old rates:', error);
        throw error;
    }
}

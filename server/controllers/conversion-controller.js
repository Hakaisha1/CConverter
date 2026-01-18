import { getRateWithCache, getExchangeRates } from "../services/exchange-rate-services.js";

export async function convertCurrency(req, res) {
    try {
        const { from, to, amount } = req.body;
        
        if (!from || !to || !amount) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        if(isNaN(amount) || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount, must be a positive number' });
        }

        const fromCurrency = from.toUpperCase();
        const toCurrency = to.toUpperCase();

        const rate = await getRateWithCache(fromCurrency, toCurrency);
        if (!rate) {
            return res.status(500).json({ error: 'Failed to retrieve exchange rate' });
        }

        const result = (parseFloat(amount) * rate).toFixed(2);
        
        return res.status(200).json({
            from: fromCurrency,
            to: toCurrency,
            amount: parseFloat(amount),
            rate,
            result: parseFloat(result)
        });
    } catch (error) {
        console.error('Error in convertCurrency:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


export async function getCurrencies(req, res) {
    try {
        const rates = await getExchangeRates('USD');
        const currencies = Object.keys(rates);
        if (!currencies.includes('USD')) {
            currencies.unshift('USD');
        }
        currencies.sort();

        return res.status(200).json({ currencies });
    } catch (error) {
        console.error('Error in getCurrencies:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getRates(req, res) {
    try {
        const base = req.params.base.toUpperCase();
        if (!/^[A-Z]{3}$/.test(base)) {
            return res.status(400).json({ error: 'Invalid base currency format' });
        }

        const rates = await getExchangeRates(base);
        if (!rates) {
            return res.status(500).json({ error: 'Failed to retrieve exchange rates' });
        }
        return res.status(200).json({ base, rates });
    } catch (error) {
        console.error('Error in getRates:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}




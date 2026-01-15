import { useEffect, useState } from "react";
import { validateAmount } from "../utils/format";
import { getCurrencies, convertCurrency } from "../services/api";
import AmountInput from "./amount-input";
import CurrencySelector from "./currency-selector";
import ErrorMessage from "./error-message";
import ConversionResult from "./conversion-result";
import LoadingSpinner from "./loading-spinner";

export default function CurrencyConverter() {
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('IDR');
    const [amount, setAmount] = useState(1);
    const [result, setResult] = useState(null);
    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCurrencies();
    }, []);

    const fetchCurrencies = async () => {
        try {
            setLoading(true);
            const data = await getCurrencies();
            console.log('Currencies data:', data);
            setCurrencies(data.currencies || []);
            setError(null);
        } catch (err) {
            console.error('Fetch currencies error:', err);
            setError(err.message || 'Failed to fetch currencies.');
            setCurrencies([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!amount || amount === '0') return;
        const timer = setTimeout(() => {
            handleConvert();
        }, 500);

        return () => clearTimeout(timer);
    }, [amount, fromCurrency, toCurrency]);

    const handleConvert = async () => {
        const validation = validateAmount(amount);
        if (!validation.valid) {
            setError(validation.error);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await convertCurrency(fromCurrency, toCurrency, validation.value);
            console.log('Convert result:', data);
            setResult(data);
        } catch (err) {
            console.error('Convert error:', err);
            setError(err.message || 'Failed to convert currency');
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSwap = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);

        if (result) {
            setResult({
                ...result,
                from: toCurrency,
                to: fromCurrency,
                amount: result.result,
                result: result.amount,
                rate: 1 / result.rate
            });
        }
    };

    return (
        <div className="min-h-screen bg-[var(--paper)] py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* header */}
                <div className="max-w-2xl mb-8">
                    <h1 className="display text-6xl font-semibold text-[var(--ink)] mb-2">
                        CConverter
                    </h1>
                    <p className="text-gray-600">
                        Very fast dan reliable currency converter.
                    </p>
                </div>
                {/* main */}
                <div className=" card-paper p-8">

                    {error && (
                        <div className="mb-4">
                            <ErrorMessage message={error} onClose={() => setError(null)} />
                        </div>   
                    )}

                    <div className="mb-4">
                        <CurrencySelector
                            label="From"
                            value={fromCurrency}
                            onChange={setFromCurrency}
                            currencies={currencies}
                            disabled={loading}
                        />
                    </div>

                    <div className="mb-4">
                        <AmountInput 
                            label="Amount"
                            value={amount}
                            onChange={setAmount}
                            currency={fromCurrency}
                            disabled={loading}
                        />
                    </div>

                    <div className="flex justify-center mb-4">
                        <button
                            onClick={handleSwap}
                            disabled={loading}
                            className="p-3 rounded-full border border-[var(--line)] hover:bg-black/5 transition-colors disabled:opacity-50"
                        >  
                        </button>
                    </div>

                    <div className="mb-6">
                        <CurrencySelector
                            label="To"
                            value={toCurrency}
                            onChange={setToCurrency}
                            currencies={currencies}
                            disabled={loading}
                        />
                    </div>

                    <button 
                        onClick={handleConvert}
                        disabled={loading || ! amount}
                        className="w-full btn-ink"
                        >
                        {loading ? 'Converting...' : 'Convert'}
                    </button>

                    {loading && (
                        <div className="mt-6">
                            <LoadingSpinner />
                        </div>
                    )}

                    {!loading && result && (
                        <div className="mt-6">
                            <ConversionResult {...result} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
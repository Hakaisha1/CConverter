import { useEffect, useState } from "react";
import { getConversionHistory } from "../services/api";
import { formatNumber, formatDate } from "../utils/format";

export default function ConversionHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async (limit = 10) => {
        try {
            setLoading(true);
            const data = await getConversionHistory(limit);
            console.log('History data:', data); // Debug
            setHistory(data || []);
            setError(null);
        } catch (err) {
            console.error('History error:', err); // Debug
            setError(err.message);
            setHistory([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8 text-gray-600">Loading history...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">{error}</div>;
    }

    if (!history || !history.length) {
        return <div className="text-center py-8 text-gray-600">No conversion history yet.</div>;
    }

    return (
        <>
            {/* Desktop */}
            <div className="hidden md:block card-paper overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">From</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">To</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((item) => (
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm">{formatDate(item.created_at)}</td>
                                <td className="px-6 py-4 text-sm">{formatNumber(item.amount, 2)} {item.from_currency}</td>
                                <td className="px-6 py-4 text-sm">{formatNumber(item.result, 2)} {item.to_currency}</td>
                                <td className="px-6 py-4 text-sm">{formatNumber(item.rate, 4)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden space-y-4">
                {history.map((item) => (
                    <div key={item.id} className="card-paper p-4">
                        <div className="text-sm text-gray-600 mb-2">{formatDate(item.created_at)}</div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{formatNumber(item.amount, 2)} {item.from_currency}</span>
                            <span className="text-gray-400">→</span>
                            <span className="font-medium">{formatNumber(item.result, 2)} {item.to_currency}</span>
                        </div>
                        <div className="text-xs text-gray-500">Rate: {formatNumber(item.rate, 4)}</div>
                    </div>
                ))}
            </div>
        </>
    )
}
export default function CurrencySelector({ value, onChange, currencies = [], label, disabled = false }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
                {label}
            </label>
            <select 
                value={value} 
                onChange={(e) => onChange(e.target.value)} 
                disabled={disabled || !currencies.length}
                className="w-full p-3 border border-[var(--line)] rounded-lg bg-[var(--panel)] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {!currencies.length && (
                    <option>Loading...</option>
                )}

                {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                        {currency}
                    </option>
                ))}
            </select>
        </div>
    )
}
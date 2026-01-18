export default function AmountInput({ value, onChange, label, currency, disabled = false }) {
    const handleChange = (e) => {
        const inputValue = e.target.value;
        if (inputValue === '' || /^[0-9]*\.?[0-9]*$/.test(inputValue)) {
            onChange(inputValue);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
                {label}
            </label>

            <div className="relative">
                <input 
                    type="text" 
                    value={value}
                    onChange={handleChange}
                    disabled={disabled}
                    placeholder="Enter Amount"
                    className="w-full p-3 pr-20 border border-var(--line) bg-var(--panel) text-var(--ink) focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20 disabled:opacity-50"
                />
                {currency && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-100 px-3 py-1 rounded text-sm font-medium text-gray-700">
                        {currency}
                    </span>
                )}
            </div>
        </div>
    )
}
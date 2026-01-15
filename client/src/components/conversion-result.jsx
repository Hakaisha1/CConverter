import { ArrowRight } from "lucide-react"
import { formatNumber } from "../utils/format"

export default function ConversionResult({ from, to, amount, result, rate }) {
    return (
        <div className="card-paper p-6">
            <div className="flex items-center justify-center gap-4 mb-4">
                <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{from}</p>
                    <p className="text-3xl font-bold text-gray-800">{formatNumber(amount, 2)}</p>
                </div>

                <ArrowRight className="text-[var(--muted)]" size={32}/>

                <div className="flex-1 text-right">
                    <p className="text-sm text-gray-600 mb-1">{to}</p>
                    <p className="text-3xl font-bold text-[var(--ink)]">{formatNumber(result, 2)}</p>
                </div>
            </div>

            <div className="text-center text-sm text-gray-600 pt-4 border-t border-[var(--line)]">
                1 {from} = {formatNumber(rate, 4)} {to}
            </div>
        </div>
    )
}
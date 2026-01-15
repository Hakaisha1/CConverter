import { AlertCircle, X } from "lucide-react";

export default function ErrorMessage({ message, onClose }) {
    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-red-500" size={20} />
            <p className="flex-1 text-red-800">{message}</p>
            {onClose && (
                <button onClick={onClose} className="text-red-500 hover:text-red-700">
                    <X size={18}/>
                </button>
            )}
        </div>
    )
}
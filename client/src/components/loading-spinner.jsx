export default function LoadingSpinner({size = 'sm'}) {
    const spinnerStyle = {
        sm: 'w-6 h-6',
        md: 'w-12 h-12',
        lg: 'w-20 h-20',
    };

    return (
        <div className="flex justify-center items-center">
            <div className={`${spinnerStyle[size]} border-4 border-[var(--line)] border-t-[var(--ink)] rounded-full animate-spin`}></div>
        </div>
    )
}
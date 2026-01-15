export const formatCurrency = (amount, currencyCode) => {
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    } catch (error) {
        console.error('Error formatting currency:', error);
        return amount.toFixed(2);
        }
    }

export const formatNumber = (number, decimals = 2) => {
    try {
        if (typeof number !== 'number') {
            number = Number(number);
        }

        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(number);
        
    } catch (error) {
        console.error('Error formatting number:', error);
        return Number(number).toFixed(decimals);    
    }
}

export const formatDate = (dateString) => {
    try {
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };

        return date.toLocaleDateString('en-US', options);
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}

export const validateAmount = (amount) => {
    try {
        const num = Number(amount);
        if (isNaN(num) || num <= 0) {
            return { valid: false, error: "Amount was invalid" };
        }
        return { valid: true, value: num };
    } catch (error) {
        console.error('Error validating amount:', error);
        return { valid: false, error: "Amount was invalid" };
    }
}




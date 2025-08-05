/**
 * Utility functions for formatting currency values in Indonesian Rupiah (IDR).
 * @module currencyUtils
 */

/**
 * Formats a number as Indonesian Rupiah currency (e.g., Rp 10.000).
 * @param amount - The amount to format.
 * @returns The formatted currency string.
 */
export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

/**
 * Formats a number as a short Indonesian Rupiah string (e.g., Rp 1.2Jt, Rp 1.2M).
 * @param amount - The amount to format.
 * @returns The formatted short currency string.
 */
export const formatCurrencyShort = (amount: number) => {
    if (amount >= 1000000000) { // 1 Billion
        return `Rp ${(amount / 1000000000).toFixed(1)}M`;
    }
    if (amount >= 1000000) { // 1 Million
        return `Rp ${(amount / 1000000).toFixed(1)}Jt`;
    }
    if (amount >= 1000) { // 1 Thousand
        return `Rp ${(amount / 1000).toFixed(1)}Rb`;
    }
    return `Rp ${amount.toFixed(0)}`;
};
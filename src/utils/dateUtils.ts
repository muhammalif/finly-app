/**
 * Utility functions for formatting and working with dates.
 * @module dateUtils
 */
import { format, parseISO } from 'date-fns';

/**
 * Formats a date string as 'MMM d, yyyy' (e.g., Jan 1, 2023).
 * @param dateString - The ISO date string to format.
 * @returns The formatted date string.
 */
export const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM d, yyyy');
};

/**
 * Formats a date string as 'MM d, yyyy HH:mm' (e.g., 01 1, 2023 13:45).
 * @param dateString - The ISO date string to format.
 * @returns The formatted date and time string.
 */
export const formatDateTime = (dateString: string) => {
    return format(parseISO(dateString), 'MM d, yyyy HH:mm');
};

/**
 * Gets the current month as a string in 'yyyy-MM' format.
 * @returns The current month string.
 */
export const getCurrentMonth = () => {
    return format(new Date(), 'yyyy-MM');
};
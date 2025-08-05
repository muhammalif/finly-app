/**
 * Types for transaction data and related structures.
 * @module Transaction
 */

/**
 * Represents a single transaction (income or expense).
 */
export interface Transaction {
    id: number;
    amount: number;
    description: string;
    date: string;
    type: 'income' | 'expense';
    category: string;
}

/**
 * Data required to create or edit a transaction.
 */
export interface TransactionFormData {
    amount: string;
    description: string;
    category: string;
    type: 'income' | 'expense';
}

/**
 * Aggregated spending data for a category.
 */
export interface CategorySpending {
    category: string;
    amount: number;
    percentage: number;
}

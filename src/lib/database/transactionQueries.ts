/**
 * Database query utilities for transactions (CRUD operations).
 * Used for adding, fetching, deleting transactions and getting balance.
 * @module transactionQueries
 */
import { getDB } from './db';
import { Transaction } from '../../types/Transaction';

/**
 * Adds a new transaction to the database.
 * @param transaction - Transaction data (without id and date)
 * @returns Promise resolving to the created Transaction
 */
export const addTransaction = async (transaction: Omit<Transaction, 'id' | 'date'>): Promise<Transaction> => {
    const db = await getDB();
    const [result] = await db.executeSql(
        `INSERT INTO transactions (amount, description, category, type)
        VALUES (?, ?, ?, ?)`,
        [transaction.amount, transaction.description, transaction.category, transaction.type]
    );
    
    const [newTransaction] = await db.executeSql(
        `SELECT * FROM transactions WHERE id = ?`,
        [result.insertId]
    );
    
    return newTransaction.rows.item(0);
};

/**
 * Fetches transactions from the database, ordered by date descending.
 * @param limit - Maximum number of transactions to fetch (default: 100)
 * @returns Promise resolving to an array of Transaction objects
 */
export const getTransactions = async (limit = 100): Promise<Transaction[]> => {
    const db = await getDB();
    const [results] = await db.executeSql(
        `SELECT * FROM transactions ORDER BY date DESC LIMIT ?`,
        [limit]
    );

    const transactions: Transaction[] = [];
    for (let i = 0; i < results.rows.length; i++) {
        transactions.push(results.rows.item(i));
    }
    return transactions;
};

/**
 * Gets the current balance by summing all transactions.
 * @returns Promise resolving to the current balance (number)
 */
export const getBalance = async (): Promise<number> => {
    const db = await getDB();
    const [results] = await db.executeSql(
        `SELECT SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as balance FROM transactions`
    );
    return results.rows.item(0).balance || 0;
};

/**
 * Deletes all transactions from the database.
 * @returns Promise resolving when all transactions are deleted
 */
export const deleteAllTransactions = async () => {
    const db = await getDB();
    await db.executeSql(`DELETE FROM transactions`);
};

/**
 * Deletes a single transaction from the database by ID.
 * @param id - The ID of the transaction to delete
 * @returns Promise resolving when the transaction is deleted
 */
export const deleteTransaction = async (id: number) => {
    const db = await getDB();
    await db.executeSql(`DELETE FROM transactions WHERE id = ?`, [id]);
};

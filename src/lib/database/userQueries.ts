/**
 * Database query utilities for user authentication and PIN management.
 * Used for verifying and changing the user's PIN.
 * @module userQueries
 */
import { getDB } from './db';

/**
 * Verifies if the provided PIN matches the stored PIN.
 * @param pin - The PIN to verify
 * @returns Promise resolving to true if the PIN is correct, false otherwise
 */
export const verifyPin = async (pin: string): Promise<boolean> => {
    const db = await getDB();
    const [results] = await db.executeSql(
        `SELECT pin FROM users LIMIT 1`
    );

    if (results.rows.length > 0) {
        return results.rows.item(0).pin === pin;
    }
    return false;
};

/**
 * Changes the user's PIN to a new value.
 * @param newPin - The new PIN to set
 * @returns Promise resolving when the PIN is updated
 */
export const changePin = async (newPin: string) => {
    const db = await getDB();
    await db.executeSql(`UPDATE users SET pin = ?`, [newPin]);
};

/**
 * Resets the user's PIN to the default value '1234'.
 * @returns Promise resolving when the PIN is reset
 */
export const resetUserPin = async () => {
    const db = await getDB();
    await db.executeSql(`UPDATE users SET pin = '1234'`);
};

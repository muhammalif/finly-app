/**
 * Database initialization and access utilities for SQLite.
 * Handles creation of tables and singleton DB instance for the app.
 * @module db
 */

import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';

// Enable promise-based API
SQLite.enablePromise(true);

let dbInstance: SQLiteDatabase | null = null;

/**
 * Initializes the SQLite database, creates tables if needed, and returns the DB instance.
 * @returns Promise resolving to the SQLiteDatabase instance.
 */
export const initDB = async (): Promise<SQLiteDatabase> => {
    if (dbInstance) return dbInstance;

    // Open database connetion
    const db = await SQLite.openDatabase({
        name: 'finly.db',
        location: 'default',
    });

    await db.executeSql(`
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL NOT NULL,
            description TEXT,
            category TEXT,
            date TEXT DEFAULT CURRENT_TIMESTAMP,
            type TEXT CHECK(type IN ('income', 'expense'))
        );
    `);

    await db.executeSql(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pin TEXT NOT NULL
        );
    `);

    // Insert default PIN if not exists
    const [result] = await db.executeSql(
        `SELECT COUNT(*) AS count FROM users`
    );

    if (result.rows.item(0).count === 0) {
        await db.executeSql(
            `INSERT INTO users (pin) VALUES ('1234')`
        );
    }

    dbInstance = db;
    return db;
};

/**
 * Returns the singleton SQLiteDatabase instance, initializing if necessary.
 * @returns Promise resolving to the SQLiteDatabase instance.
 */
export const getDB = async (): Promise<SQLiteDatabase> => {
    if (!dbInstance) {
        return initDB();
    }
    return dbInstance;
};

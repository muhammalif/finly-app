/**
 * Utilities for exporting transaction data to Excel and sharing the file.
 * Used for backup/export features in the app.
 * @module backupUtils
 */

import RNFS from 'react-native-fs'
import Share from 'react-native-share'
import { getTransactions } from '@lib/database/transactionQueries';
import * as XLSX from 'xlsx';
import { Transaction } from '@typings/Transaction';

/**
 * Exports all transactions to an Excel file and shares it.
 * @returns Promise resolving when export and share are complete
 */
export const exportData = async () => {
    try {
        // Get transactions from database
        const transactions = await getTransactions();
        if (!transactions || transactions.length === 0) {
            throw new Error('No transactions found to export');
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `finly-export-${timestamp}.xlsx`;
        await exportExcel(transactions, filename);
    } catch (error) {
        console.error('Export failed:', error);
        throw error;
    }
};

/**
 * Converts transaction data to Excel, saves the file, and shares it.
 * @param data - Array of transactions to export
 * @param filename - Name of the Excel file to create
 * @returns Promise resolving when the file is saved and shared
 */
const exportExcel = async (data: Transaction[], filename: string) => {
    try {
        // Convert transactions to worksheet format
        const worksheet = XLSX.utils.json_to_sheet(data.map(t => ({
            Date: new Date(t.date).toLocaleDateString(),
            Description: t.description || '-',
            Amount: t.amount,
            Category: t.category,
            Type: t.type
        })));

        // Create workbook and add worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

        // Generate buffer
        const wbout = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
        
        // Save file
        const filePath = `${RNFS.DocumentDirectoryPath}/${filename}`;
        await RNFS.writeFile(filePath, wbout, 'base64');

        // Share file
        await Share.open({
            url: 'file://' + filePath,
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            filename,
        })
    } catch (error) {
        console.error('Excel export failed:', error)
        throw error
    }
}; 
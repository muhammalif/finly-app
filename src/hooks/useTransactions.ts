/**
 * Custom React hook for managing and accessing transactions and balance.
 * Provides methods to fetch, add, and delete transactions, and to refresh data.
 * @module useTransactions
 */
import { useState, useEffect, useCallback } from 'react';
import { 
  getTransactions, 
  addTransaction as addTransactionDB,
  deleteTransaction as deleteTransactionDB,
  getBalance as getBalanceDB
} from '@lib/database/transactionQueries';
import { Transaction } from '@typings/Transaction';

/**
 * useTransactions hook for accessing and managing transactions and balance.
 * @returns Object with transactions, balance, loading, error, and CRUD methods.
 */
export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [txns, bal] = await Promise.all([
        getTransactions(),
        getBalanceDB()
      ]);
      console.log('getTransactions result:', txns)
      setTransactions(txns);
      setBalance(bal);
      setError(null);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id' | 'date'>) => {
    try {
      const newTransaction = await addTransactionDB(transaction);
      console.log('addTransactionDB result:', newTransaction)
      await fetchData();
      return newTransaction;
    } catch (err) {
      console.error('Failed to add transaction:', err);
      throw err;
    }
  }, [fetchData]);

  const deleteTransaction = useCallback(async (id: number) => {
    try {
      await deleteTransactionDB(id);
      await fetchData(); // Sync ulang dari database setelah delete
    } catch (err) {
      console.error('Failed to delete transaction:', err);
      throw err;
    }
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    transactions,
    balance,
    loading,
    error,
    refresh: fetchData,
    addTransaction,
    deleteTransaction
  };
};
/**
 * Custom React hook for accessing and updating the user's balance.
 * Provides methods to fetch, refresh, and update the balance locally.
 * @module useBalance
 */
import { useState, useEffect, useCallback } from 'react';
import { getBalance } from '@lib/database/transactionQueries';

/**
 * useBalance hook for accessing and updating the user's balance.
 * @returns Object with balance, loading, error, refresh, and updateBalance methods.
 */
export const useBalance = () => {
    const [balance, setBalance] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchBalance = useCallback(async () => {
        try {
            setLoading(true)
            const currentBalance = await getBalance()
            setBalance(currentBalance)
            setError(null)
        } catch (err) {
            setError('Failed to load balance')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchBalance()
    }, [fetchBalance])

    return {
        balance,
        loading,
        error,
        refresh: fetchBalance,
        updateBalance: (amount: number, type: 'income' | 'expense') => {
            setBalance(prev => type === 'income' ? prev + amount : prev - amount)
        },
    }
}
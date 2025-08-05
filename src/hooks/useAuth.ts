/**
 * Custom React hook for authentication and PIN management.
 * Provides login, changePin, and error handling for authentication flows.
 * @module useAuth
 */
import { useState, useCallback } from 'react';
import { verifyPin, changePin as changePinDB } from '@lib/database/userQueries';

/**
 * useAuth hook for authentication and PIN management.
 * @returns Object with loading, error, login, changePin, and clearError methods.
 */
export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (pin: string) => {
    try {
      setLoading(true);
      setError(null);
      const isValid = await verifyPin(pin);
      if (!isValid) {
        throw new Error('Invalid PIN. Please try again.');
      }
      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const changePin = useCallback(async (newPin: string, currentPin?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (currentPin) {
        const isValid = await verifyPin(currentPin);
        if (!isValid) {
          throw new Error('Current PIN is incorrect');
        }
      }
      
      await changePinDB(newPin);
      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to change PIN');
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    login,
    changePin,
    clearError: () => setError(null)
  };
};
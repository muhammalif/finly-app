// ===================== IMPORTS =====================
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, AppAction, AppContextType } from '@typings/AppContext';
import { getTransactions, getBalance } from '@lib/database/transactionQueries';

/**
 * Type for the app's dispatch function.
 */
export type AppDispatch = React.Dispatch<AppAction>;

// ===================== INITIAL STATE =====================
/**
 * The initial state for the global app context.
 */
const initialState: AppState = {
  isAuthenticated: false,
  transactions: [],
  balance: 0,
  loading: true,
};

// ===================== CONTEXT =====================
/**
 * The React context for the app's global state and dispatch.
 */
const AppContext = createContext<AppContextType | undefined>(undefined);

// ===================== REDUCER =====================
/**
 * Reducer function for the app's global state.
 * Handles all actions defined in AppAction.
 * @param state - The current app state.
 * @param action - The action to apply.
 * @returns The new app state.
 */
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true };
    case 'LOGOUT':
      return { ...initialState, isAuthenticated: false };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload, loading: false };
    case 'SET_BALANCE':
      return { ...state, balance: action.payload };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
        balance:
          action.payload.type === 'income'
            ? state.balance + action.payload.amount
            : state.balance - action.payload.amount,
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

// ===================== PROVIDER =====================
/**
 * AppProvider component that wraps the app and provides global state.
 * Loads transactions and balance when authenticated.
 * @param children - The child components.
 */
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  /**
   * Loads transactions and balance from the database.
   */
  const loadData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const [transactions, balance] = await Promise.all([
        getTransactions(),
        getBalance(),
      ]);
      dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
      dispatch({ type: 'SET_BALANCE', payload: balance });
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    if (state.isAuthenticated) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isAuthenticated]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// ===================== HOOK =====================
/**
 * Custom hook to access the app context.
 * @returns The app context value.
 * @throws If used outside of AppProvider.
 */
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

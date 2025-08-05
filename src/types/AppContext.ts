/**
 * Types for global app state and context actions.
 * @module AppContext
 */
import { Transaction } from './Transaction'

/**
 * The shape of the global app state.
 */
export interface AppState {
    isAuthenticated: boolean;
    transactions: Transaction[];
    balance: number;
    loading: boolean;
}

/**
 * All possible actions that can be dispatched to the app reducer.
 */
export type AppAction =
    | { type: 'LOGIN' }
    | { type: 'LOGOUT' }
    | { type: 'ADD_TRANSACTION'; payload: Transaction }
    | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
    | { type: 'SET_BALANCE'; payload: number }
    | { type: 'SET_LOADING'; payload: boolean };

/**
 * The context type for the app, including state and dispatch.
 */
export interface AppContextType {
    state: AppState;
    dispatch: React.Dispatch<AppAction>;
}
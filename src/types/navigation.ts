/**
 * Navigation parameter list for the main app stack.
 * Each property represents a route and its params.
 */
export type RootStackParamList = {
    /** Main tab navigator (bottom tabs) */
    MainTabs: undefined;
    /** Dashboard screen */
    Dashboard: undefined;
    /** Transaction history screen */
    TransactionHistory: undefined;
    /** Add transaction screen */
    AddTransaction: undefined;
    /** Settings screen */
    Settings: undefined;
    /** Authentication screen */
    Auth: undefined;
    /** Change PIN - old PIN input */
    ChangePinOld: undefined;
    /** Change PIN - new PIN input */
    ChangePinNew: { oldPin: string };
    /** Change PIN - confirm new PIN */
    ChangePinConfirm: { oldPin: string; newPin: string };
}; 
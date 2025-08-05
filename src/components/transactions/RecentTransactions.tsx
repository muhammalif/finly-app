/**
 * RecentTransactions component for displaying a list of the most recent transactions.
 * Used on the dashboard to show a preview of recent activity.
 * @module RecentTransactions
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import TransactionItem from './TransactionItem';
import { Transaction } from '@typings/Transaction';
import { useTranslation } from 'react-i18next';

/**
 * Props for RecentTransactions component.
 * @property transactions - Array of recent transactions to display.
 * @property onViewAll - Callback to view all transactions.
 */
interface RecentTransactionsProps {
    transactions: Transaction[];
    onViewAll: () => void;
}

/**
 * Displays a list of the most recent transactions, with a button to view all.
 * @param props - RecentTransactionsProps
 */
const RecentTransactions: React.FC<RecentTransactionsProps> = ({
    transactions,
    onViewAll
}) => {
    const { t } = useTranslation();
    const recentTransactions = transactions.slice(0, 5);

    return (
        <View style={styles.cardParent}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('recent_transactions')}</Text>
                <TouchableOpacity onPress={onViewAll}>
                    <Text style={styles.viewAll}>{t('view_all')}</Text>
                </TouchableOpacity>
            </View>
            {recentTransactions.length > 0 ? (
                recentTransactions.map(item => (
                    <TransactionItem key={item.id} transaction={item} />
                ))
            ) : (
                <Text style={styles.empty}>{t('no_transactions')}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    cardParent: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        marginBottom: 5,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
        letterSpacing: 0.1,
    },
    viewAll: {
        color: '#222',
        textDecorationLine: 'underline',
        fontWeight: '700',
        fontSize: 15,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 8,
        backgroundColor: 'transparent',
        overflow: 'hidden',
    },
    empty: {
        textAlign: 'center',
        color: '#888',
        paddingVertical: 18,
        fontSize: 15,
    },
    iconWrapper: { 
        backgroundColor: '#F2F2F2', 
        borderRadius: 12, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginRight: 12 },
    icon: { 
        color: '#222', 
        fontSize: 22 },
    subtitle: { 
        color: '#888', 
        fontSize: 13 },
    valueIncome: { 
        color: '#1BC760', 
        fontWeight: 'bold', 
        fontSize: 15 },
    valueExpense: { 
        color: '#F65454', 
        fontWeight: 'bold', 
        fontSize: 15 },
});

export default RecentTransactions
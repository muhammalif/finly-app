/**
 * SummaryCards component for displaying income, expense, and savings summary cards.
 * Used on the dashboard to show monthly financial summary.
 * @module SummaryCards
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { colors } from '@themes/colors';
import { Transaction } from '@typings/Transaction';

/**
 * Props for SummaryCards component.
 * @property transactions - Array of all transactions.
 * @property showBalance - Whether to show or mask the values.
 * @property initialBalance - The initial balance value.
 */
interface SummaryCardsProps {
  transactions: Transaction[];
  showBalance: boolean;
  initialBalance: number;
}

/**
 * Displays summary cards for income, expense, and savings for the current month.
 * @param props - SummaryCardsProps
 */
const SummaryCards: React.FC<SummaryCardsProps> = ({ transactions, showBalance, initialBalance }) => {
  const { t } = useTranslation();
  const now = new Date();
  // Calculate income, expense, savings for this month
  const income = transactions
    .filter(t => t.type === 'income' && new Date(t.date).getMonth() === now.getMonth() && new Date(t.date).getFullYear() === now.getFullYear())
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === now.getMonth() && new Date(t.date).getFullYear() === now.getFullYear())
    .reduce((sum, t) => sum + t.amount, 0);
  const savings = initialBalance + income - expense;
  // Format currency as IDR
  const formatIDR = (amount: number) => amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });

  return (
    <View style={styles.summaryRow}>
      {/* Income */}
      <View style={[styles.summaryCard]}> 
        <View style={styles.iconCircleIncome}>
          <Icon name="arrow-down-circle" size={24} color="#1BC760" />
        </View>
        <Text style={styles.summaryLabel}>{t('income')}</Text>
        <Text style={styles.summaryValue}>{showBalance ? formatIDR(income) : '••••••••'}</Text>
      </View>
      {/* Expense */}
      <View style={[styles.summaryCard]}> 
        <View style={styles.iconCircleExpense}>
          <Icon name="arrow-up-circle" size={24} color="#F65454" />
        </View>
        <Text style={styles.summaryLabel}>{t('expense')}</Text>
        <Text style={styles.summaryValue}>{showBalance ? formatIDR(expense) : '••••••••'}</Text>
      </View>
      {/* Savings */}
      <View style={[styles.summaryCard]}> 
        <View style={styles.iconCircleSavings}>
          <Icon name="target" size={24} color="#2684FC" />
        </View>
        <Text style={styles.summaryLabel}>{t('savings', 'Savings')}</Text>
        <Text style={styles.summaryValue}>{showBalance ? formatIDR(savings) : '••••••••'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 2,
    gap: 10,
    paddingHorizontal: 2,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginHorizontal: 2,
    backgroundColor: colors.secondary,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
    minWidth: 90,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#444',
    fontWeight: '600',
    marginTop: 6,
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 2,
  },
  iconCircleIncome: {
    backgroundColor: '#C6F6E4',
    borderRadius: 16,
    padding: 8,
    marginBottom: 2,
  },
  iconCircleExpense: {
    backgroundColor: '#FAD4D4',
    borderRadius: 16,
    padding: 8,
    marginBottom: 2,
  },
  iconCircleSavings: {
    backgroundColor: '#D6E6FF',
    borderRadius: 16,
    padding: 8,
    marginBottom: 2,
  },
});

export default SummaryCards; 
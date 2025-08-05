// ===================== IMPORTS =====================
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, StatusBar } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BalanceCard from '@components/dashboard/BalanceCard';
import FinancialTipsCard from '@components/dashboard/FinancialTipsCard';
import SummaryCards from '@components/dashboard/SummaryCards';
import RecentTransactions from '@components/transactions/RecentTransactions';
import Button from '@components/common/Button';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { colors } from '@themes/colors';
import { useTransactions } from '@hooks/useTransactions';
import { RootStackParamList } from '@typings/navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';

// ===================== TYPES =====================
/**
 * Props for DashboardScreen
 * navigation: navigation prop for navigating between screens
 */
type DashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;
};

/**
 * Returns a greeting string based on the current time.
 * @param t Translation function
 */
function getGreeting(t: any) {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return t('greeting_morning');
  if (hour >= 12 && hour < 15) return t('greeting_afternoon');
  if (hour >= 15 && hour < 18) return t('greeting_evening');
  return t('greeting_night');
}

// ===================== MAIN COMPONENT =====================
const DashboardScreen = ({ navigation }: DashboardScreenProps) => {
  const { t, i18n } = useTranslation();
  // ===== Transaction state and hooks =====
  const { transactions, loading, error, refresh } = useTransactions();
  // State for showing/hiding balance
  const [showBalance, setShowBalance] = useState(true);
  // State for username and initial balance
  const [username, setUsername] = useState('');
  const [initialBalance, setInitialBalance] = useState(0);

  // Calculate total income, expense, and current balance
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const currentBalance = initialBalance + totalIncome - totalExpense;

  // Format header date
  const now = new Date();
  const formattedDate = now.toLocaleDateString(i18n.language, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Fetch username and initial balance every time the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('username').then(val => setUsername(val || ''));
      AsyncStorage.getItem('initialBalance').then(val => setInitialBalance(Number(val) || 0));
      refresh();
    }, [refresh])
  );

  // ===== Render loading skeleton =====
  if (loading) {
    return (
      <View testID='dashboard-skeleton'>
        <SkeletonPlaceholder borderRadius={16}>
          <View style={{ padding: 16 }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
              <View style={{ width: 120, height: 22, borderRadius: 8 }} />
              <View style={{ flex: 1 }} />
              <View style={{ width: 120, height: 18, borderRadius: 8 }} />
            </View>
            {/* Balance Card */}
            <View style={{ width: '100%', height: 110, borderRadius: 24, marginBottom: 18 }} />
            {/* Summary Cards */}
            <View style={{ flexDirection: 'row', marginBottom: 18 }}>
              <View style={{ flex: 1, height: 60, borderRadius: 16, marginRight: 8 }} />
              <View style={{ flex: 1, height: 60, borderRadius: 16, marginRight: 8 }} />
              <View style={{ flex: 1, height: 60, borderRadius: 16 }} />
            </View>
            {/* Financial Tips */}
            <View style={{ width: '100%', height: 60, borderRadius: 16, marginBottom: 18 }} />
            {/* Recent Transactions */}
            <View style={{ width: '100%', height: 48, borderRadius: 12, marginBottom: 10 }} />
            {[1,2,3].map(i => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <View style={{ width: '60%', height: 14, borderRadius: 4, marginBottom: 6 }} />
                  <View style={{ width: '40%', height: 12, borderRadius: 4 }} />
                </View>
                <View style={{ width: 60, height: 14, borderRadius: 4, marginLeft: 8 }} />
              </View>
            ))}
          </View>
        </SkeletonPlaceholder>
      </View>
    );
  }

  // ===== Render main dashboard =====
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
        <ScrollView style={styles.container} contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 8, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
          {/* Header*/}
          <View style={styles.headerModernRow}>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.greetingModern}>{getGreeting(t)}</Text>
              <Text style={styles.usernameModern}>{username}</Text>
            </View>
            <View style={styles.dateModernWrap}>
              <Text style={styles.dateModern}>{formattedDate}</Text>
            </View>
          </View>
          {/* Balance Card */}
          <View style={styles.section}>
            <BalanceCard
              balance={currentBalance}
              showBalance={showBalance}
              onToggleShowBalance={() => setShowBalance(v => !v)}
            />
          </View>
          {/* Summary Cards (Income, Expense, Savings) */}
          <SummaryCards
            transactions={transactions}
            showBalance={showBalance}
            initialBalance={initialBalance}
          />
          {/* Financial Tips/Insights */}
          <View style={styles.section}>
            <FinancialTipsCard transactions={transactions} />
          </View>
          {/* Recent Transactions */}
          <View style={styles.section}>
            <RecentTransactions
              transactions={transactions.slice(0, 5)}
              onViewAll={() => navigation.navigate('TransactionHistory')}
            />
          </View>
          {/* Error box */}
          {error && (
            <Button
              title={t('retry')}
              onPress={refresh}
              variant='secondary'
              style={styles.retryButton}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

// ===================== STYLES =====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerModernRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 18,
    marginTop: 8,
    paddingHorizontal: 8,
    flexWrap: 'nowrap',
  },
  greetingModern: {
    fontSize: 18,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 0,
  },
  usernameModern: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 2,
  },
  dateModernWrap: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: 18,
    flexShrink: 0,
  },
  dateModern: {
    fontSize: 18,
    color: colors.textSecondary,
    opacity: 0.95,
    marginLeft: 12,
    textAlign: 'right',
    fontWeight: '600',
    flexShrink: 0,
  },
  section: {
    marginBottom: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  retryButton: {
    marginTop: 16,
    alignItems: 'center',
  },
});

export default DashboardScreen;

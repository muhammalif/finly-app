// ===================== IMPORTS =====================
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Chart from '@components/statistics/Chart';
import PieLegend from '@components/statistics/PieLegend';
import DateRangePickerModal from '@components/common/DateRangePickerModal';
import SegmentedControl from '@components/common/SegmentedControl';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { expenseCategories, incomeCategories } from 'constants/categories';
import { getPeriodOptions } from '../constants/periodOptions';
import { colors } from '@themes/colors';
import { useTransactions } from '@hooks/useTransactions';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';

// ===================== UTILS =====================
/**
 * Utility functions for date filtering
 */
function isToday(date: Date) {
  const now = new Date();
  return date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
}
function isThisWeek(date: Date) {
  const now = new Date();
  const firstDayOfWeek = new Date(now);
  firstDayOfWeek.setDate(now.getDate() - now.getDay());
  firstDayOfWeek.setHours(0,0,0,0);
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
  lastDayOfWeek.setHours(23,59,59,999);
  return date >= firstDayOfWeek && date <= lastDayOfWeek;
}
function isThisMonth(date: Date) {
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}
function isThisYear(date: Date) {
  const now = new Date();
  return date.getFullYear() === now.getFullYear();
}

// ===================== MAIN COMPONENT =====================
/**
 * Main component for displaying statistics and charts.
 * No props, uses useTransactions for data.
 */
export default function StatisticsScreen() {
  const { t } = useTranslation();
  // ===== State for period and transaction type =====
  const [period, setPeriod] = useState<'day'|'week'|'month'|'year'|'all'>('month');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  // Get transactions and loading/error state from custom hook
  const { transactions, loading, error, refresh } = useTransactions();
  // State for date range picker
  const [showRangePicker, setShowRangePicker] = useState(false);
  const [customRange, setCustomRange] = useState<{start: Date|null, end: Date|null}>({start: null, end: null});

  // Refresh data every time the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, [refresh])
  );

  // Filter transactions by type and period
  const categories = type === 'expense' ? expenseCategories : incomeCategories;
  const filtered = transactions.filter(t => {
    if (t.type !== type) return false;
    if (customRange.start && customRange.end) {
      const d = new Date(t.date);
      return d >= customRange.start && d <= customRange.end;
    }
    if (period === 'day') return isToday(new Date(t.date));
    if (period === 'week') return isThisWeek(new Date(t.date));
    if (period === 'month') return isThisMonth(new Date(t.date));
    if (period === 'year') return isThisYear(new Date(t.date));
    return true;
  });
  // Data for Pie Chart
  const pieData = categories.map(cat => {
    const value = filtered.filter(t => t.category === cat.key).reduce((sum, t) => sum + t.amount, 0);
    return {
      x: cat.key,
      y: value,
      color: cat.color,
      icon: cat.icon,
    };
  }).filter(d => d.y > 0);

  // ===== Render loading skeleton =====
  if (loading) {
    return (
      <SkeletonPlaceholder borderRadius={16}>
        <View style={{ padding: 16 }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
            <View style={{ width: 120, height: 22, borderRadius: 8 }} />
            <View style={{ flex: 1 }} />
            <View style={{ width: 40, height: 22, borderRadius: 8 }} />
          </View>
          {/* Segmented Control */}
          <View style={{ flexDirection: 'row', marginBottom: 18 }}>
            {[1,2,3,4,5].map(i => (
              <View key={i} style={{ flex: 1, height: 32, borderRadius: 12, marginRight: i < 5 ? 8 : 0 }} />
            ))}
          </View>
          {/* Toggle Expense/Income */}
          <View style={{ flexDirection: 'row', marginBottom: 18 }}>
            <View style={{ flex: 1, height: 36, borderRadius: 12, marginRight: 8 }} />
            <View style={{ flex: 1, height: 36, borderRadius: 12 }} />
          </View>
          {/* Chart */}
          <View style={{ width: '100%', aspectRatio: 1, borderRadius: 100, marginBottom: 18 }} />
          {/* Legend */}
          {[1,2,3].map(i => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, marginRight: 14 }} />
              <View style={{ flex: 1 }}>
                <View style={{ width: '60%', height: 16, borderRadius: 4, marginBottom: 6 }} />
              </View>
              <View style={{ width: 80, height: 16, borderRadius: 4, marginLeft: 8 }} />
            </View>
          ))}
        </View>
      </SkeletonPlaceholder>
    );
  }

  // ===== Render statistics and chart =====
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
        <View style={{flex:1}}>
          {/* Header dan filter */}
          <View style={[styles.headerRow, {paddingHorizontal: 12}]}> 
            <View style={{flexDirection:'row', alignItems:'center',justifyContent:'space-between'}}>
              <Text style={styles.title}>{t('statistics')}</Text>
              <TouchableOpacity onPress={() => setShowRangePicker(true)} style={{marginLeft: 10}}>
                <Icon name="calendar-range" size={28} color={colors.icon} />
              </TouchableOpacity>
            </View>
            {/* Segmented Control for period filtering */}
            <SegmentedControl
              options={getPeriodOptions(t)}
              value={period}
              onChange={key => {
                setPeriod(key as typeof period);
                setCustomRange({start: null, end: null});
              }}
              style={[styles.periodSegmentedRow, {paddingHorizontal: 12}]}
            />
            {/* Toggle transaction type */}
            <View style={[styles.toggleRowLarge, {paddingHorizontal: 12, marginBottom: 10}]}> 
              <TouchableOpacity
                testID='expense-toggle-button'
                style={[styles.toggleBtnLarge, type === 'expense' && styles.toggleActiveExpense]}
                onPress={() => setType('expense')}
                activeOpacity={0.8}
              >
                <View style={styles.toggleContentCol}>
                  <Text style={[styles.toggleTextLarge, type === 'expense' && styles.toggleTextActive]}>{t('expense')}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                testID='income-toggle-button'
                style={[styles.toggleBtnLarge, type === 'income' && styles.toggleActiveIncome]}
                onPress={() => setType('income')}
                activeOpacity={0.8}
              >
                <View style={styles.toggleContentCol}>
                  <Text style={[styles.toggleTextLarge, type === 'income' && styles.toggleTextActive]}>{t('income')}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {/* Chart & Legend */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 8, paddingBottom: 80 }}>
            <View style={styles.container}>
              <View style={styles.section}><Chart
                testID="statistics-chart"
                transactions={filtered}
                loading={loading}
                error={error}
                type={type}
              /></View>
              <View style={styles.section}><PieLegend 
                testID="statistics-pie-legend"
                pieData={pieData} 
                type={type} /></View>
            </View>
          </ScrollView>
        </View>
        {/* Date range picker modal */}
        <DateRangePickerModal
          visible={showRangePicker}
          onClose={() => setShowRangePicker(false)}
          onConfirm={range => {
            setCustomRange(range);
            setShowRangePicker(false);
          }}
          initialRange={customRange}
        />
      </SafeAreaView>
    </>
  );
}

// ===================== STYLES =====================
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingHorizontal: 4,
  },
  headerRow: {
    marginBottom: 20,
    marginTop: 8,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  periodSegmentedRow: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    borderRadius: 18,
    padding: 4,
    marginBottom: 12,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 420,
  },
  periodSegmentedBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    minWidth: 0,
  },
  periodSegmentedActive: {
    backgroundColor: colors.textPrimary,
  },
  periodSegmentedText: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  periodSegmentedTextActive: {
    color: colors.white,
    textAlign: 'center',
  },
  dropdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
    alignSelf: 'center',
  },
  dropdownBtn: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 2,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  dropdownBtnText: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 15,
  },
  segmentedRow: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    borderRadius: 16,
    marginBottom: 12,
    marginTop: 2,
    alignSelf: 'center',
    padding: 4,
  },
  segmentedBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentedActive: {
    backgroundColor: colors.primary,
  },
  segmentedText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 15,
  },
  segmentedTextActive: {
    color: colors.white,
  },
  toggleRowLarge: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 2,
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 4,
    alignSelf: 'center',
  },
  toggleBtnLarge: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  toggleActiveExpense: {
    backgroundColor: colors.primary,
  },
  toggleActiveIncome: {
    backgroundColor: colors.primary,
  },
  toggleTextLarge: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: 'bold',
  },
  toggleTextActive: {
    color: colors.white,
  },
  toggleContentCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: 2,
  },
});

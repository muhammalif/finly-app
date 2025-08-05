/**
 * PieLegend component for displaying a legend for the pie chart in the statistics screen.
 * Shows category icons, labels, and values for each slice.
 * @module PieLegend
 */
import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';
import Card from '@components/common/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatCurrency } from '@utils/currencyUtils';
import { useTranslation } from 'react-i18next';
import { colors } from '@themes/colors';

/**
 * Item for the pie chart legend.
 * @property x - Category key/label.
 * @property y - Value for the category.
 * @property color - Color for the category.
 * @property icon - Icon name for the category.
 */
interface PieLegendItem {
  x: string; // label
  y: number; // value
  color: string;
  icon: string;
}

/**
 * Props for PieLegend component.
 * @property pieData - Array of legend items.
 * @property type - 'expense' or 'income'.
 */
interface PieLegendProps extends ViewProps {
  pieData: PieLegendItem[];
  type: 'expense' | 'income';
}

/**
 * Displays a legend for the pie chart, showing category icons, labels, and values.
 * @param props - PieLegendProps
 */
export default function PieLegend({ pieData, type, ...rest }: PieLegendProps) {
  const { t } = useTranslation();
  if (!pieData || pieData.length === 0) return null;
  return (
    <Card {...rest} style={styles.card}>
      <View style={styles.legendColumnWrap}>
        {pieData.map((cat) => {
          console.log('PieLegend cat.x:', cat.x, 't(cat.x):', t(cat.x));
          return (
            <View key={cat.x} style={styles.legendRow}>
              <View style={styles.leftWrap}>
                <View style={[styles.iconBg, { backgroundColor: colors.bgIcon }]}> 
                  <Icon name={cat.icon} size={28} color={colors.icon} />
                </View>
                <Text style={styles.legendLabel}>{t(cat.x)}</Text>
              </View>
              <Text style={styles.legendValue}>
                {type === 'income' ? '+ ' : '- '}{formatCurrency(cat.y)}
              </Text>
            </View>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 4,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  legendColumnWrap: {
    flexDirection: 'column',
    gap: 4,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  leftWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendLabel: {
    color: '#888',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  legendValue: {
    color: '#222',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    minWidth: 100,
  },
}); 
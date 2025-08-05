/**
 * FinancialTipsCard component for displaying financial tips and dynamic insights as a carousel.
 * Used on the dashboard to provide helpful advice and highlights to the user.
 * @module FinancialTipsCard
 */
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Transaction } from '@typings/Transaction';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

type CategoryTotals = { [category: string]: number };

/**
 * Generates dynamic insights based on the user's transactions.
 * @param transactions - Array of transactions
 * @param t - Translation function
 * @returns Array of dynamic insight strings
 */
function getDynamicInsights(transactions: Transaction[], t: any): string[] {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const monthlyExpenses = transactions?.filter(
    (t: Transaction) => t.type === 'expense' && new Date(t.date).getMonth() === thisMonth && new Date(t.date).getFullYear() === thisYear
  ) || [];
  if (monthlyExpenses.length === 0) return [];
  const categoryTotals: CategoryTotals = {};
  monthlyExpenses.forEach((t: Transaction) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });
  const topCategory = (Object.entries(categoryTotals) as [string, number][]).sort((a, b) => b[1] - a[1])[0];
  if (!topCategory) return [];
  return [
    t('biggest_expense', { category: t(topCategory[0]) }),
    t('total_expense', { amount: `Rp ${topCategory[1].toLocaleString('id-ID')}` })
  ];
}

/**
 * Props for FinancialTipsCard component.
 * @property transactions - Optional array of transactions for generating insights.
 */
interface FinancialTipsCardProps {
  transactions?: Transaction[];
}

const CARD_WIDTH = width - 48;

/**
 * Displays a carousel of financial tips and dynamic insights.
 * @param props - FinancialTipsCardProps
 */
const FinancialTipsCard: React.FC<FinancialTipsCardProps> = ({ transactions = [] }) => {
  const { t } = useTranslation();
  const dynamicInsights = getDynamicInsights(transactions, t);
  const staticTips = t('financial_tips_list', { returnObjects: true }) as string[];
  const shuffledStatic = useMemo(() => staticTips.sort(() => Math.random() - 0.5), [staticTips]);
  const tips = dynamicInsights.concat(shuffledStatic);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  // Auto-slide logic
  useEffect(() => {
    if (tips.length <= 1) return;
    const timer = setTimeout(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= tips.length) nextIndex = 0;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 4000);
    return () => clearTimeout(timer);
  }, [currentIndex, tips.length]);

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={tips}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item, index }) => (
          <Animated.View style={{
            width: CARD_WIDTH,
            marginHorizontal: 8,
            transform: [
              { scale: currentIndex === index ? 1 : 0.97 }
            ],
          }}>
            <LinearGradient
              colors={["#FFFBEA", "#FFF6D1"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <View style={styles.iconWrap}>
                <Icon name="lightbulb-on-outline" size={26} color="#FFD600" />
              </View>
              <Text style={styles.text}>{item}</Text>
            </LinearGradient>
          </Animated.View>
        )}
        snapToAlignment="center"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef.current}
        style={{ maxHeight: 110 }}
        contentContainerStyle={{ paddingHorizontal: 0 }}
        getItemLayout={(_, index) => ({ length: CARD_WIDTH + 16, offset: (CARD_WIDTH + 16) * index, index })}
      />
      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {tips.map((_, idx) => (
          <View
            key={idx}
            style={[styles.dot, currentIndex === idx ? styles.dotActive : null]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 8,
    shadowColor: '#FFD600',
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 3,
    minHeight: 70,
    maxHeight: 110,
  },
  iconWrap: {
    backgroundColor: '#FFF3B0',
    borderRadius: 16,
    padding: 8,
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#444',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    letterSpacing: 0.1,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 8,
    gap: 2,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FFE066',
    marginHorizontal: 3,
    opacity: 0.5,
    borderWidth: 1,
    borderColor: '#FFD600',
  },
  dotActive: {
    backgroundColor: '#FFD600',
    opacity: 1,
    borderWidth: 1.5,
    borderColor: '#FFD600',
    width: 10,
    height: 10,
  },
});

export default FinancialTipsCard; 
/**
 * Chart component for displaying a pie chart of income or expense by category.
 * Used in the statistics screen to visualize spending or earning distribution.
 * @module Chart
 */
import React, { useState, useEffect } from 'react';
import { Text, Dimensions, StyleSheet, ActivityIndicator, View, ViewProps } from 'react-native';
import { VictoryPie } from 'victory-native';
import Svg, { G, Text as SvgText } from 'react-native-svg';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Card from '@components/common/Card';
import { colors } from '@themes/colors';
import { Transaction } from '@typings/Transaction';
import { formatCurrency } from '@utils/currencyUtils';
import { expenseCategories, incomeCategories } from 'constants/categories';
import { useTranslation } from 'react-i18next';

/**
 * Props for Chart component.
 * @property transactions - Array of transactions to visualize.
 * @property loading - Whether the chart is loading.
 * @property error - Error message if any.
 * @property type - 'expense' or 'income' to determine which data to show.
 */
interface ChartProps extends ViewProps {
    transactions: Transaction[];
    loading?: boolean;
    error?: string | null;
    type: 'expense' | 'income';
}

/**
 * Displays a pie chart of income or expense by category, with animated slices and icons.
 * @param props - ChartProps
 */
const Chart: React.FC<ChartProps> = ({ 
    transactions,
    loading,
    error,
    type,
    ...rest
}) => {
    const { t } = useTranslation();
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const categories = type === 'expense' ? expenseCategories : incomeCategories;
    const filtered = transactions.filter(t => t.type === type);
    const spendingByCategory = categories.reduce((acc: Record<string, number>, cat) => {
        acc[cat.key] = filtered.filter((t) => t.category === cat.key).reduce((sum, t) => sum + t.amount, 0);
        return acc;
    }, {});
    const pieData = categories.map((cat) => ({
      x: cat.key,
      y: spendingByCategory[cat.key] || 0,
      color: cat.color,
      icon: cat.icon,
    })).filter(d => d.y > 0);
    console.log('pieData for PieLegend:', pieData);
    const chartWidth = Math.min(Dimensions.get('window').width * 0.8, 300);

    function easeOutQuad(t: number): number {
      return t * (2 - t);
    }

    const [animatedPieData, setAnimatedPieData] = useState(pieData.map(d => ({ ...d, y: 0 })));

    useEffect(() => {
      let frame = 0;
      const totalFrames = 80;
      const interval = setInterval(() => {
        frame++;
        setAnimatedPieData(
          pieData.map((d) => ({
            ...d,
            y: Math.round(d.y * easeOutQuad(frame / totalFrames)),
          }))
        );
        if (frame >= totalFrames) clearInterval(interval);
      }, 16);
      return () => clearInterval(interval);
    }, [pieData]);

    if (loading) {
        return (
            <Card style={styles.card}>
                <ActivityIndicator 
                    size="large" 
                    color={colors.primary} 
                    testID='loading-indicator'/>
            </Card>
        );
    }
    if (error) {
        return (
            <Card style={styles.card}>
                <Text style={styles.errorText}>{error}</Text>
            </Card>
        );
    }
    if (pieData.length === 0) {
        return (
            <Card style={styles.card}>
                <Text style={styles.emptyText}>📊 {t('no_data_available')}</Text>
            </Card>
        );
    }
    // Custom icon or percent overlay in the middle of each slice
    const renderIcons = () => {
      const total = pieData.reduce((sum, d) => sum + d.y, 0);
      if (!total) return null;
      let startAngle = 0;
      return pieData.map((d, idx) => {
        if (d.y <= 0) return null;
        const sliceAngle = (d.y / total) * 360;
        const midAngle = startAngle + sliceAngle / 2;
        const r = (chartWidth / 2 + chartWidth / 3) / 2;
        const theta = (midAngle - 90) * Math.PI / 180;
        const x = chartWidth / 2 + r * Math.cos(theta);
        const y = chartWidth / 2 + r * Math.sin(theta);
        startAngle += sliceAngle;
        const percent = Math.round((d.y / total) * 100);
        return (
          <G key={d.x}>
            {selectedIndex === idx ? (
              <SvgText
                x={x}
                y={y + 4}
                fontSize={15}
                fontWeight="bold"
                fill="#fff"
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {percent}%
              </SvgText>
            ) : (
              <SvgText
                x={x}
                y={y + 6}
                fontSize={1}
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                <MaterialCommunityIcons
                  name={d.icon}
                  size={22}
                  color="#fff"
                  style={{ position: 'absolute', left: x - 11, top: y - 11 }}
                />
              </SvgText>
            )}
          </G>
        );
      });
    };

    // Handler for click slice
    const handleSlicePress = (_: any, props: any) => {
      const idx = props.index;
      setSelectedIndex(selectedIndex === idx ? null : idx);
    };

    return (
        <Card {...rest} style={Object.assign({}, styles.card, { paddingBottom: 28 })}>
                    <View style={styles.pieChartWrap}>
                        <Svg width={chartWidth} height={chartWidth} style={{ alignSelf: 'center' }}>
                            <VictoryPie
                                key={pieData.map(d => d.x).join('-')}
                                standalone={false}
                                width={chartWidth}
                                height={chartWidth}
                                data={animatedPieData}
                                colorScale={pieData.map(d => d.color)}
                                innerRadius={chartWidth / 2}
                                labelRadius={chartWidth / 1.7}
                                labels={() => ''}
                                style={{
                                    data: { stroke: "#fff", strokeWidth: 3 }
                                }}
                                animate={false}
                                events={[
                                {
                                    target: "data",
                                    eventHandlers: {
                                    onPressIn: (event, props) => {
                                        handleSlicePress(event, props);
                                        return null;
                                    },
                                    },
                                },
                                ]}
                            />
                            {renderIcons()}
                        </Svg>
                </View>
                    {/* Legend removed from here */}
            {selectedIndex !== null && (
                <View style={styles.selectedInfo}>
                    <Text style={[styles.selectedCategory, { color: pieData[selectedIndex].color }]}> {t(pieData[selectedIndex].x)} </Text>
                    <Text style={styles.selectedValue}> {formatCurrency(pieData[selectedIndex].y)} </Text>
                </View>
            )}
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 16,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 18,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 0,
    },
    periodBadge: {
        backgroundColor: '#2684FC',
        color: '#fff',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
        fontSize: 13,
        fontWeight: '700',
        overflow: 'hidden',
    },
    legendRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 8,
        marginBottom: 8,
        rowGap: 10,
    },
    legendPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F2',
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginHorizontal: 6,
        marginBottom: 10,
        minWidth: 0,
        flexBasis: '42%',
        justifyContent: 'center',
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 6,
    },
    legendText: {
        color: '#222',
        fontSize: 13,
        fontWeight: '500',
    },
    selectedInfo: {
        alignItems: 'center',
        marginTop: 18,
    },
    selectedCategory: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 2,
        color: '#222',
    },
    selectedValue: {
        color: '#222',
        fontSize: 20,
        fontWeight: 'bold',
    },
    emptyText: {
        color: '#888',
        fontSize: 16,
        textAlign: 'center',
        paddingVertical: 16,
    },
    errorText: {
        color: '#888',
        textAlign: 'center',
        paddingVertical: 16,
    },
    toggleRowLarge: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 18,
        marginTop: 2,
        backgroundColor: '#EAF1FB',
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
        backgroundColor: '#2684FC',
    },
    toggleActiveIncome: {
        backgroundColor: '#2684FC',
    },
    toggleTextLarge: {
        color: '#2684FC',
        fontSize: 17,
        fontWeight: 'bold',
    },
    toggleTextActive: {
        color: '#fff',
    },
    pieChartWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        marginTop: 8,
    },
    pieCenterContent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },
    pieCenterValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#222',
        textAlign: 'center',
    },
    pieCenterLabel: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
        textAlign: 'center',
        fontWeight: '500',
    },
    legendModernWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
        marginTop: 10,
        marginBottom: 2,
    },
    legendModernPill: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 5,
        margin: 4,
        backgroundColor: '#F5F6FA',
        minWidth: 0,
    },
    legendModernText: {
        color: '#222',
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 4,
    },
    toggleContentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    toggleContentCol: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    toggleValue: {
        marginTop: 2,
        fontWeight: 'bold',
        fontSize: 14,
        color: '#222',
        textAlign: 'center',
    },
});

export default Chart;

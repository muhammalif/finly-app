// ===================== IMPORTS =====================
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTransactions } from '@hooks/useTransactions';
import { colors } from '@themes/colors';
import TransactionItem from '@components/transactions/TransactionItem';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import DateRangePickerModal from '@components/common/DateRangePickerModal';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Transaction } from '@typings/Transaction';
import { useTranslation } from 'react-i18next';

// ===================== MAIN COMPONENT =====================
/**
 * Main component for displaying transaction history.
 * No props, uses useTransactions for data.
 */
const TransactionHistoryScreen = () => {
    const { t } = useTranslation();
    // ===== Get transactions and state from custom hook =====
    const {
        transactions,
        loading,
        error,
        refresh
    } = useTransactions();

    // Refresh data every time the screen is focused
    useFocusEffect(
        React.useCallback(() => {
            refresh();
        }, [refresh])
    );

    // ===== State for pagination and date filter =====
    const PAGE_SIZE = 15;
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [showRangePicker, setShowRangePicker] = useState(false);
    const [customRange, setCustomRange] = useState<{start: Date|null, end: Date|null}>({start: null, end: null});

    // ========== Optimized Infinite Scroll ========== //
    // Filter transactions if customRange is active
    const filteredTransactions = customRange.start && customRange.end
        ? transactions.filter(t => {
            const d = new Date(t.date);
            return d >= customRange.start! && d <= customRange.end!;
        })
        : transactions;
    // Get data for current page (pagination)
    const pagedTransactions = filteredTransactions.slice(0, page * PAGE_SIZE);
    const hasMore = pagedTransactions.length < filteredTransactions.length;

    /**
     * Handler for loading more data when scrolling to the bottom
     */
    const handleEndReached = () => {
        if (hasMore && !loadingMore && !loading) {
            setLoadingMore(true);
            setTimeout(() => {
                setPage(prev => prev + 1);
                setLoadingMore(false);
            }, 400);
        }
    };

    /**
     * Render a single transaction item
     */
    const renderItem = React.useCallback(
        ({ item }: { item: Transaction }) => <TransactionItem transaction={item} />, []
    );

    // ===== Render loading skeleton =====
    if (loading) {
        return (
            <SafeAreaView testID='loading-skeleton' style={{ flex: 1, backgroundColor: colors.white }} edges={['top', 'bottom']}>
                <View style={{ flex: 1 }}>
                    {/* Header skeleton */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, marginTop: 16, paddingHorizontal: 8 }}>
                        <View style={{ width: 180, height: 28, borderRadius: 8, backgroundColor: '#eee' }} />
                        <View style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#eee' }} />
                    </View>
                    <SkeletonPlaceholder borderRadius={16}>
                        <View>
                            {[...Array(8)].map((_, i) => (
                                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, padding: 8 }}>
                                    <View style={{ width: 48, height: 48, borderRadius: 24, marginRight: 14 }} />
                                    <View style={{ flex: 1 }}>
                                        <View style={{ width: '60%', height: 16, borderRadius: 4, marginBottom: 8 }} />
                                        <View style={{ width: '40%', height: 14, borderRadius: 4 }} />
                                    </View>
                                    <View style={{ width: 80, height: 18, borderRadius: 4, marginLeft: 8 }} />
                                </View>
                            ))}
                        </View>
                    </SkeletonPlaceholder>
                </View>
            </SafeAreaView>
        );
    }

    // ===== Render error state =====
    if (error) {
        return (
            <Card style={styles.errorCard}>
                <Text style={styles.errorText}>{error}</Text>
                <Button
                    testID='retry-button'
                    title={t('retry')}
                    onPress={refresh}
                    variant='secondary'
                    style={styles.retryButton}
                />
            </Card>
        );
    }

    // ===== Render transaction history =====
    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }} edges={['top', 'bottom']}>
                <View style={{flex:1}}>
                    {/* Header & date filter */}
                    <View style={styles.headerRow}>
                        <Text style={styles.title}>{t('transaction_history')}</Text>
                        <TouchableOpacity onPress={() => setShowRangePicker(true)} style={{marginLeft: 10}}>
                            <Icon name="calendar-range" size={28} color={colors.icon} />
                        </TouchableOpacity>
                    </View>
                    {/* Conditional Rendering - If no transaction */}
                    {filteredTransactions.length === 0 && !loading && !error && (
                        <View style={{ alignItems: 'center', marginTop: 48 }}>
                            <Text testID='empty-list-message' style={{ color: '#888', fontSize: 16 }}>
                                {t('no_transactions', 'Tidak Ada Transaksi')}
                            </Text>
                        </View>
                    )}
                    {/* Transcation list */}
                    <FlatList
                        testID='transaction-flat-list'
                        data={pagedTransactions}
                        keyExtractor={item => item.id.toString()}
                        renderItem={renderItem}
                        getItemLayout={(_, index) => ({ length: 72, offset: 72 * index, index })}
                        initialNumToRender={15}
                        maxToRenderPerBatch={16}
                        windowSize={10}
                        removeClippedSubviews={true}
                        updateCellsBatchingPeriod={50}
                        contentContainerStyle={{paddingHorizontal: 12, paddingBottom: 80, paddingTop: 0}}
                        onEndReached={handleEndReached}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={
                            loadingMore ? <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 16 }} /> : null
                        }
                    />
                </View>
                {/* Modal for range picker */}
                <DateRangePickerModal
                    visible={showRangePicker}
                    onClose={() => setShowRangePicker(false)}
                    onConfirm={range => {
                        setCustomRange(range);
                        setShowRangePicker(false);
                        setPage(1);
                    }}
                    initialRange={customRange}
                />
            </SafeAreaView>
        </>
    );
};

// ===================== STYLES =====================
const styles = StyleSheet.create({
    scrollContainer: {
        paddingHorizontal: 0,
        paddingTop: 0,
        paddingBottom: 24,
        backgroundColor: colors.white,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        marginTop: 16,
        paddingHorizontal: 8,
    },
    container: {
        paddingHorizontal: 8,
        paddingTop: 0,
        paddingBottom: 0,
        backgroundColor: colors.white,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginTop: 6,
        marginBottom: 8,
        paddingHorizontal: 6,
    },
    loadingCard: {
        margin: 16,
        padding: 24,
        alignItems: 'center',
    },
    errorCard: {
        margin: 16,
        padding: 24,
        alignItems: 'center',
    },
    errorText: {
        color: colors.danger,
        marginBottom: 16,
        textAlign: 'center',
    },
    retryButton: {
        width: '50%',
    },
    loadingWrap: {
        flex: 1,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingCardModern: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 32,
        marginTop: 32,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
        minWidth: 120,
    },
});

export default TransactionHistoryScreen;
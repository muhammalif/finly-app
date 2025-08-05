/**
 * TransactionItem component for displaying a single transaction in a list.
 * Shows icon, description, category, date, and value, with animation and press feedback.
 * @module TransactionItem
 */
import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions } from 'react-native';
import { Transaction } from '@typings/Transaction';
import { expenseCategories, incomeCategories } from 'constants/categories';
import { colors } from '@themes/colors';
import { format } from 'date-fns';
import { formatCurrency } from '@utils/currencyUtils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

/**
 * Props for TransactionItem component.
 * @property transaction - The transaction to display.
 */
interface TransactionItemProps {
    transaction: Transaction;
}

/**
 * Displays a single transaction with icon, description, category, date, and value.
 * @param props - TransactionItemProps
 */
const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
    const { t } = useTranslation();
    console.log('Render TransactionItem', transaction.id);
    const isIncome = transaction.type === 'income';
    const categories = isIncome ? incomeCategories : expenseCategories;
    const categoryObj = categories.find(cat => cat.key === transaction.category);
    const iconName = categoryObj?.icon || (isIncome ? 'arrow-down-circle' : 'arrow-up-circle');

    // Animasi press
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.97,
            useNativeDriver: true,
            speed: 40,
            bounciness: 6,
        }).start();
    };
    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 40,
            bounciness: 6,
        }).start();
    };

    // Animasi masuk
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;
    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View style={{
            opacity: fadeAnim,
            transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
            ],
        }}>
            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={({ pressed }) => [
                    styles.container,
                    { shadowOpacity: pressed ? 0.13 : 0.08 },
                ]}
            >
                <View style={[styles.iconWrapper, { backgroundColor: colors.bgIcon }]}>
                    <Icon name={iconName} size={22} color={colors.icon} />
                </View>
                <View style={styles.details}>
                    <Text style={styles.title} numberOfLines={1}>
                        {transaction.description || t('no_description')}
                    </Text>
                    <Text style={styles.subtitle} numberOfLines={1}>
                        {t(transaction.category)}
                    </Text>
                    <Text style={styles.date} numberOfLines={1}>
                        {format(new Date(transaction.date), 'MMM d, yyyy')}
                    </Text>
                </View>
                <View style={styles.valueBadgeCol}>
                    <Text style={isIncome ? styles.valueIncome : styles.valueExpense}>
                        {isIncome ? '+ ' : '- '}{formatCurrency(transaction.amount)}
                    </Text>
                </View>
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.secondary,
        borderRadius: 16,
        paddingVertical: width < 400 ? 16 : 20,
        paddingHorizontal: width < 400 ? 16 : 20,
        marginVertical: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 20,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)',
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#111',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    details: {
        flex: 1,
        minWidth: 0,
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 2,
        maxWidth: '98%',
        fontFamily: 'Inter, System',
    },
    subtitle: {
        fontSize: 13,
        color: '#888',
        marginRight: 8,
        maxWidth: '70%',
        fontFamily: 'Inter, System',
    },
    date: {
        fontSize: 12,
        color: '#AAA',
        marginTop: 0,
        marginRight: 8,
        fontFamily: 'Inter, System',
    },
    valueIncome: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1BC760',
        textAlign: 'right',
    },
    valueExpense: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#F65454',
        textAlign: 'right',
    },
    valueBadgeCol: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'center',
        minWidth: 60,
    },
    statusBadge: {
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 1,
        marginLeft: 6,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 32,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '600',
        textAlign: 'center',
        fontFamily: 'Inter, System',
    },
});

export default React.memo(TransactionItem);
/**
 * BlanceCard component for displaying the user's current balance with a gradient background.
 * Used on the dashboard to show the main balance and toggle visibility.
 * @module BalanceCard
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { formatCurrency } from '@utils/currencyUtils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';

/**
 * Props for BalanceCard component.
 * @property balance - The current balance value.
 * @property showBalance - Whether to show or mask the balance.
 * @property onToggleShowBalance - Callback to toggle balance visibility.
 */
interface BalanceCardProps {
    balance: number;
    showBalance: boolean;
    onToggleShowBalance: () => void;
}

/**
 * Displays the user's current balance with a toggle for visibility.
 * @param props - BalanceCardProps
 */
const BalanceCard: React.FC<BalanceCardProps> = ({ balance, showBalance, onToggleShowBalance }) => {
    const { t } = useTranslation();
    const formattedBalance = formatCurrency(Math.abs(balance));
    return (
        <LinearGradient
            colors={["#2684FC", "#1403DC"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientCard}
        >
            <View style={styles.row}>
                <View style={styles.balanceLabelRow}>
                    <Icon name="wallet" size={20} color="#fff" style={{opacity:0.85, marginRight: 8}} />
                    <Text style={styles.label}>{t('balance')}</Text>
                </View>
            </View>
            <Text style={styles.balance}>
                {showBalance ? `${formattedBalance}` : '••••••••'}
            </Text>
            {/* Eye Icon absolute top right, touchable */}
            <TouchableOpacity 
                style={styles.eyeIconWrap} 
                onPress={onToggleShowBalance} 
                activeOpacity={0.7}
                accessibilityRole='button'
            >
                <Icon
                    name={showBalance ? 'eye' : 'eye-off'}
                    size={24}
                    color="#fff"
                    style={{opacity:0.85}}
                />
            </TouchableOpacity>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradientCard: {
        borderRadius: 28,
        padding: 24,
        marginBottom: 16,
        backgroundColor: 'rgba(38,132,252,0.85)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.18)',
        shadowColor: '#000',
        shadowOpacity: 0.07,
        shadowRadius: 24,
        elevation: 3,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        color: '#fff',
        fontSize: 16,
        opacity: 0.85,
    },
    percentBadge: {
        backgroundColor: 'rgba(255,255,255,0.18)',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 2,
    },
    percentText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: 'bold',
    },
    balance: {
        color: '#fff',
        fontSize: 36,
        fontWeight: 'bold',
        marginVertical: 12,
    },
    rowIncomeExpense: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    incomeExpenseItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    incomeLabel: {
        color: '#fff',
        fontSize: 13,
        marginRight: 4,
    },
    incomeValue: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginRight: 16,
    },
    expenseLabel: {
        color: '#fff',
        fontSize: 13,
        marginRight: 4,
    },
    expenseValue: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    walletIconWrap: {
        backgroundColor: 'rgba(255,255,255,0.13)',
        borderRadius: 16,
        padding: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    balanceLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    walletIconAbsolute: {
        display: 'none',
    },
    eyeIconWrap: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: 'rgba(255,255,255,0.13)',
        borderRadius: 18,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default BalanceCard;

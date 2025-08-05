/**
 * BottomTabs sets up the bottom tab navigator for the main app screens.
 * Handles tab icons, labels, and navigation between Dashboard, Statistics, Add Transaction, History, and Settings.
 * @module BottomTabs
 */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, StyleSheet, Platform, Text } from 'react-native';
import DashboardScreen from '@screens/DashboardScreen';
import AddTransactionScreen from '@screens/AddTransactionScreen';
import SettingsScreen from '@screens/SettingsScreen';
import TransactionHistoryScreen from '@screens/TransactionHistoryScreen';
import StatisticsScreen from '@screens/StatisticsScreen';
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator();

/**
 * Main bottom tab navigator component for the app.
 * Handles tab icons, labels, and navigation.
 */
const BottomTabs = () => {
    const { t } = useTranslation();
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    height: 70,
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    position: 'absolute',
                    backgroundColor: '#FFF',
                    borderTopWidth: 1,
                    borderTopColor: '#F0F1F3',
                    shadowColor: 'transparent',
                    elevation: 0,
                    paddingBottom: 10,
                    paddingTop: 8,
                },
                tabBarIcon: ({ focused }) => {
                    let icon = null;
                    let label = '';
                    if (route.name === 'AddTransaction') {
                        return (
                            <View style={styles.fabContainer}>
                                <MaterialCommunityIcons name="plus-circle" size={64} color="#2684FC" />
                            </View>
                        );
                    }
                    if (route.name === 'Dashboard') {
                        icon = focused
                            ? <MaterialCommunityIcons name="home" size={28} color="#2684FC" />
                            : <MaterialCommunityIcons name="home-outline" size={28} color="#C7C9D9" />;
                        label = t('dashboard');
                    }
                    if (route.name === 'Statistics') {
                        icon = <MaterialCommunityIcons name="chart-bar" size={28} color={focused ? "#2684FC" : "#C7C9D9"} />;
                        label = t('statistics');
                    }
                    if (route.name === 'TransactionHistory') {
                        icon = <MaterialCommunityIcons name="format-list-bulleted" size={28} color={focused ? "#2684FC" : "#C7C9D9"} />;
                        label = t('history');
                    }
                    if (route.name === 'Settings') {
                        icon = focused
                            ? <MaterialCommunityIcons name="cog" size={28} color="#2684FC" />
                            : <MaterialCommunityIcons name="cog-outline" size={28} color="#C7C9D9" />;
                        label = t('settings');
                    }
                    return (
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            {icon}
                            <View style={{ height: 4 }} />
                            <Text style={{ fontSize: 12, color: focused ? '#2684FC' : '#C7C9D9', fontWeight: focused ? 'bold' : 'normal' }}>{label}</Text>
                        </View>
                    );
                },
            })}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="Statistics" component={StatisticsScreen} />
            <Tab.Screen name="AddTransaction" component={AddTransactionScreen} />
            <Tab.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    fabContainer: {
        width: 68,
        height: 68,
        borderRadius: 34,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Platform.OS === 'android' ? 30 : 20,
    },
});

export default BottomTabs; 
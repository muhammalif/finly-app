// ===================== IMPORTS =====================
import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import PinInput from '@components/auth/PinInput';
import { useAuth } from '@hooks/useAuth';
import Card from '@components/common/Card';
import { colors } from '@themes/colors';
import { useAppContext } from '@store/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { useTranslation } from 'react-i18next';

// ===================== MAIN COMPONENT =====================
const AuthScreen = () => {
    // ===== State =====
    /** The PIN currently being entered by the user */
    const [pin, setPin] = useState('');
    // ===== Hooks =====
    const { login, loading, error, clearError } = useAuth();
    const { dispatch } = useAppContext();
    const { t } = useTranslation();

    // ===== Handler: Submit PIN =====
    /**
     * Handler for submitting the PIN
     * @param enteredPin The PIN entered by the user
     */
    const handlePinSubmit = async (enteredPin: string) => {
        const success = await login(enteredPin);
        if (success) {
            dispatch({ type: 'LOGIN' });
        } else {
            setPin('');
        }
    };

    // ===== Render =====
    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="#F6F9FF" />
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.container}>
                    {/* Logo */}
                    <Image 
                        source={require('@assets/logo.png')} 
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    {/* PIN Input Card */}
                    <Card style={styles.pinCard}>
                        <Text style={styles.pinLabel}>{t('enter_pin', 'Masukkan PIN')}</Text>
                        <PinInput
                            testID="pin-input-container"
                            pin={pin}
                            onPinChange={(newPin) => {
                                setPin(newPin);
                                clearError();
                            }}
                            onPinComplete={handlePinSubmit}
                            disabled={loading}
                        />
                        {loading && <ActivityIndicator style={styles.loading} color={colors.primary} />}
                        {error && <Text style={styles.errorText}>{error}</Text>}
                    </Card>
                </View>
            </SafeAreaView>
        </>
    );
};

// ===================== STYLES =====================
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F6F9FF',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    logo: {
        width: 160,
        height: 160,
        marginBottom: 24,
        alignSelf: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 6,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 0,
    },
    pinCard: {
        padding: 32,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    pinLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 24,
        textAlign: 'center',
    },
    loading: {
        marginTop: 16,
    },
    errorText: {
        color: colors.danger,
        marginTop: 16,
        textAlign: 'center',
        fontSize: 14,
    },
});

export default AuthScreen;

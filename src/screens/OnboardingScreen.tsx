// ===================== IMPORTS =====================
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@themes/colors';
import { useTranslation } from 'react-i18next';

// ===================== MAIN COMPONENT =====================
/**
 * Props for OnboardingScreen
 * onDone: callback when onboarding is completed
 */
const OnboardingScreen = ({ onDone }: { onDone: () => void }) => {
  const { t } = useTranslation();
  // ===== State =====
  const [username, setUsername] = useState('');
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Handler for submitting onboarding form.
   * Validates input and saves onboarding data.
   */
  const handleSubmit = async () => {
    if (!username.trim()) {
      setError(t('onboarding_error_name'));
      return;
    }
    if (!balance.trim() || isNaN(Number(balance))) {
      setError(t('onboarding_error_balance'));
      return;
    }
    setLoading(true);
    try {
      await AsyncStorage.setItem('onboardingDone', 'true');
      await AsyncStorage.setItem('username', username.trim());
      await AsyncStorage.setItem('initialBalance', balance.trim());
      onDone();
    } catch (e) {
      setError(t('onboarding_error_save'));
    } finally {
      setLoading(false);
    }
  };

  // ===== Render onboarding form =====
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        {/* Logo */}
        <Image 
          source={require('@assets/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>{t('onboarding_title')}</Text>
        <Text style={styles.subtitle}>{t('onboarding_subtitle')}</Text>
        <View style={styles.inputBox}>
          <Text style={styles.label}>{t('onboarding_label_name')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('onboarding_placeholder_name')}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="words"
            returnKeyType="next"
          />
        </View>
        <View style={styles.inputBox}>
          <Text style={styles.label}>{t('onboarding_label_balance')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('onboarding_placeholder_balance')}
            value={balance}
            onChangeText={setBalance}
            keyboardType="numeric"
            returnKeyType="done"
          />
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? t('onboarding_button_loading') : t('onboarding_button') }</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// ===================== STYLES =====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 28,
    backgroundColor: colors.background,
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
  },
  inputBox: {
    width: '100%',
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 40,
    marginTop: 18,
    width: '100%',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: colors.danger,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default OnboardingScreen; 
// ===================== IMPORTS =====================
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@typings/navigation';
import { useAuth } from '@hooks/useAuth';
import PinInput, { PinInputRef } from '@components/auth/PinInput';
import { colors } from '@themes/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

// ===================== MAIN COMPONENT =====================
/**
 * Screen for confirming the new PIN during the change PIN flow.
 */
const ChangePinConfirmScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { oldPin, newPin } = route.params as { oldPin: string, newPin: string };
  const { changePin, loading, error } = useAuth();
  const [confirmPin, setConfirmPin] = useState('');
  const pinRef = useRef<PinInputRef>(null);
  const { t } = useTranslation();

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: t('change_pin') });
  }, [navigation, t]);

  /**
   * Handler for completing confirm PIN input.
   * Checks if the confirmation matches the new PIN, then updates the PIN.
   */
  const handleComplete = async (pin: string) => {
    if (pin.length === 4) {
      if (pin !== newPin) {
        Alert.alert(t('error'), t('pin_not_match'));
        setConfirmPin('');
        pinRef.current?.focus();
        return;
      }
      const success = await changePin(newPin, oldPin);
      if (success) {
        Alert.alert(t('success'), t('pin_changed_success'));
        navigation.navigate('Settings');
      }
    }
  };

  // ===== Render confirm PIN input screen =====
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('confirm_new_pin')}</Text>
        <Text style={styles.label}>{t('repeat_new_pin')}</Text>
        <PinInput
          ref={pinRef}
          pin={confirmPin}
          onPinChange={setConfirmPin}
          onPinComplete={handleComplete}
          disabled={loading}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </SafeAreaView>
  );
};

// ===================== STYLES =====================
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 24, 
    backgroundColor: colors.background 
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: colors.primary, 
    marginBottom: 28, 
    textAlign: 'center' 
  },
  label: { 
    fontSize: 15, 
    color: colors.textSecondary, 
    marginBottom: 8, 
    marginTop: 18, 
    fontWeight: '600', 
    textAlign: 'center', 
  },
  errorText: { 
    color: colors.danger, 
    textAlign: 'center', 
    marginTop: 18, 
    fontSize: 13, 
    opacity: 0.85, 
    fontWeight: '500' 
  },
});

export default ChangePinConfirmScreen; 
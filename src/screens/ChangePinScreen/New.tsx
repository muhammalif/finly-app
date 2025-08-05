// ===================== IMPORTS =====================
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@typings/navigation';
import PinInput, { PinInputRef } from '@components/auth/PinInput';
import { colors } from '@themes/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

// ===================== MAIN COMPONENT =====================
/**
 * Screen for entering a new PIN during the change PIN flow.
 */
const ChangePinNewScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { oldPin } = route.params as { oldPin: string };
  const [newPin, setNewPin] = useState('');
  const pinRef = useRef<PinInputRef>(null);
  const { t } = useTranslation();

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: t('change_pin') });
  }, [navigation, t]);

  /**
   * Handler for completing new PIN input.
   * Navigates to the confirmation screen.
   */
  const handleComplete = (pin: string) => {
    if (pin.length === 4) {
      navigation.navigate('ChangePinConfirm', { oldPin, newPin: pin });
    }
  };

  // ===== Render new PIN input screen =====
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('new_pin')}</Text>
        <Text style={styles.label}>{t('enter_new_pin')}</Text>
        <PinInput
          ref={pinRef}
          pin={newPin}
          onPinChange={setNewPin}
          onPinComplete={handleComplete}
        />
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
    textAlign: 'center' 
  },
});

export default ChangePinNewScreen; 
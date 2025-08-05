// ===================== IMPORTS =====================
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@typings/navigation';
import PinInput, { PinInputRef } from '@components/auth/PinInput';
import { colors } from '@themes/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

// ===================== MAIN COMPONENT =====================
/**
 * Screen for entering the old PIN during the change PIN flow.
 */
const ChangePinOldScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [oldPin, setOldPin] = useState('');
  const pinRef = useRef<PinInputRef>(null);
  const { t } = useTranslation();

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: t('change_pin') });
  }, [navigation, t]);

  /**
   * Handler for completing old PIN input.
   * Navigates to the new PIN input screen.
   */
  const handleComplete = (pin: string) => {
    if (pin.length === 4) {
      navigation.navigate('ChangePinNew', { oldPin: pin });
    }
  };

  // ===== Render old PIN input screen =====
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('change_pin')}</Text>
        <Text style={styles.label}>{t('old_pin')}</Text>
        <PinInput
          ref={pinRef}
          pin={oldPin}
          onPinChange={setOldPin}
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

export default ChangePinOldScreen; 
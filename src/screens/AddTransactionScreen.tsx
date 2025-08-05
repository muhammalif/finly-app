// ===================== IMPORTS =====================
import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@typings/navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '@components/common/Button';
import OCRScanButton from '@components/common/OCRScanButton';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { expenseCategories, incomeCategories } from 'constants/categories';
import { colors } from '@themes/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTransactions } from '@hooks/useTransactions';
import { StatusBar } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useOCR } from '@hooks/useOCR';

// ===================== MAIN COMPONENT =====================
/**
 * Props for AddTransactionScreen
 * navigation: navigation prop for navigating between screens
 */
type AddTransactionScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddTransaction'>;
};

/**
 * Main component for adding a new transaction.
 * Provides form input, category selection, description, and submit button.
 */
const AddTransactionScreen = ({ navigation }: AddTransactionScreenProps) => {
  const { t } = useTranslation();
  // ===== Form state =====
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  // Get addTransaction function and loading/error state from custom hook
  const { addTransaction, loading, error } = useTransactions();
  // Get OCR functionality from custom hook
  const { scanImage, isScanning } = useOCR();

  // Category options based on transaction type
  const categoriesToShow = type === 'expense' ? expenseCategories : incomeCategories;

  /**
   * Handler for submitting the transaction form.
   * Validates input, then saves the transaction to the database.
   */
  const handleSubmit = async () => {
    if (!amount || isNaN(parseFloat(amount))) {
      Alert.alert(t('error'), t('please_enter_valid_amount'));
      return;
    }
    if (!category) {
      Alert.alert(t('error'), t('please_select_category'));
      return;
    }
    try {
      await addTransaction({
        amount: parseFloat(amount),
        description,
        category,
        type,
      });
      setAmount('');
      setDescription('');
      setCategory('');
      setType('expense');
      navigation.goBack();
    } catch (err) {
      Alert.alert(t('error'), error || t('fail_save_transaction'));
    }
  };

  /**
   * Handler for scanning a receipt image and performing OCR.
   * Requests gallery permission, then reads text from the image.
   */
  const handleScanImage = async () => {
    scanImage(
      (result) => {
        // Set description
        setDescription(result.text);
        
        // Set amount if found
        if (result.amount) {
          setAmount(result.amount);
          Alert.alert(
            t('ocr_success'), 
            `${t('ocr_success_message')}\nNominal: Rp ${result.amount}`
          );
        } else {
          Alert.alert(t('ocr_success'), t('ocr_success_message'));
        }
      }
    );
  };

  // ===== Render loading skeleton =====
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
        <SkeletonPlaceholder borderRadius={16}>
          <View style={{ padding: 18 }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
              <View style={{ width: 36, height: 36, borderRadius: 8 }} />
              <View style={{ flex: 1 }} />
              <View style={{ width: 36, height: 36, borderRadius: 8 }} />
            </View>
            {/* Toggle Income/Expense */}
            <View style={{ flexDirection: 'row', marginBottom: 18 }}>
              <View style={{ flex: 1, height: 36, borderRadius: 12, marginRight: 8 }} />
              <View style={{ flex: 1, height: 36, borderRadius: 12 }} />
            </View>
            {/* Amount Input */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
              <View style={{ width: 36, height: 36, borderRadius: 8, marginRight: 8 }} />
              <View style={{ flex: 1, height: 36, borderRadius: 8 }} />
            </View>
            {/* Category Grid */}
            <View style={{ width: 100, height: 18, borderRadius: 4, marginBottom: 8 }} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 18 }}>
              {[...Array(8)].map((_, i) => (
                <View key={i} style={{ width: '22%', height: 60, borderRadius: 12, margin: 6 }} />
              ))}
            </View>
            {/* Description Input */}
            <View style={{ width: 100, height: 18, borderRadius: 4, marginBottom: 8 }} />
            <View style={{ height: 60, borderRadius: 8, marginBottom: 18 }} />
            {/* Add Button */}
            <View style={{ height: 48, borderRadius: 12, marginBottom: 12 }} />
          </View>
        </SkeletonPlaceholder>
      </SafeAreaView>
    );
  }

  // ===== Render main form =====
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
        <View style={styles.root}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
              <Icon name="arrow-left" size={24} color={colors.icon} />
            </TouchableOpacity>
            <View style={styles.headerTitleWrapper}>
              <Text style={styles.headerTitle}>{t('add_transaction')}</Text>
            </View>
            <OCRScanButton
              onPress={handleScanImage}
              disabled={isScanning}
              style={styles.headerScanIcon}
            />
          </View>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Toggle Income/Expense */}
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleBtn, type === 'expense' ? styles.toggleActive : styles.toggleInactive]}
                onPress={() => setType('expense')}
              >
                <Text style={[styles.toggleText, type === 'expense' && styles.toggleTextActive]}>{t('expense')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, type === 'income' ? styles.toggleActive : styles.toggleInactive]}
                onPress={() => setType('income')}
              >
                <Text style={[styles.toggleText, type === 'income' && styles.toggleTextActive]}>{t('income')}</Text>
              </TouchableOpacity>
            </View>
            {/* Amount Input */}
            <View style={styles.amountBox}>
              <Text style={[styles.amountPrefix, { color: '#111' }]}>Rp</Text>
              <TextInput
                testID='amount-input'
                style={styles.amountInput}
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>
            {/* Category Grid */}
            <Text style={styles.sectionLabel}>{t('category')}</Text>
            <View style={styles.categoryGrid}>
              {categoriesToShow.slice(0, 8).map((cat) => (
                <TouchableOpacity
                  testID={`category-button-${cat.key}`}
                  key={cat.key}
                  style={[styles.categoryItem, category === cat.key && styles.categoryActive]}
                  onPress={() => setCategory(cat.key)}
                >
                  <View style={{ backgroundColor: colors.bgIcon, borderRadius: 16, padding: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                    <Icon name={cat.icon} size={26} color={colors.icon} />
                  </View>
                  <Text style={[styles.categoryLabel, category === cat.key && styles.categoryLabelActive]}>{t(cat.key)}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Description Input */}
            <Text style={styles.sectionLabel}>{t('description')}</Text>
            <TextInput
              testID='description-input'
              style={styles.descInput}
              placeholder={t('description_placeholder')}
              placeholderTextColor={colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
            />
            {/* Add Transaction Button */}
            <Button
              testID='submit-button'
              title={loading ? t('loading') : t('add_transaction')}
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              style={styles.addBtn}
            />
            {/* Error rendering */}
            {error && <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>}
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

// ===================== STYLES =====================
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 18,
    paddingTop: 32,
    paddingBottom: 18,
    backgroundColor: colors.background,
    position: 'relative',
  },
  headerIcon: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.bgIcon,
  },
  headerTitleWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerScanIcon: {
    position: 'absolute',
    right: 18,
    top: 32,
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.bgIcon,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 20,
    paddingBottom: 80,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: colors.primary,
  },
  toggleInactive: {
    backgroundColor: colors.secondary,
  },
  toggleText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleTextActive: {
    color: colors.white,
  },
  amountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
  },
  amountPrefix: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: 'bold',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: 'bold',
  },
  sectionLabel: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 8,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  categoryItem: {
    width: '22%',
    aspectRatio: 1,
    backgroundColor: colors.secondary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    padding: 8,
  },
  categoryActive: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.secondary,
  },
  categoryLabel: {
    color: colors.textPrimary,
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },
  categoryLabelActive: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  descInput: {
    backgroundColor: colors.secondary,
    color: colors.textPrimary,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    minHeight: 60,
    marginBottom: 18,
  },
  scanBtn: {
    marginBottom: 12,
    backgroundColor: colors.gray,
  },
  addBtn: {
    marginBottom: 24,
  },
  errorBox: {
    marginTop: 16,
    backgroundColor: colors.danger + '22',
    borderRadius: 8,
    padding: 10,
  },
  errorText: {
    color: colors.danger,
    textAlign: 'center',
  },
});

export default AddTransactionScreen;
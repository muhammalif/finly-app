// ===================== IMPORTS =====================
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, ScrollView, TextInput, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '@themes/colors';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '@typings/navigation';
import { exportData } from '@lib/backup/backupUtils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import PrivacyPolicy from '@components/settings/PrivacyPolicy';
import TermsOfUse from '@components/settings/TermsOfUse';
import Profile from '@settings/Profile';
import Currency from '@settings/Currency';
import Language from '@settings/Language';
import ExportData from '@settings/ExportData';
import Support from '@settings/Support';
import CheckVersion from '@components/settings/CheckVersion';
import { deleteAllTransactions } from '@lib/database/transactionQueries';
import { resetUserPin } from '@lib/database/userQueries';

// ===================== CONSTANTS =====================
const LANGUAGES = [
  { key: 'id', label: 'Indonesia', icon: 'flag' },
  { key: 'en', label: 'English', icon: 'flag-outline' },
];

// ===================== MAIN COMPONENT =====================
const SettingsScreen = () => {
  // ========== Navigation & Translation ==========
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { t, i18n } = useTranslation();

  // ========== State: Modal Visibility ==========
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showChangeUsername, setShowChangeUsername] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // ========== State: Form ==========
  const [newUsername, setNewUsername] = useState('');
  const [loadingSettings] = useState(false);

  // ========== Handler: Export Data ==========
  /**
   * Handler for export data to Excel
   */
  const handleExport = async () => {
    setShowExportModal(false);
    try {
      await exportData();
      Alert.alert(t('success'), t('success_export'));
    } catch (e) {
      Alert.alert(t('error'), t('fail_export'));
    }
  };

  // ========== Handler: Delete Data ==========
  /**
   * Handler for deleting all data
   */
  const handleDeleteData = () => {
    Alert.alert(
      t('delete_data'),
      t('are_you_sure_delete'),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('delete_data'), style: 'destructive', onPress: async () => {
            try {
              await deleteAllTransactions();
              await AsyncStorage.removeItem('initialBalance');
              await resetUserPin();
              await AsyncStorage.setItem('onboardingDone', 'false')
              setShowProfileModal(false);
              Alert.alert(t('success'), t('all_data_deleted', 'Semua data berhasil dihapus'));
            } catch (e) {
              Alert.alert(t('error'), t('fail_delete_data', 'Gagal menghapus data'));
            }
          }
        },
      ]
    );
  };

  // ========== Handler: Save Username ==========
  /**
   * Handler for set new username
   */
  const handleSaveUsername = async () => {
    if (!newUsername.trim()) {
      Alert.alert(t('error'), t('please_enter_valid_name', 'Masukkan nama yang valid'));
      return;
    }
    try {
      await AsyncStorage.setItem('username', newUsername.trim());
      setShowChangeUsername(false);
      setShowProfileModal(false);
      Alert.alert(t('success'), t('username_updated', 'Nama berhasil diubah'));
    } catch (e) {
      Alert.alert(t('error'), t('fail_save_username', 'Gagal menyimpan nama'));
    }
  };

  // ========== Loading Skeleton ==========
  if (loadingSettings) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
        <SkeletonPlaceholder borderRadius={16}>
          <View style={{ padding: 18 }}>
            {/* Header */}
            <View style={{ width: 180, height: 28, borderRadius: 8, marginBottom: 24 }} />
            {/* List skeleton */}
            {[...Array(6)].map((_, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18, paddingHorizontal: 8 }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, marginRight: 16 }} />
                <View style={{ flex: 1, height: 20, borderRadius: 6 }} />
                <View style={{ width: 24, height: 20, borderRadius: 6, marginLeft: 12 }} />
              </View>
            ))}
          </View>
        </SkeletonPlaceholder>
      </SafeAreaView>
    );
  }

  // ========== Render ==========
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
        <View style={styles.container}>
          <Text style={styles.header}>{t('settings')}</Text>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.list}>
              {/* List Item: Profile */}
              <Profile t={t} onShowProfileModal={() => setShowProfileModal(true)} />
              {/* List Item: Currency */}
              <Currency />
              {/* List Item: Language */}
              <Language t={t} i18n={i18n} onShowLangModal={() => setShowLangModal(true)} />
              {/* List Item: Export Data */}
              <ExportData t={t} onShowExportModal={() => setShowExportModal(true)} />
              {/* List Item: Privacy Policy */}
              <TouchableOpacity style={styles.item} onPress={() => setShowPrivacyModal(true)}>
                <View style={styles.iconCircle}>
                  <Icon name="shield-lock" size={22} color={colors.icon} />
                </View>
                <Text style={styles.label}>{t('privacy_policy')}</Text>
                <Icon name="chevron-right" size={22} color={colors.icon} style={styles.chevron} />
              </TouchableOpacity>
              {/* List Item: Terms of Use */}
              <TouchableOpacity style={styles.item} onPress={() => setShowTermsModal(true)}>
                <View style={styles.iconCircle}>
                  <Icon name="file-document" size={22} color={colors.icon} />
                </View>
                <Text style={styles.label}>{t('terms_of_use')}</Text>
                <Icon name="chevron-right" size={22} color={colors.icon} style={styles.chevron} />
              </TouchableOpacity>
              {/* List Item: Support */}
              <Support t={t} onShowSupportModal={() => setShowSupportModal(true)} />
              {/* List Item: Check Update */}
              <CheckVersion t={t} />
            </View>
          </ScrollView>
        </View>
        {/* ========== Modal Section ========== */}
        {/* Profile Modal */}
        <Modal
          visible={showProfileModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowProfileModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <Text style={styles.modalTitle}>{t('profile')}</Text>
              <TouchableOpacity style={styles.modalOption} onPress={() => { setShowChangeUsername(true); }}>
                <Icon name="account-edit" size={22} color={colors.icon} style={{ marginRight: 12 }} />
                <Text style={styles.modalOptionLabel}>{t('change_username')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalOption} onPress={() => { setShowProfileModal(false); navigation.navigate('ChangePinOld'); }}>
                <Icon name="form-textbox-password" size={22} color={colors.icon} style={{ marginRight: 12 }} />
                <Text style={styles.modalOptionLabel}>{t('change_pin')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalOption} onPress={() => { setShowProfileModal(false); handleDeleteData(); }}>
                <Icon name="trash-can" size={22} color={colors.danger} style={{ marginRight: 12 }} />
                <Text style={[styles.modalOptionLabel, { color: colors.danger }]}>{t('delete_data')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShowProfileModal(false)}>
                <Text style={styles.modalCancelText}>{t('cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Modal change username */}
        <Modal
          visible={showChangeUsername}
          transparent
          animationType="slide"
          onRequestClose={() => setShowChangeUsername(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <Text style={styles.modalTitle}>{t('change_username')}</Text>
              <View style={{ marginBottom: 18 }}>
                <Text style={{ marginBottom: 6, color: '#222', fontWeight: '500' }}>{t('new_username')}</Text>
                <View style={{ backgroundColor: colors.secondary, borderRadius: 10, paddingHorizontal: 12 }}>
                  <TextInput
                    value={newUsername}
                    onChangeText={setNewUsername}
                    placeholder={t('enter_new_username')}
                    style={{ fontSize: 16, color: '#222', paddingVertical: 10 }}
                  />
                </View>
              </View>
              <TouchableOpacity style={[styles.modalOption, { justifyContent: 'center' }]} onPress={handleSaveUsername}>
                <Text style={[styles.modalOptionLabel, { color: colors.primary, textAlign: 'center' }]}>{t('save')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShowChangeUsername(false)}>
                <Text style={styles.modalCancelText}>{t('cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Language Modal */}
        <Modal
          visible={showLangModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowLangModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <Text style={styles.modalTitle}>{t('language')}</Text>
              {LANGUAGES.map(l => (
                <TouchableOpacity
                  key={l.key}
                  style={styles.modalOption}
                  onPress={() => { i18n.changeLanguage(l.key); setShowLangModal(false); }}
                >
                  <Icon name={l.icon} size={22} color={colors.icon} style={{ marginRight: 12 }} />
                  <Text style={styles.modalOptionLabel}>{l.label}</Text>
                  {i18n.language === l.key && <Icon name="check" size={20} color={colors.primary} style={{ marginLeft: 'auto' }} />}
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShowLangModal(false)}>
                <Text style={styles.modalCancelText}>{t('cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Export Modal */}
        <Modal
          visible={showExportModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowExportModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <Text style={styles.modalTitle}>{t('export_data')}</Text>
              <TouchableOpacity style={styles.modalOption} onPress={handleExport}>
                <Icon name="file-excel" size={22} color={colors.success} style={{ marginRight: 12 }} />
                <Text style={styles.modalOptionLabel}>{t('excel_export')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShowExportModal(false)}>
                <Text style={styles.modalCancelText}>{t('cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Privacy Policy Modal */}
        <Modal
          visible={showPrivacyModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPrivacyModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalSheet, { maxHeight: '80%' }]}> 
              <ScrollView showsVerticalScrollIndicator={false}>
                <PrivacyPolicy />
              </ScrollView>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShowPrivacyModal(false)}>
                <Text style={styles.modalCancelText}>{t('cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Terms of Use Modal */}
        <Modal
          visible={showTermsModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowTermsModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalSheet, { maxHeight: '80%' }]}> 
              <ScrollView showsVerticalScrollIndicator={false}>
                <TermsOfUse />
              </ScrollView>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShowTermsModal(false)}>
                <Text style={styles.modalCancelText}>{t('cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Support Modal */}
        <Modal
          visible={showSupportModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowSupportModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalSheet, { maxHeight: '80%' }]}> 
              <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginBottom:18}}>
                <Icon name="send" size={22} color={colors.primary} style={{marginRight:8}} />
                <Text style={{fontSize:18,fontWeight:'bold',textAlign:'center',color:'#222'}}>{t('support')}</Text>
              </View>
              <Text style={{fontSize:15,color:'#222',marginBottom:12,textAlign:'center'}}>Jika Anda mengalami kendala, silakan hubungi kami melalui email atau Telegram berikut:</Text>
              <TouchableOpacity style={{flexDirection:'row',alignItems:'center',marginBottom:12,backgroundColor:colors.secondary,borderRadius:10,padding:12}} onPress={() => Linking.openURL('mailto:filagrowth.1006@gmail.com?subject=FinlyApp Support').catch(() => Alert.alert('Error', 'Cannot open Email.'))}>
                <Icon name="email" size={22} color={colors.primary} style={{marginRight:12}} />
                <Text style={{fontSize:16,color:colors.primary,fontWeight:'500'}}>filagrowth.1006@gmail.com</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{flexDirection:'row',alignItems:'center',marginBottom:18,backgroundColor:colors.secondary,borderRadius:10,padding:12}} onPress={() => Linking.openURL('https://t.me/sedangtunduh').catch(() => Alert.alert('Error', 'Cannot open Telegram.'))}>
                <Icon name="send" size={22} color={colors.primary} style={{marginRight:12}} />
                <Text style={{fontSize:16,color:colors.primary,fontWeight:'500'}}>@sedangtunduh</Text>
              </TouchableOpacity>
              <Text style={{fontSize:15,color:'#222',marginBottom:8,fontWeight:'bold'}}>FAQ:</Text>
              <Text style={{fontSize:15,color:'#222',marginBottom:4}}>- Bagaimana cara mengganti PIN?</Text>
              <Text style={{fontSize:15,color:'#222',marginBottom:4}}>- Bagaimana cara ekspor data ke Excel?</Text>
              <Text style={{fontSize:15,color:'#222',marginBottom:12}}>- Bagaimana jika data saya hilang?</Text>
              <TouchableOpacity style={{marginTop:10,alignItems:'center',paddingVertical:10}} onPress={() => setShowSupportModal(false)}>
                <Text style={{color:colors.primary,fontSize:16,fontWeight:'bold'}}>Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.white, 
    paddingTop: 18 
  },
  header: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginTop: 2,
    marginBottom: 24, 
    color: '#222' 
  },
  scrollContent: { 
    paddingBottom: 64 
  },
  list: { 
    paddingHorizontal: 12 
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  iconCircle: {
    width: 36, 
    height: 36, 
    borderRadius: 18,
    backgroundColor: colors.bgIcon, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 16,
  },
  label: { 
    flex: 1, 
    fontSize: 16, 
    color: '#222', 
    fontWeight: '500' 
  },
  value: { 
    fontSize: 15, 
    color: '#888', 
    marginRight: 8, 
    fontWeight: '500' 
  },
  chevron: { 
    marginLeft: 8 
  },
  dangerItem: { 
    backgroundColor: '#fff0f0' 
  },
  dangerIconCircle: { 
    backgroundColor: '#ffeaea' 
  },
  dangerLabel: { 
    color: '#F65454' 
  },
  disabledItem: { 
    opacity: 0.6 
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 24,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 18,
    color: '#222',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  modalOptionLabel: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
  modalCancel: {
    marginTop: 10,
    alignItems: 'center',
    paddingVertical: 10,
  },
  modalCancelText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;

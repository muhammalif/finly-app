/**
 * PrivacyPolicyContent component for displaying the app's privacy policy in multiple languages.
 * Used as modal content in the settings screen.
 * @module PrivacyPolicy
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

/**
 * Displays the privacy policy content in the user's selected language.
 */
const PrivacyPolicy = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const content: Record<string, { title: string; paragraphs: string[] }> = {
    en: {
      title: 'Privacy Policy',
      paragraphs: [
        'Your privacy is important to us. FinlyApp does not collect, store, or share your personal financial data with any third party.',
        'All data you input into the app, including transactions, balance, and personal information, is stored locally on your device and is not transmitted to any external server.',
        'We do not use your data for advertising or analytics purposes.',
        'You are in full control of your data, and you can delete it at any time from within the app.',
        'If you have any questions or concerns about your privacy, please contact us at filagrowth.1006@gmail.com.'
      ]
    },
    id: {
      title: 'Kebijakan Privasi',
      paragraphs: [
        'Privasi Anda sangat penting bagi kami. FinlyApp tidak mengumpulkan, menyimpan, atau membagikan data keuangan pribadi Anda kepada pihak ketiga mana pun.',
        'Semua data yang Anda masukkan ke dalam aplikasi, termasuk transaksi, saldo, dan informasi pribadi, disimpan secara lokal di perangkat Anda dan tidak dikirimkan ke server eksternal mana pun.',
        'Kami tidak menggunakan data Anda untuk tujuan iklan atau analitik.',
        'Anda memiliki kendali penuh atas data Anda, dan dapat menghapusnya kapan saja melalui aplikasi.',
        'Jika Anda memiliki pertanyaan atau kekhawatiran tentang privasi Anda, silakan hubungi kami di filagrowth.1006@gmail.com.'
      ]
    }
  };
  const c = content[lang] || content.en;

  return (
    <View>
      <Text style={styles.title}>{c.title}</Text>
      {c.paragraphs.map((p: string, i: number) => (
        <View key={i} style={styles.bulletRow}>
          <Text style={styles.bullet}>{'\u2022'}</Text>
          <Text style={styles.text}>{p}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
    textAlign: 'center',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingRight: 8,
  },
  bullet: {
    fontSize: 18,
    marginRight: 8,
    color: '#222',
    lineHeight: 22,
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    lineHeight: 22,
  },
});

export default PrivacyPolicy; 
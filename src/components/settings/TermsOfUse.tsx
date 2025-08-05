/**
 * TermsOfUseContent component for displaying the app's terms of use in multiple languages.
 * Used as modal content in the settings screen.
 * @module TermsOfUse
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

/**
 * Displays the terms of use content in the user's selected language.
 */
const TermsOfUse = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const content: Record<string, { title: string; intro: string; bullets: string[]; outro: string }> = {
    en: {
      title: 'Terms of Use',
      intro: 'By using FinlyApp, you agree to the following terms:',
      bullets: [
        'FinlyApp is provided as-is, without any warranties.',
        'You are responsible for the accuracy of the data you enter.',
        'FinlyApp is not responsible for any loss or damage resulting from the use of this app.',
        'You may not use this app for any illegal activities.'
      ],
      outro: 'We reserve the right to update these terms at any time. Continued use of the app constitutes acceptance of the new terms. If you have any questions, please contact us at filagrowth.1006@gmail.com.'
    },
    id: {
      title: 'Syarat Penggunaan',
      intro: 'Dengan menggunakan FinlyApp, Anda setuju dengan syarat berikut:',
      bullets: [
        'FinlyApp disediakan sebagaimana adanya, tanpa jaminan apa pun.',
        'Anda bertanggung jawab atas keakuratan data yang Anda masukkan.',
        'FinlyApp tidak bertanggung jawab atas kerugian atau kerusakan yang timbul akibat penggunaan aplikasi ini.',
        'Anda tidak boleh menggunakan aplikasi ini untuk aktivitas ilegal apa pun.'
      ],
      outro: 'Kami berhak memperbarui syarat ini kapan saja. Penggunaan aplikasi secara berkelanjutan dianggap sebagai persetujuan terhadap syarat yang baru. Jika Anda memiliki pertanyaan, silakan hubungi kami di filagrowth.1006@gmail.com.'
    }
  };
  const c = content[lang] || content.en;

  return (
    <View>
      <Text style={styles.title}>{c.title}</Text>
      <Text style={styles.intro}>{c.intro}</Text>
      {c.bullets.map((b: string, i: number) => (
        <View key={i} style={styles.bulletRow}>
          <Text style={styles.bullet}>{'\u2022'}</Text>
          <Text style={styles.text}>{b}</Text>
        </View>
      ))}
      <Text style={styles.outro}>{c.outro}</Text>
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
  intro: {
    fontSize: 16,
    color: '#222',
    marginBottom: 10,
    textAlign: 'left',
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
  outro: {
    fontSize: 15,
    color: '#222',
    marginTop: 14,
    textAlign: 'left',
  },
});

export default TermsOfUse; 
/**
 * i18n configuration and initialization for app localization.
 * Sets up language resources, detection, and react-i18next integration.
 * @module i18n
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import en from './en.json';
import id from './id.json';

/**
 * Translation resources for supported languages.
 */
const resources = {
  en: {
    translation: en,
    permission_info: 'Permission Info',
    camera_gallery_permission_explanation: 'The app needs camera/gallery access to take or select receipt/transaction images. Images are only used for text reading, not stored or uploaded.',
    continue: 'Continue',
    cancel: 'Cancel',
  },
  id: {
    translation: id,
    permission_info: 'Info Izin',
    camera_gallery_permission_explanation: 'Aplikasi membutuhkan izin kamera/galeri untuk mengambil atau memilih gambar struk/transaksi. Gambar hanya digunakan untuk membaca teks, tidak disimpan atau diupload.',
    continue: 'Lanjutkan',
    cancel: 'Batal',
  },
};

/**
 * Language detector for react-i18next using device locale.
 */
const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: (cb: (lang: string) => void) => {
    const locales = RNLocalize.getLocales();
    cb(locales[0]?.languageCode || 'en');
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

/**
 * i18n instance configured for React Native with language detection and resources.
 */
i18n
  .use(languageDetector as any)
  .use(initReactI18next)
  .init({
    // compatibilityJSON: 'v4',
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n; 
import { useState } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { scanImageWithOCR, OCRScanResult } from '@utils/ocrUtils';

/**
 * Custom hook for OCR functionality
 * Provides OCR scanning with loading state and error handling
 */
export const useOCR = () => {
  const { t } = useTranslation();
  const [isScanning, setIsScanning] = useState(false);

  /**
   * Scan image with OCR and handle results
   * @param onSuccess - Callback when OCR succeeds
   * @param onError - Callback when OCR fails
   */
  const scanImage = (
    onSuccess: (result: OCRScanResult) => void,
    onError?: (error: string) => void
  ) => {
    setIsScanning(true);
    
    scanImageWithOCR(
      (result: OCRScanResult) => {
        setIsScanning(false);
        onSuccess(result);
      },
      (error: string) => {
        setIsScanning(false);
        if (onError) {
          onError(error);
        } else {
          Alert.alert(t('error'), t('ocr_failed_message') || 'Gagal membaca gambar');
        }
      },
      t('camera_gallery_permission_explanation', 'Aplikasi membutuhkan izin kamera/galeri untuk mengambil atau memilih gambar struk/transaksi. Gambar hanya digunakan untuk membaca teks, tidak disimpan atau diupload.'),
      t('continue'),
      t('cancel')
    );
  };

  return {
    scanImage,
    isScanning,
  };
}; 
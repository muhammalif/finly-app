import { Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import TextRecognition from 'react-native-text-recognition';

/**
 * Extracts amount from OCR text using regex patterns for Indonesian currency format
 */
export const extractAmountFromText = (text: string): string => {
  const patterns = [
    /Rp\s*([0-9.,]+)/gi,
    /([0-9.,]+)\s*Rp/gi,
    /([0-9,]+)\s*CA/gi,
    /Rp\s*([0-9,]+)/gi,
    /([0-9]+(?:\.[0-9]{3})*(?:,[0-9]{2})?)/gi,
  ];

  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      let amount = matches[0];
      
      if (amount.toLowerCase().includes('rp')) {
        const numberMatch = amount.match(/([0-9.,]+)/);
        if (numberMatch) {
          amount = numberMatch[1];
        }
      }
      
      if (amount.toLowerCase().includes('ca')) {
        const numberMatch = amount.match(/([0-9.,]+)/);
        if (numberMatch) {
          amount = numberMatch[1];
        }
      }
      
      let cleanAmount = amount.replace(/\./g, '').replace(/,/g, '.');
      cleanAmount = cleanAmount.replace(/[^0-9.]/g, '');
      
      if (!isNaN(parseFloat(cleanAmount)) && parseFloat(cleanAmount) > 0) {
        return cleanAmount;
      }
    }
  }
  
  const fallbackPattern = /([0-9]{1,3}(?:\.[0-9]{3})*(?:,[0-9]{2})?)/g;
  const fallbackMatches = text.match(fallbackPattern);
  if (fallbackMatches && fallbackMatches.length > 0) {
    const amounts = fallbackMatches
      .map(match => {
        const clean = match.replace(/\./g, '').replace(/,/g, '.');
        return parseFloat(clean);
      })
      .filter(amount => !isNaN(amount) && amount > 1000);
    
    if (amounts.length > 0) {
      const maxAmount = Math.max(...amounts);
      return maxAmount.toString();
    }
  }
  
  return '';
};

/**
 * Interface for OCR scan result
 */
export interface OCRScanResult {
  text: string;
  amount: string;
  success: boolean;
  error?: string;
}

/**
 * Scans an image using OCR with permission dialog
 */
export const scanImageWithOCR = async (
  onSuccess: (result: OCRScanResult) => void,
  onError: (error: string) => void,
  permissionMessage: string,
  continueText: string,
  cancelText: string
): Promise<void> => {
  Alert.alert(
    'Permission Info',
    permissionMessage,
    [
      {
        text: continueText,
        onPress: async () => {
          try {
            const result = await launchImageLibrary({ mediaType: 'photo' });
            if (result.assets && result.assets[0].uri) {
              const ocrResult = await TextRecognition.recognize(result.assets[0].uri);
              const text = (ocrResult || []).join(' ');
              
              const extractedAmount = extractAmountFromText(text);
              
              const scanResult: OCRScanResult = {
                text,
                amount: extractedAmount,
                success: true,
              };
              
              onSuccess(scanResult);
            }
          } catch (err) {
            onError('Failed to read text from image');
          }
        },
      },
      { text: cancelText, style: 'cancel' },
    ]
  );
}; 
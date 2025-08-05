import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '@themes/colors';

interface OCRScanButtonProps {
  onPress: () => void;
  disabled?: boolean;
  size?: number;
  style?: any;
}

/**
 * Reusable OCR scan button component
 */
const OCRScanButton: React.FC<OCRScanButtonProps> = ({
  onPress,
  disabled = false,
  size = 26,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, style]}
    >
      <Icon 
        name="scan-helper" 
        size={size} 
        color={disabled ? colors.textSecondary : colors.icon} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.bgIcon,
  },
});

export default OCRScanButton;

 
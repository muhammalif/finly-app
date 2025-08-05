/**
 * Button component for actions, with support for loading, disabled, icon, and variants.
 * Used throughout the app for primary, secondary, and outline actions.
 * @module Button
 */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, View, TouchableOpacityProps } from 'react-native';
import { colors, buttonColors, ButtonVariantColor } from '@themes/colors';

type ButtonVariant = ButtonVariantColor;

/**
 * Props for Button component.
 * @property title - The button label.
 * @property onPress - Callback when the button is pressed.
 * @property variant - Button style variant (primary, secondary, outline).
 * @property loading - If true, shows a loading spinner.
 * @property disabled - If true, disables the button.
 * @property style - Optional style for the button.
 * @property icon - Optional icon to display before the label.
 */
interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

/**
 * A styled button with support for loading, disabled, and icon states.
 * @param props - ButtonProps
 */
const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  icon,
  ...rest
}) => {
  /**
   * Returns the style object for the button based on variant and disabled state.
   */
  const getButtonStyle = () => {
    const baseStyle = {
      backgroundColor: buttonColors[variant],
      borderWidth: variant === 'outline' ? 1 : 0,
      borderColor: colors.primary
    };
    
    if (disabled) {
      return { ...baseStyle, backgroundColor: colors.disabled };
    }
    return baseStyle;
  };

  /**
   * Returns the text color for the button based on variant.
   */
  const getTextColor = () => {
    if (variant === 'outline') return colors.primary;
    return variant === 'secondary' ? colors.dark : colors.white;
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} testID='ActivityIndicator' />
      ) : (
        <>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[styles.text, { color: getTextColor() }]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    minWidth: 120,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  iconContainer: {
    marginRight: 10,
  },
});

export default Button;
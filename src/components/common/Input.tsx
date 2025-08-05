/**
 * Input component for text input with label and error display.
 * Used for forms throughout the app.
 * @module Input
 */
import React from 'react';
import { TextInput, TextInputProps, StyleSheet, View, Text, ViewStyle } from 'react-native';
import { colors } from '@themes/colors';

/**
 * Props for Input component.
 * @property label - Optional label to display above the input.
 * @property error - Optional error message to display below the input.
 * @property containerStyle - Optional style for the container.
 * @extends TextInputProps
 */
interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

/**
 * A styled text input with label and error message support.
 * @param props - InputProps
 */
const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  style, 
  containerStyle,
  ...props 
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error ? styles.errorInput : null,
          props.multiline ? styles.multiline : null,
          style
        ]}
        placeholderTextColor={colors.placeholder}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: colors.dark,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.dark,
    backgroundColor: colors.white,
  },
  multiline: {
    height: 100,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  errorInput: {
    borderColor: colors.danger,
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    marginTop: 6,
  },
});

export default Input;
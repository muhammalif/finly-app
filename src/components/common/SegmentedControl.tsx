/**
 * SegmentedControl component for switching between multiple options (tabs/buttons).
 * Used for period selection, filters, etc.
 * @module SegmentedControl
 */
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '@themes/colors';

/**
 * Option for the segmented control.
 * @property key - Unique key for the option.
 * @property label - Display label for the option.
 */
export interface SegmentedOption {
  key: string;
  label: string;
}

/**
 * Props for SegmentedControl component.
 * @property options - Array of options to display.
 * @property value - The currently selected key.
 * @property onChange - Callback when a new option is selected.
 * @property style - Optional style for the container.
 */
interface SegmentedControlProps {
  options: SegmentedOption[];
  value: string;
  onChange: (key: string) => void;
  style?: any;
}

/**
 * A segmented control for selecting one of several options.
 * @param props - SegmentedControlProps
 */
const SegmentedControl: React.FC<SegmentedControlProps> = ({ options, value, onChange, style }) => {
  return (
    <View style={[styles.row, style]}>
      {options.map(opt => (
        <TouchableOpacity
          key={opt.key}
          style={[
            styles.btn,
            value === opt.key && styles.activeBtn
          ]}
          onPress={() => onChange(opt.key)}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.text,
            value === opt.key && styles.activeText
          ]}>{opt.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    borderRadius: 18,
    padding: 4,
    marginBottom: 12,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 420,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    minWidth: 0,
  },
  activeBtn: {
    backgroundColor: colors.primary,
  },
  text: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  activeText: {
    color: colors.white,
    textAlign: 'center',
  },
});

export default SegmentedControl; 
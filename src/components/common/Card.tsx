/**
 * Card component for displaying content in a styled container with optional shadow.
 * Used for grouping content visually throughout the app.
 * @module Card
 */
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@themes/colors';

/**
 * Props for Card component.
 * @property children - The content to display inside the card.
 * @property style - Optional style for the card container.
 * @property shadow - Whether to show a shadow (default: true).
 */
interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  shadow?: boolean;
}

/**
 * A styled card container for grouping content with optional shadow.
 * @param props - CardProps
 */
const Card: React.FC<CardProps> = ({ children, style, shadow = true }) => {
  return (
    <View testID='card-container' style={[
      styles.card, 
      shadow ? styles.shadow : null,
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
  },
  shadow: {
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
});

export default Card;
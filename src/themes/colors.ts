export const colors = {
    // Brand colors
    primary: '#007AFF',
    secondary: '#F6F6F6',
    danger: '#DC3545',
    success: '#28A745',
    warning: '#FFC107',
    info: '#17A2B8',

    // UI colors
    disabled: '#CCCCCC',
    dark: '#212529',
    white: '#FFFFFF',
    light: '#F8F9FA',
    gray: '#6C757D',
    black: '#000000',
    transparent: 'transparent',
    outline: 'transparent',

    // Input specific colors
    border: '#DEE2E6',
    placeholder: '#ADB5BD',

    // Text colors
    textPrimary: '#212529',
    textSecondary: '#6C757D',

    // Icon colors
    icon: '#2684FC',
    bgIcon: '#E3F0FF',

    // Background colors
    background: '#F8F9FA',
} as const;

export type ColorKey = keyof typeof colors;

// Button specific types
export type ButtonVariantColor = 'primary' | 'secondary' | 'danger' | 'outline';
export const buttonColors: Record<ButtonVariantColor, string> = {
    primary: colors.primary,
    secondary: colors.secondary,
    danger: colors.danger,
    outline: colors.outline,
} as const; 
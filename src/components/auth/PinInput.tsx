/**
 * PinInput component for entering a 4-digit PIN using a custom keypad.
 * Used for authentication and PIN change flows.
 * Exposes a ref for focus control.
 * @module PinInput
 */
import React, { forwardRef, useImperativeHandle } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewProps } from 'react-native';
import { colors } from '@themes/colors';

/**
 * Ref interface for PinInput, exposes a focus method.
 */
export interface PinInputRef {
    focus: () => void;
}

/**
 * Props for PinInput component.
 * @property pin - The current PIN value.
 * @property onPinChange - Callback when the PIN changes.
 * @property onPinComplete - Callback when 4 digits are entered.
 * @property disabled - If true, disables input.
 */
interface PinInputProps extends ViewProps {
    pin: string;
    onPinChange: (pin: string) => void;
    onPinComplete: (pin: string) => void;
    disabled?: boolean;
}

/**
 * A custom PIN input with a keypad and visual circles for each digit.
 * @param props - PinInputProps
 * @param ref - Ref for focus control
 */
const PinInput = forwardRef<PinInputRef, PinInputProps>(({
    pin,
    onPinChange,
    onPinComplete,
    disabled = false,
    ...rest
}, ref) => {
    // Expose focus method to parent via ref
    useImperativeHandle(ref, () => ({
        focus: () => {
            // Could add visual effect or scrollTo if needed
        }
    }));

    /**
     * Handles number button press on the keypad.
     * @param number - The number pressed as a string
     */
    const handleNumberPress = (number: string) => {
        if (disabled) return;
        if (pin.length < 4) {
            const newPin = pin + number;
            onPinChange(newPin);
            if (newPin.length === 4) {
                onPinComplete(newPin);
            }
        }
    };

    /**
     * Handles backspace button press.
     */
    const handleBackspace = () => {
        if (disabled) return;
        if (pin.length > 0) {
            onPinChange(pin.slice(0, -1));
        }
    };

    /**
     * Renders the 4 PIN circles (filled or empty).
     */
    const renderPinCircles = () => {
        return Array(4).fill(0).map((_, index) => (
            <View
                key={index}
                testID='pin-circle'
                style={[
                    styles.circle,
                    index < pin.length ? styles.filledCircle : styles.emptyCircle,
                    disabled && styles.disabledCircle
                ]}
            />
        ));
    };

    return (
        <View style={styles.container} {...rest}>
            <View style={styles.pinContainer}>{renderPinCircles()}</View>
            <View style={styles.keypad}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <TouchableOpacity
                        key={num}
                        style={[styles.key, disabled && styles.disabledKey]}
                        onPress={() => handleNumberPress(num.toString())}
                        disabled={disabled}
                    >
                        <Text style={[styles.keyText, disabled && styles.disabledKeyText]}>{num}</Text>
                    </TouchableOpacity>
                ))}
                <View style={styles.key} />
                <TouchableOpacity
                    style={[styles.key, disabled && styles.disabledKey]}
                    onPress={() => handleNumberPress('0')}
                    disabled={disabled}
                >
                    <Text style={[styles.keyText, disabled && styles.disabledKeyText]}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.key, disabled && styles.disabledKey]}
                    onPress={handleBackspace}
                    disabled={disabled}
                >
                    <Text style={[styles.keyText, disabled && styles.disabledKeyText]}>  </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
    },
    pinContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
    },
    circle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginHorizontal: 10,
        borderWidth: 1,
    },
    emptyCircle: {
        backgroundColor: '#3498db',
        borderColor: '#3498db',
    },
    filledCircle: {
        backgroundColor: '#2c3e50',
        borderColor: '#2c3e50',
    },
    keypad: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
    },
    key: {
        width: 75,
        height: 75,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 8,
        borderRadius: 37.5,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    keyText: {
        fontSize: 24,
        color: '#2c3e50',
    },
    disabledCircle: {
        opacity: 0.5,
    },
    disabledKey: {
        backgroundColor: colors.disabled,
        borderColor: colors.disabled,
    },
    disabledKeyText: {
        color: colors.gray,
    },
});

export default PinInput;

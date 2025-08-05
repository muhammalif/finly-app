/**
 * DateRangePickerModal component for selecting a start and end date in a modal dialog.
 * Used for filtering data by date range.
 * @module DateRangePickerModal
 */
import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePickerModal from 'react-native-modal-datetime-picker'

/**
 * Represents a date range with optional start and end.
 */
interface DateRange {
    start: Date | null
    end: Date | null
}

/**
 * Props for DateRangePickerModal component.
 * @property visible - Whether the modal is visible.
 * @property onClose - Callback to close the modal.
 * @property onConfirm - Callback when a date range is selected.
 * @property initialRange - Optional initial date range.
 */
interface DateRangePickerModalProps {
    visible: boolean
    onClose: () => void
    onConfirm: (range: DateRange) => void
    initialRange?: DateRange
}

/**
 * Modal dialog for picking a start and end date.
 * @param props - DateRangePickerModalProps
 */
const DateRangePickerModal: React.FC<DateRangePickerModalProps> = ({
    visible, onClose, onConfirm, initialRange
}) => {
    const [step, setStep] = useState<'start' | 'end'>('start')
    const [range, setRange] = useState<DateRange>(initialRange || { start: null, end: null})
    const [pickerVisible, setPickerVisible] = useState(true)

    // Reset state when modal opened/closed
    React.useEffect(() => {
        if (visible) {
            setStep('start')
            setRange(initialRange || { start: null, end: null })
            setPickerVisible(true)
        }
    }, [visible, initialRange])

    /**
     * Handles date selection from the picker.
     * @param date - The selected date
     */
    const handleConfirm = (date: Date) => {
        if (step === 'start') {
            setRange(r => ({ ...r, start: date, end: null }));
            setStep('end');
            setPickerVisible(false);
            setTimeout(() => setPickerVisible(true), 300);
        } else {
            setRange(r => {
                const newRange = { ...r, end: date };
                setPickerVisible(false);
                setTimeout(() => {
                    onConfirm({ start: newRange.start, end: date });
                    onClose();
                }, 300);
                return newRange;
            });
        }
    }

    /**
     * Handles cancel action from the picker.
     */
    const handleCancel = () => {
        if (step === 'end') {
            setStep('start')
            setPickerVisible(false)
            setTimeout(() => setPickerVisible(true), 300)
        } else {
            setPickerVisible(false)
            onClose()
        }
    }

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>
                        {step === 'start' ? 'Pilih Tanggal Awal' : 'Pilih Tanggal Akhir'}
                    </Text>
                    <Text style={styles.selectedText}>
                        {range.start ? `Awal: ${range.start.toLocaleDateString()}` : ''}
                        {range.end ? `\nAkhir: ${range.end.toLocaleDateString()}` : ''}
                    </Text>
                    <DateTimePickerModal
                        isVisible={pickerVisible}
                        mode="date"
                        date={step === 'start' ? (range.start || new Date()) : (range.end || new Date())}
                        onConfirm={handleConfirm}
                        onCancel={handleCancel}
                        maximumDate={step === 'start' ? undefined : new Date()}
                        minimumDate={step === 'end' && range.start ? range.start : undefined}
                    />
                    <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                        <Text style={styles.cancelText}>Batal</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.2',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 24,
        alignItems: 'center',
        minWidth: 280,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    selectedText: {
        fontSize: 15,
        color: '#444',
        marginBottom: 12,
        textAlign: 'center',
    },
    cancelBtn: {
        marginTop: 16,
        paddingVertical: 8,
        paddingHorizontal: 24,
        borderRadius: 8,
        backgroundColor: '#eee',
    },
    cancelText: {
        color: '#222',
        fontWeight: 'bold'
    }
})

export default DateRangePickerModal
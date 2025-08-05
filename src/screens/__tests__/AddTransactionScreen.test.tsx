import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import AddTransactionScreen from '../AddTransactionScreen'
import { useTransactions } from "../../hooks/useTransactions";

// ===== MOCKS =====
jest.mock('../../hooks/useTransactions')
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}))
// Mock Alert 
jest.spyOn(Alert, 'alert')

const mockUseTransactions = useTransactions as jest.Mock

describe('AddTransactionScreen', () => {
    // Create mock for navigation props
    const mockNavigation: any = {
        goBack: jest.fn()
    }
    // Create mock for AddTransaction function from hooks
    const mockAddTransaction = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
        mockUseTransactions.mockReturnValue({
            addTransaction: mockAddTransaction,
            loading: false,
            error: null,
        })
    })

    it('should display an alert if the amount is not filled in when submitting', () => {
        // ===== ACT =====
        const { getByTestId } = render(<AddTransactionScreen navigation={mockNavigation} />)
        const submitButton = getByTestId('submit-button')

        fireEvent.press(submitButton)

        // =====  ASSERT =====
        // Make sure Alert are called with correctly message
        expect(Alert.alert).toHaveBeenCalledWith('error', 'please_enter_valid_amount')
    })

    it('should display an alert if a category is not selected when submitting', () => {
        // ===== ACT ======
        const { getByTestId, getByPlaceholderText } = render(<AddTransactionScreen navigation={mockNavigation} />)

        const amountInput = getByTestId('amount-input')
        fireEvent.changeText(amountInput, '50000')

        const submitButton = getByTestId('submit-button')
        fireEvent.press(submitButton)

        // ===== ASSERT =====
        expect(Alert.alert).toHaveBeenCalledWith('error', 'please_select_category')
    })

    it('should call addTransaction and goBack when the form is valid and successfully submitted', async () => {
        // Configuration mock addTransaction to resolve
        mockAddTransaction.mockResolvedValue(undefined)

        // ===== ACT =====
        const { getByTestId } = render(<AddTransactionScreen navigation={mockNavigation} />)

        const amountInput = getByTestId('amount-input')
        const descriptionInput = getByTestId('description-input')
        // Assume 'food' category
        const categoryButton = getByTestId('category-button-food')
        const submitButton = getByTestId('submit-button')

        // User simulation inputing form
        fireEvent.changeText(amountInput, '75000')
        fireEvent.press(categoryButton)
        fireEvent.changeText(descriptionInput, 'Kopi dan Roti')
        fireEvent.press(submitButton)

        // ===== ASSERT =====
        // Using waitFor for waiting async process are done
        await waitFor(() => {
            // Make sure addTransaction called with correctly data
            expect(mockAddTransaction).toHaveBeenCalledWith({
                amount: 75000,
                category: 'food',
                description: 'Kopi dan Roti',
                type: 'expense'
            })
            // Make sure goBack after done
            expect(mockNavigation.goBack).toHaveBeenCalled()
        })
    })

    it('should display an alert if addTransaction fails', async () => {
        // ===== ARRANGE =====
        // Configuration mock addTransaction to rejected
        const errorMessage = 'Database connection error'
        mockAddTransaction.mockRejectedValue(new Error(errorMessage))
        mockUseTransactions.mockReturnValue({
            addTransaction: mockAddTransaction,
            loading: false,
            error: errorMessage,
        })

        // ===== ACT =====
        const { getByTestId } = render(<AddTransactionScreen navigation={mockNavigation} />)
        
        const amountInput = getByTestId('amount-input')
        const categoryButton = getByTestId('category-button-food')
        const submitButton = getByTestId('submit-button')

        fireEvent.changeText(amountInput, '25000')
        fireEvent.press(categoryButton)
        fireEvent.press(submitButton)

        // ===== ASSERT =====
        await waitFor(() => {
            // Make sure Alert.alert have been called with error message from hooks
            expect(Alert.alert).toHaveBeenCalledWith('error', errorMessage)
        })
    })
})
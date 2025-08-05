import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import OnboardingScreen from '../OnboardingScreen'
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock react-i18next
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    })
}))

describe('OnboardingScreen', () => {
    // Create mock for onDone props
    const mockOnDone = jest.fn()

    beforeEach(() => {
        // Clear all mock before testing
        jest.clearAllMocks()
    })

    it('It should display an error message if the name is not filled in.', async () => {
        // ===== ACT =====
        const { getByText } = render(
            <OnboardingScreen onDone={mockOnDone} />
        )
        const submitButton = getByText('onboarding_button')

        fireEvent.press(submitButton)

        // ===== ASSERT =====
        const errorMessage = await waitFor(() => getByText('onboarding_error_name'))
        expect(errorMessage).toBeTruthy()
    })

    it('should save data to AsyncStorage and call onDone on successful submit', async () => {
        // ===== ACT =====
        const { getByPlaceholderText, getByText } = render(
            <OnboardingScreen onDone={mockOnDone} />
        )

        const nameInput = getByPlaceholderText('onboarding_placeholder_name')
        const balanceInput = getByPlaceholderText('onboarding_placeholder_balance')
        const submitButton = getByText('onboarding_button')

        fireEvent.changeText(nameInput, 'New User')
        fireEvent.changeText(balanceInput, '100000')
        fireEvent.press(submitButton)

        // ===== ASSERT =====
        await waitFor(() => {
            // Make sure AsyncStorage.setItem call correctly
            expect(AsyncStorage.setItem).toHaveBeenCalledWith('onboardingDone', 'true')
            expect(AsyncStorage.setItem).toHaveBeenCalledWith('username', 'New User')
            expect(AsyncStorage.setItem).toHaveBeenCalledWith('initialBalance', '100000')

            expect(mockOnDone).toHaveBeenCalled()
        })
    })
}) 
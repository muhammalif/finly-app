import React from "react";
import { render } from "@testing-library/react-native";
import DashboardScreen from '../DashboardScreen'
import { useTransactions } from '../../hooks/useTransactions'
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock dependencies
jest.mock('../../hooks/useTransactions')
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useFocusEffect: require('react').useEffect,
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string, options?: { returnObjects: boolean}) => {
            if (options?.returnObjects) {
                return []
            }
            return key
        },
        i18n: { language: 'id'},
    }),
}))

const mockUseTransactions = useTransactions as jest.Mock

describe('DashboardScreen', () => {
    const mockNavigation: any = {
        navigate: jest.fn(),
        dispatch: jest.fn(),
        reset: jest.fn(),
        goBack: jest.fn(),
        isFocused: () => true,
        setParams: jest.fn(),
        setOptions: jest.fn(),
    }

    const mockTransactions = [
        { id: '1', type: 'income', amount: 50000, description: 'Salary', date: new Date().toISOString() },
        { id: '2', type: 'expense', amount: 20000, description: 'Lunch', date: new Date().toISOString() },
    ]

    beforeEach(async () => {
        jest.clearAllMocks()
        await AsyncStorage.setItem('username', 'Tester')
        await AsyncStorage.setItem('initialBalance', '1000000')
    })

    it('should display the loading state (skeleton)', () => {
        // ====== ARRANGE =====
        mockUseTransactions.mockReturnValue({
            transactions: [],
            loading: true,
            error: null,
            refresh: jest.fn(),
        })

        // ===== ACT =====
        const { getByTestId } = render(
            <DashboardScreen navigation={mockNavigation} />
        )
        // ===== ASSERT =====
        expect(getByTestId('dashboard-skeleton')).toBeTruthy()
    })

    it('should display dashboard data correctly after loading is complete', async () => {
        // ===== ARRANGE =====
        mockUseTransactions.mockReturnValue({
            transactions: mockTransactions,
            loading: false,
            error: null,
            refresh: jest.fn(),
        })

        // ===== ACT =====
        const { findByText, findAllByText } = render(
            <DashboardScreen navigation={mockNavigation} />
        )
        // ===== ASSERT =====
        expect(await findByText('Tester')).toBeTruthy()
        expect(await findByText('Salary')).toBeTruthy()

        const balanceElements = await findAllByText(/Rp\s?1[.,]030[.,]000/)
        expect(balanceElements.length).toBeGreaterThan(0)
    })

    it('should display a "Try Again" button when an error occurs', async () => {
        // ===== ARRANGE =====
        mockUseTransactions.mockReturnValue({
            transactions: [],
            loading: false,
            error: 'Failed to load data',
            refresh: jest.fn(),
        })

        // ===== ACT =====
        const { findByText } = render(
            <DashboardScreen navigation={mockNavigation} />
        )
        // ===== ASSERT =====
        const retryButton = await findByText('retry')
        expect(retryButton).toBeTruthy()
    })
})

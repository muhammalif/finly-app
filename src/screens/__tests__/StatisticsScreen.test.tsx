import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import StatisticsScreen from '../StatisticsScreen'
import { useTransactions } from "../../hooks/useTransactions";
import { useFocusEffect } from "@react-navigation/native";

// ===== MOCKS =====
jest.mock('../../hooks/useTransactions')

// Mock useFocusEffect behave like useEffect
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useFocusEffect: require('react').useEffect,
}))

// Mock i18next
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    })
}))

// Mock child components (Chart & PieLegend)
jest.mock('../../components/statistics/Chart', () => 'Chart')
jest.mock('../../components/statistics/PieLegend', () => 'PieLegend')
jest.mock('../../components/common/SegmentedControl', () => {
    const { TouchableOpacity, Text } = require('react-native')
    // Mock SegmentedControl for simulation
    return ({ options, onChange }) => (
        <>
            {options.map(opt => (
                <TouchableOpacity key={opt.key} testID={`period-filter-${opt.key}`} onPress={() => onChange(opt.key)}>
                    <Text>{opt.key}</Text>
                </TouchableOpacity>
            ))}
        </>
    )
})

const mockUseTransactions = useTransactions as jest.Mock

describe('StatisticsScreen', () => {
    // Create mock data with different date for testing
    const today = new Date()
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(today.getDate() - 7)
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)

    const mockTransactions = [
        // Expense this month
        { id: '1', type: 'expense', amount: 10000, category: 'food', date: today.toISOString(), description: 'Nasi Padang' },
        { id: '2', type: 'expense', amount: 50000, category: 'transportation', date: today.toISOString(), description: 'Bensin' },
        // Income this month
        { id: '3', type: 'income', amount: 1000000, category: 'salary', date: today.toISOString(), description: 'Gaji Bulanan' },
        // Expense one month ago
        { id: '4', type: 'expense', amount: 50000, category: 'bills', date: lastMonth.toISOString(), description: 'Listrik' },
    ]

    beforeEach(() => {
        jest.clearAllMocks()
        // Set default mock for useTransactions
        mockUseTransactions.mockReturnValue({
            transactions: mockTransactions,
            loading: false,
            error: null,
            refresh: jest.fn()
        })
    })

    it('should display this months expense data by default', () => {
        const { getByTestId } = render(<StatisticsScreen />)

        const chart = getByTestId('statistics-chart')
        const pieLegend = getByTestId('statistics-pie-legend')
        
        // Expect Chart to receive 2 transactions (only this month's expenses)
        expect(chart.props.transactions).toHaveLength(2)

        const descriptions = chart.props.transactions.map(t => t.description)
        expect(descriptions).toContain('Nasi Padang')
        expect(descriptions).toContain('Bensin')
        expect(descriptions).not.toContain('Listrik')
        

        // Expect PieLegend to receive aggregation data
        expect(pieLegend.props.pieData).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ x: 'food', y: 10000}),
                expect.objectContaining({ x: 'transportation', y: 50000}),
            ])
        )
    })

    it('should change the data to income when the button is toggled', () => {
        const { getByTestId } = render(<StatisticsScreen />)

        const incomeToggleButton = getByTestId('income-toggle-button')
        fireEvent.press(incomeToggleButton)

        const chart = getByTestId('statistics-chart')
        const pieLegend = getByTestId('statistics-pie-legend')

        // Expect Chart to receive 1 transaction (only this month's income)
        expect(chart.props.transactions).toHaveLength(1)
        expect(chart.props.transactions[0].description).toBe('Gaji Bulanan')

        // Expect PieLegend to receive income data
        expect(pieLegend.props.pieData).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ x: 'salary', y: 1000000 }),
            ])
        )
    })

    it('should filter transactions to "All" when the period filter is changed', () => {
        const { getByTestId } = render(<StatisticsScreen />)

        // Assume 'all' is the key for the "All" filter
        const allPeriodButton = getByTestId('period-filter-all')
        fireEvent.press(allPeriodButton)

        const chart = getByTestId('statistics-chart')

        // Expect Chart to receive 3 transactions (expense for all time)
        expect(chart.props.transactions).toHaveLength(3)
    })
})
import React from "react";
import { render } from "@testing-library/react-native";
import TransactionItem from "../TransactionItem";

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}))
jest.mock('../../../themes/colors', () => ({
    colors: { bgIcon: '#eee', icon: '#000', secondary: '#fff' },
}))
jest.mock('../../../utils/currencyUtils', () => ({
    formatCurrency: (val: number) => `Rp${val}`,
}))
jest.mock('date-fns', () => ({
    format: () => 'Jan 1, 2025'
}))
jest.mock('constants/categories', () => ({
    expenseCategories: [{ key: 'food', icon: 'food', color: '#f00'}],
    incomeCategories: [{ key: 'salary', icon: 'salary', color: '#0f0'}],
}))

const transaction = {
    id: 1,
    description: 'Lunch',
    type: 'expense',
    category: 'food',
    amount: 10000,
    date: new Date().toISOString(),
}

describe('TransactionItem', () => {
    it('renders transaction details', () => {
        const { getByText } = render(
            <TransactionItem transaction={transaction} />
        )
        expect(getByText('Lunch')).toBeTruthy()
        expect(getByText('food')).toBeTruthy()
        expect(getByText('Jan 1, 2025')).toBeTruthy()
        expect(getByText('- Rp10000')).toBeTruthy()
    })
})
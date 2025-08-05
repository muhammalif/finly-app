import React from "react";
import { render } from "@testing-library/react-native";
import PieLegend from '../PieLegend'

jest.mock('../../../themes/colors', () => ({
    colors: { bgIcon: '#eee', icon: '#000' },
}))
jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}))
jest.mock('../../../utils/currencyUtils', () => ({
    formatCurrency: (val: number) => `Rp${val}`,
}))

const pieData = [
    { x: 'food', y: 10000, color: '#f00', icon: 'food'},
    { x: 'transport', y: 5000, color: '#f00', icon: 'car'},
]

describe('PieLegend', () => {
    it('renders legend items', () => {
        const { getByText } = render(<PieLegend pieData={pieData} type="expense" />)
        expect(getByText('food')).toBeTruthy()
        expect(getByText('transport')).toBeTruthy()
        expect(getByText('- Rp10000')).toBeTruthy()
        expect(getByText('- Rp5000')).toBeTruthy()
    })

    it('retruns null if pieData is empty', () => {
        const { toJSON } = render(<PieLegend pieData={[]} type="expense"/>)
        expect(toJSON()).toBeNull()
    })
})
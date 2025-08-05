import React from "react";
import { render } from "@testing-library/react-native";
import Chart from '../Chart'

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}))
jest.mock('../../../themes/colors', () => ({
    colors: { primary: '#2684FC' },
}))
jest.mock('../../common/Card', () => (props) => <>{props.children}</>)
jest.mock('victory-native', () => ({
    VictoryPie: () => <></>
}))
jest.mock('react-native-svg', () => ({
    Svg: (props) => <>{props.childern}</>,
    G: () => <></>,
    Text: () => <></>,
}))

const transactions = [
    { id: 1, type: 'expense', category: 'food', amount: 10000, date: new Date().toISOString()},
    { id: 2, type: 'income', category: 'salary', amount: 20000, date: new Date().toISOString()},
]

describe('Chart', () => {
    it('shows loading indicator', () => {
        const { getByTestId } = render(
            <Chart transactions={transactions} loading error={null} type="expense" />
        )
        expect(getByTestId('loading-indicator')).toBeTruthy()
    })

    it('shows error message', () => {
        const { getByText } = render(
            <Chart transactions={transactions} loading={false} error="Error!" type="expense" />
        )
        expect(getByText('Error!')).toBeTruthy()
    })

    it('shows empty state if no data', () => {
        const { getByText } = render(
            <Chart transactions={[]} loading={false} error={null} type="expense" />
        )
        expect(getByText(/no_data_available/i)).toBeTruthy()
    })

})
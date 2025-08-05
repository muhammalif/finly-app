import React from "react";
import { render } from "@testing-library/react-native";
import FinancialTipsCard from '../FinancialTipsCard'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key === 'financial_tips_list' ? ['Tip 1', 'Tip 2'] : key,
  }),
}));

describe('FinancialTipsCard', () => {
  it('renders tips carousel', () => {
    const { getByText } = render(<FinancialTipsCard transactions={[]} />);
    expect(getByText('Tip 1')).toBeTruthy();
    expect(getByText('Tip 2')).toBeTruthy();
  });
});
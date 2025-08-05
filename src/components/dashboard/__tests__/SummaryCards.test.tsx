import React from 'react';
import { render } from '@testing-library/react-native';
import SummaryCards from '../SummaryCards';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const transactions = [
  { type: 'income', amount: 10000, date: new Date().toISOString() },
  { type: 'expense', amount: 5000, date: new Date().toISOString() },
];

describe('SummaryCards', () => {
  it('shows income, expense, and savings', () => {
    const { getByText } = render(
      <SummaryCards transactions={transactions} showBalance={true} initialBalance={2000} />
    );
    expect(getByText(/income/i)).toBeTruthy();
    expect(getByText(/expense/i)).toBeTruthy();
    expect(getByText(/savings/i)).toBeTruthy();
  });

  it('masks values when showBalance is false', () => {
    const { getAllByText } = render(
      <SummaryCards transactions={transactions} showBalance={false} initialBalance={2000} />
    );
    // Should find at least one masked value
    expect(getAllByText('••••••••').length).toBeGreaterThan(0);
  });
});
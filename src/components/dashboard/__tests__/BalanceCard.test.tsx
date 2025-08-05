import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import BalanceCard from '../BalanceCard';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@utils/currencyUtils', () => ({
  formatCurrency: (val: number) => `Rp${val}`,
}));

describe('BalanceCard', () => {
  it('shows balance when showBalance is true', () => {
    const { getByText } = render(
      <BalanceCard balance={10000} showBalance={true} onToggleShowBalance={() => {}} />
    );
    expect(getByText('Rp10000')).toBeTruthy();
  });

  it('masks balance when showBalance is false', () => {
    const { getByText } = render(
      <BalanceCard balance={10000} showBalance={false} onToggleShowBalance={() => {}} />
    );
    expect(getByText('••••••••')).toBeTruthy();
  });

  it('calls onToggleShowBalance when eye icon is pressed', () => {
    const onToggle = jest.fn();
    const { getByRole } = render(
      <BalanceCard balance={10000} showBalance={true} onToggleShowBalance={onToggle} />
    );
    fireEvent.press(getByRole('button'));
    expect(onToggle).toHaveBeenCalled();
  });
});
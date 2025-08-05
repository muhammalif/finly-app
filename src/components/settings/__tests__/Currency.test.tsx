import React from 'react';
import { render } from '@testing-library/react-native';
import Currency from '../Currency';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));
jest.mock('@themes/colors', () => ({
  colors: { secondary: '#fff', bgIcon: '#eee', icon: '#000' },
}));

describe('Currency', () => {
  it('renders currency option with IDR', () => {
    const { getByText } = render(<Currency />);
    expect(getByText('currency')).toBeTruthy();
    expect(getByText('IDR')).toBeTruthy();
  });
});
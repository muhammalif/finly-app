import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SegmentedControl from '../SegmentedControl';

describe('SegmentedControl', () => {
  const options = [
    { key: '1', label: 'One' },
    { key: '2', label: 'Two' },
    { key: '3', label: 'Three' },
  ];

  it('renders all options', () => {
    const { getByText } = render(
      <SegmentedControl options={options} value="1" onChange={() => {}} />
    );
    expect(getByText('One')).toBeTruthy();
    expect(getByText('Two')).toBeTruthy();
    expect(getByText('Three')).toBeTruthy();
  });

  it('calls onChange with correct key', () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <SegmentedControl options={options} value="1" onChange={onChange} />
    );
    fireEvent.press(getByText('Two'));
    expect(onChange).toHaveBeenCalledWith('2');
  });
});

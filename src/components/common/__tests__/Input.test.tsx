import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Input from '../Input';

describe('Input', () => {
  it('renders with label', () => {
    const { getByText } = render(<Input label="Username" />);
    expect(getByText('Username')).toBeTruthy();
  });

  it('renders with error', () => {
    const { getByText } = render(<Input error="Required" />);
    expect(getByText('Required')).toBeTruthy();
  });

  it('calls onChangeText when value changes', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <Input placeholder="Type here" onChangeText={onChangeText} />
    );
    fireEvent.changeText(getByPlaceholderText('Type here'), 'abc');
    expect(onChangeText).toHaveBeenCalledWith('abc');
  });

  it('renders multiline input', () => {
    const { getByDisplayValue } = render(
      <Input multiline value="multiline text" onChangeText={() => {}} />
    );
    expect(getByDisplayValue('multiline text')).toBeTruthy();
  });
});

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PinInput from '../PinInput';

describe('PinInput', () => {
  it('renders 4 circles', () => {
    const { getAllByTestId } = render(
      <PinInput pin="" onPinChange={() => {}} onPinComplete={() => {}} />
    );
    expect(getAllByTestId('pin-circle')).toHaveLength(4);
  });

  it('calls onPinChange and onPinComplete correctly', () => {
    let pin = ''
    const onPinChange = jest.fn((newPin) => { pin = newPin; rerenderComponent(); })
    const onPinComplete = jest.fn()
    
    let utils;
    const rerenderComponent = () => {
        utils.rerender(
            <PinInput pin={pin} onPinChange={onPinChange} onPinComplete={onPinComplete} />
        )
    }

    utils = render(
        <PinInput pin={pin} onPinChange={onPinChange} onPinComplete={onPinComplete} />
    )

    const { getByText } = utils
    fireEvent.press(getByText('1'))
    fireEvent.press(getByText('2'))
    fireEvent.press(getByText('3'))
    fireEvent.press(getByText('4'))
  });

  it('does not allow input when disabled', () => {
    const onPinChange = jest.fn();
    const { getByText } = render(
      <PinInput pin="" onPinChange={onPinChange} onPinComplete={() => {}} disabled />
    );
    fireEvent.press(getByText('1'));
    expect(onPinChange).not.toHaveBeenCalled();
  });
});
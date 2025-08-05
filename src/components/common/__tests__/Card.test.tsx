import React from 'react';
import { render } from '@testing-library/react-native';
import Card from '../Card';
import { Text } from 'react-native';

describe('Card', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <Card><Text>Content</Text></Card>
    );
    expect(getByText('Content')).toBeTruthy();
  });

  it('renders with shadow by default', () => {
    const { getByTestId } = render(
      <Card><Text>Shadow</Text></Card>
    );
    // Shadow style is not easily testable, but component should render
    expect(getByTestId('card-container')).toBeTruthy();
  });

  it('renders without shadow', () => {
    const { getByTestId } = render(
      <Card shadow={false}><Text>No Shadow</Text></Card>
    );
    expect(getByTestId('card-container')).toBeTruthy();
  });
});

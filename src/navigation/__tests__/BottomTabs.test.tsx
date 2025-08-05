import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabs from '../BottomTabs';

// ===================== MOCKS =====================

// Mock the screen components that the navigator will render.
// This isolates the test to the navigator itself, not the content of the screens.
jest.mock('@screens/DashboardScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => <Text>DashboardScreen</Text>; // Return a simple placeholder.
});
jest.mock('@screens/StatisticsScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => <Text>StatisticsScreen</Text>;
});
jest.mock('@screens/AddTransactionScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => <Text>AddTransactionScreen</Text>;
});
jest.mock('@screens/TransactionHistoryScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => <Text>TransactionHistoryScreen</Text>;
});
jest.mock('@screens/SettingsScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => <Text>SettingsScreen</Text>;
});

// Mock the translation hook to return the key for consistent testing.
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));


// ===================== TEST SUITE =====================

// Test suite for the BottomTabs navigation logic.
describe('BottomTabs integration navigation', () => {
  
  // Test case: Ensures the component renders without throwing any errors.
  it('renders without crashing', () => {
    // Act: Render the navigator within a NavigationContainer, which is required for navigators.
    render(
      <NavigationContainer>
        <BottomTabs />
      </NavigationContainer>
    );
    // No assertion needed; the test passes if it doesn't crash.
  });

  // Test case: Verifies navigation to the Statistics tab.
  it('navigates to Statistics tab when pressed', async () => {
    // Arrange: Render the navigator.
    const { getAllByText, findByText } = render(
      <NavigationContainer>
        <BottomTabs />
      </NavigationContainer>
    );
    // Act: Simulate a user pressing the 'statistics' tab.
    fireEvent.press(getAllByText('statistics')[0]);
    // Assert: Wait for the mock text of the StatisticsScreen to appear, confirming navigation was successful.
    expect(await findByText('StatisticsScreen')).toBeTruthy();
  });

  // Test case: Verifies navigation to the Dashboard tab.
  it('navigates to Dashboard tab when pressed', async () => {
    // Arrange: Render the navigator.
    const { getAllByText, findByText } = render(
      <NavigationContainer>
        <BottomTabs />
      </NavigationContainer>
    );
    // Act: Simulate pressing the 'dashboard' tab.
    fireEvent.press(getAllByText('dashboard')[0]);
    // Assert: Wait for the DashboardScreen mock text to appear.
    expect(await findByText('DashboardScreen')).toBeTruthy();
  });
  
  // Test case: Verifies navigation to the Add Transaction tab, which is a special button.
  it('navigates to Add Transaction tab when pressed', async () => {
    // Arrange: Render the navigator.
    const { getAllByRole, findByText } = render(
      <NavigationContainer>
        <BottomTabs />
      </NavigationContainer>
    );
    // Act: Get all interactive elements with the 'button' role in the tab bar.
    const tabButtons = getAllByRole('button');
    // Act: Find the specific "Add Transaction" tab by its accessibility label.
    // This is a robust way to find buttons that may not have visible text labels.
    const addTransactionTab = tabButtons.find(
      btn => btn.props.accessibilityLabel === 'AddTransaction, tab, 3 of 5'
    );
    // Act: Simulate pressing the found tab button.
    fireEvent.press(addTransactionTab!);
    // Assert: Wait for the AddTransactionScreen mock text to appear.
    expect(await findByText('AddTransactionScreen')).toBeTruthy();
  });

  // Test case: Verifies navigation to the Transaction History tab.
  it('navigates to Transaction History tab when pressed', async () => {
    // Arrange: Render the navigator.
    const { getAllByText, findByText } = render(
      <NavigationContainer>
        <BottomTabs />
      </NavigationContainer>
    );
    // Act: Simulate pressing the 'history' tab.
    fireEvent.press(getAllByText('history')[0]);
    // Assert: Wait for the TransactionHistoryScreen mock text to appear.
    expect(await findByText('TransactionHistoryScreen')).toBeTruthy();
  });

  // Test case: Verifies navigation to the Settings tab.
  it('navigates to Settings tab when pressed', async () => {
    // Arrange: Render the navigator.
    const { getAllByText, findByText } = render(
      <NavigationContainer>
        <BottomTabs />
      </NavigationContainer>
    );
    // Act: Simulate pressing the 'settings' tab.
    fireEvent.press(getAllByText('settings')[0]);
    // Assert: Wait for the SettingsScreen mock text to appear.
    expect(await findByText('SettingsScreen')).toBeTruthy();
  });
});
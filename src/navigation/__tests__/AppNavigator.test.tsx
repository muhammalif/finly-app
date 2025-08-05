import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AppNavigator from '../AppNavigator';
import { useAppContext } from '../../store/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ===================== MOCKS =====================

// Mock the screen/navigator components that AppNavigator can render.
// This isolates the test to the navigator's logic.
jest.mock('@screens/OnboardingScreen', () => {
  const { Text } = require('react-native');
  return () => <Text>OnboardingScreen</Text>; // Return a simple placeholder.
});
jest.mock('@screens/AuthScreen', () => {
  const { Text } = require('react-native');
  return () => <Text>AuthScreen</Text>;
});
jest.mock('../BottomTabs', () => {
  const { Text } = require('react-native');
  return () => <Text>MainTabs</Text>;
});
jest.mock('@screens/ChangePinScreen', () => ({
  ChangePinOldScreen: () => null, // Mocking other potential screens in the stack.
  ChangePinNewScreen: () => null,
  ChangePinConfirmScreen: () => null,
}));

// Mock the entire AppContext module.
jest.mock('../../store/AppContext');

// Create a typed alias for the mocked useAppContext hook for easier use in tests.
const mockUseAppContext = useAppContext as jest.Mock;


// ===================== TEST SUITE =====================

// Test suite for the main AppNavigator's routing logic.
describe('AppNavigator', () => {
  // Before each test, clear all mocks to ensure a clean state and test isolation.
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test case: Should show the OnboardingScreen if the user has not completed onboarding.
  it('shows OnboardingScreen if onboarding not done', async () => {
    // Arrange: Simulate that 'onboardingDone' is not set in AsyncStorage.
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    // Arrange: Simulate an unauthenticated user state from the context.
    mockUseAppContext.mockReturnValue({
      state: { isAuthenticated: false },
    });
    
    // Act: Render the main navigator.
    const { findByText } = render(<AppNavigator />);
    // Assert: Wait for the OnboardingScreen's mock text to be visible.
    await waitFor(() => expect(findByText('OnboardingScreen')).toBeTruthy());
  });

  // Test case: Should show the AuthScreen if onboarding is done but the user is not authenticated.
  it('shows AuthScreen if onboarding done but not authenticated', async () => {
    // Arrange: Simulate that onboarding is complete.
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('true');
    // Arrange: Simulate an unauthenticated user state.
    mockUseAppContext.mockReturnValue({
      state: { isAuthenticated: false },
    });
    
    // Act: Render the main navigator.
    const { findByText } = render(<AppNavigator />);
    // Assert: Wait for the AuthScreen's mock text to be visible.
    await waitFor(() => expect(findByText('AuthScreen')).toBeTruthy());
  });

  // Test case: Should show the main app (MainTabs) if onboarding is done and the user is authenticated.
  it('shows MainTabs if onboarding done and authenticated', async () => {
    // Arrange: Simulate that onboarding is complete.
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('true');
    // Arrange: Simulate an authenticated user state.
    mockUseAppContext.mockReturnValue({
      state: { isAuthenticated: true },
    });
    
    // Act: Render the main navigator.
    const { findByText } = render(<AppNavigator />);
    // Assert: Wait for the MainTabs' (BottomTabs) mock text to be visible.
    await waitFor(() => expect(findByText('MainTabs')).toBeTruthy());
  });
});
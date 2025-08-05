import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert, Linking } from 'react-native';
import SettingsScreen from '../SettingsScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import functions to verify their calls.
import { exportData } from '../../lib/backup/backupUtils';
import { deleteAllTransactions } from '../../lib/database/transactionQueries';
import { resetUserPin } from '../../lib/database/userQueries';


// ===================== MOCKS =====================

// Mock Navigation: Provides a mock navigate function to test navigation events.
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock i18n: Returns the key as the translation and provides a mock language changer.
const mockChangeLanguage = jest.fn();
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: mockChangeLanguage,
      language: 'en',
    },
  }),
}));

// Mock AsyncStorage: Provides mock functions for setItem and removeItem.
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock Linking: Ensures openURL returns a promise to prevent crashes when .catch() is used.
jest.spyOn(Linking, 'openURL').mockImplementation(() => Promise.resolve());

// Mock External Functions: Provide mock implementations for library utilities.
jest.mock('@lib/backup/backupUtils', () => ({
  exportData: jest.fn(),
}));
jest.mock('@lib/database/transactionQueries', () => ({
  deleteAllTransactions: jest.fn(),
}));
jest.mock('@lib/database/userQueries', () => ({
  resetUserPin: jest.fn(),
}));

// Mock Child Components: Isolate SettingsScreen by replacing children with simple placeholders.
// This makes tests faster and less brittle.
jest.mock('@settings/Profile', () => (props: any) => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return <TouchableOpacity testID="mock-profile" onPress={props.onShowProfileModal}><Text>Profile</Text></TouchableOpacity>;
});
jest.mock('@settings/Currency', () => () => {
  const { View, Text } = require('react-native');
  return <View testID="mock-currency"><Text>Currency</Text></View>;
});
jest.mock('@settings/Language', () => (props: any) => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return <TouchableOpacity testID="mock-language" onPress={props.onShowLangModal}><Text>Language</Text></TouchableOpacity>;
});
jest.mock('@settings/ExportData', () => (props: any) => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return <TouchableOpacity testID="mock-export" onPress={props.onShowExportModal}><Text>Export Data</Text></TouchableOpacity>;
});
jest.mock('@settings/Support', () => (props: any) => {
    const { View, Text, TouchableOpacity } = require('react-native');
    return <TouchableOpacity testID="mock-support" onPress={props.onShowSupportModal}><Text>Support</Text></TouchableOpacity>;
});
jest.mock('@components/settings/CheckVersion', () => () => {
  const { View, Text } = require('react-native');
  return <View testID="mock-check-version"><Text>Check Version</Text></View>;
});
jest.mock('@components/settings/PrivacyPolicy', () => () => {
    const { View, Text } = require('react-native');
    return <View><Text>Privacy Policy Content</Text></View>;
});
jest.mock('@components/settings/TermsOfUse', () => () => {
    const { View, Text } = require('react-native');
    return <View><Text>Terms of Use Content</Text></View>;
});


// ===================== TEST SUITE =====================

// Test suite for the SettingsScreen.
describe('SettingsScreen', () => {
  // Before each test, clear all mocks to ensure a clean state and prevent test interference.
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test case: Renders the initial layout and all setting options correctly.
  it('should render all settings options correctly', () => {
    // Act: Render the component.
    const { getByText, getByTestId } = render(<SettingsScreen />);
    // Assert: Check that the main title and a mocked child component are present.
    expect(getByText('settings')).toBeTruthy();
    expect(getByTestId('mock-profile')).toBeTruthy();
  });

  // Test case: Opens the profile modal and navigates to the Change PIN screen.
  it('should open profile modal and navigate to change PIN', async () => {
    // Act: Render the component.
    const { getByTestId, findByText } = render(<SettingsScreen />);
    // Act: Press the profile option to open its modal.
    fireEvent.press(getByTestId('mock-profile'));
    // Act: Find and press the "Change PIN" button inside the modal.
    const changePinButton = await findByText('change_pin');
    fireEvent.press(changePinButton);
    // Assert: Verify that the navigate function was called with the correct screen name.
    expect(mockNavigate).toHaveBeenCalledWith('ChangePinOld');
  });

  // Test case: Allows a user to successfully change their username.
  it('should be able to change username via profile modal', async () => {
    // Arrange: Spy on Alert to verify it gets called.
    const alertSpy = jest.spyOn(Alert, 'alert');
    // Act: Render the component.
    const { getByTestId, findByText, getByPlaceholderText, getByText: getByTextInModal } = render(<SettingsScreen />);
    // Act: Open the profile modal, then the change username modal.
    fireEvent.press(getByTestId('mock-profile'));
    const changeUsernameButton = await findByText('change_username');
    fireEvent.press(changeUsernameButton);
    // Act: Type the new username into the input field.
    const textInput = getByPlaceholderText('enter_new_username');
    fireEvent.changeText(textInput, 'John Doe');
    // Act: Press the save button.
    const saveButton = getByTextInModal('save');
    fireEvent.press(saveButton);
    // Assert: Wait for the async operations to complete.
    await waitFor(() => {
      // Assert: Check that AsyncStorage was called to save the new name.
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('username', 'John Doe');
      // Assert: Check that a success alert was shown.
      expect(alertSpy).toHaveBeenCalledWith('success', 'username_updated');
    });
    // Clean up the spy.
    alertSpy.mockRestore();
  });

  // Test case: Deletes all user data when the confirmation alert is accepted.
  it('should delete all data after confirmation', async () => {
    // Arrange: Mock the confirmation alert to automatically press the "destructive" button.
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
        // Find and execute the 'destructive' action if it exists.
        const destructiveButton = buttons?.find((b: any) => b.style === 'destructive');
        if (destructiveButton?.onPress) {
            destructiveButton.onPress();
        }
    });

    // Act: Render the component.
    const { getByTestId, findByText } = render(<SettingsScreen />);
    
    // Act: Open the profile modal and press the delete data option.
    fireEvent.press(getByTestId('mock-profile'));
    const deleteButton = await findByText('delete_data');
    fireEvent.press(deleteButton);

    // Assert: Wait for async deletion functions to complete.
    await waitFor(() => {
        // Assert: Verify that all data deletion functions were called.
        expect(deleteAllTransactions).toHaveBeenCalledTimes(1);
        expect(AsyncStorage.removeItem).toHaveBeenCalledWith('initialBalance');
        expect(resetUserPin).toHaveBeenCalledTimes(1);
        expect(AsyncStorage.setItem).toHaveBeenCalledWith('onboardingDone', 'false');
        // Assert: Verify that the final success alert was shown.
        expect(alertSpy).toHaveBeenCalledWith('success', 'all_data_deleted');
    });

    // Clean up the spy.
    alertSpy.mockRestore();
  });

  // Test case: Changes the application language.
  it('should be able to change the language', async () => {
    // Act: Render the component.
    const { getByTestId, findByText } = render(<SettingsScreen />);
    // Act: Open the language selection modal.
    fireEvent.press(getByTestId('mock-language'));
    // Act: Select a new language.
    const indonesianOption = await findByText('Indonesia');
    fireEvent.press(indonesianOption);
    // Assert: Verify that the i18n changeLanguage function was called with the correct language key.
    expect(mockChangeLanguage).toHaveBeenCalledWith('id');
  });
  
  // Test case: Shows a success alert when data export succeeds.
  it('should export data successfully', async () => {
    // Arrange: Spy on Alert and mock the export function to simulate a successful export.
    const alertSpy = jest.spyOn(Alert, 'alert');
    (exportData as jest.Mock).mockResolvedValue(true);

    // Act: Render, open export modal, and press export.
    const { getByTestId, findByText } = render(<SettingsScreen />);
    fireEvent.press(getByTestId('mock-export'));
    const exportExcelButton = await findByText('excel_export');
    fireEvent.press(exportExcelButton);
    
    // Assert: Wait for async export to finish and check for the success alert.
    await waitFor(() => {
        expect(exportData).toHaveBeenCalledTimes(1);
        expect(alertSpy).toHaveBeenCalledWith('success', 'success_export');
    });

    // Clean up the spy.
    alertSpy.mockRestore();
  });

  // Test case: Shows an error alert when data export fails.
  it('should show an error if data export fails', async () => {
    // Arrange: Spy on Alert and mock the export function to simulate a failure.
    const alertSpy = jest.spyOn(Alert, 'alert');
    (exportData as jest.Mock).mockRejectedValue(new Error('Export failed'));

    // Act: Render, open export modal, and press export.
    const { getByTestId, findByText } = render(<SettingsScreen />);
    fireEvent.press(getByTestId('mock-export'));
    const exportExcelButton = await findByText('excel_export');
    fireEvent.press(exportExcelButton);

    // Assert: Wait for async export to fail and check for the error alert.
    await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('error', 'fail_export');
    });

    // Clean up the spy.
    alertSpy.mockRestore();
  });

  // Test case: Correctly attempts to open external links from the support modal.
  it('should open email and telegram links in the support modal', async () => {
    // Act: Render the component.
    const { getByTestId, findByText } = render(<SettingsScreen />);

    // Act: Open the support modal.
    fireEvent.press(getByTestId('mock-support'));

    // Act: Press the email link.
    const emailLink = await findByText('filagrowth.1006@gmail.com');
    fireEvent.press(emailLink);
    // Assert: Verify that Linking.openURL was called with the correct mailto link.
    expect(Linking.openURL).toHaveBeenCalledWith('mailto:filagrowth.1006@gmail.com?subject=FinlyApp Support');

    // Act: Press the Telegram link.
    const telegramLink = await findByText('@sedangtunduh');
    fireEvent.press(telegramLink);
    // Assert: Verify that Linking.openURL was called with the correct Telegram URL.
    expect(Linking.openURL).toHaveBeenCalledWith('https://t.me/sedangtunduh');
  });
});
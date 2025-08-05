import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AuthScreen from '../AuthScreen';
import { useAuth } from '../../hooks/useAuth';
import { useAppContext } from '../../store/AppContext';

// ===================== MOCKS =====================
// Mock dependencies hooks
jest.mock('@hooks/useAuth');
jest.mock('@store/AppContext');

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Create mock alias for easy to use
const mockUseAuth = useAuth as jest.Mock;
const mockUseAppContext = useAppContext as jest.Mock;

describe('AuthScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      login: jest.fn().mockResolvedValue(false),
      loading: false,
      error: null,
      clearError: jest.fn(),
    });
    mockUseAppContext.mockReturnValue({
      dispatch: jest.fn(),
    });
  });

  it('should render the initial view correctly', () => {
    const { getByText } = render(<AuthScreen />);
    expect(getByText('enter_pin')).toBeTruthy(); 
  });

  it('should call the login and dispatch functions when the PIN is correct', async () => {
    // ===== ARRANGE =====
    const mockLogin = jest.fn().mockResolvedValue(true);
    const mockDispatch = jest.fn();
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      loading: false,
      error: null,
      clearError: jest.fn(),
    });
    mockUseAppContext.mockReturnValue({
      dispatch: mockDispatch,
    });
    
    // ===== ACT =====
    // Use unique testID 
    const { getByTestId } = render(<AuthScreen />);
    const pinInputComponent = getByTestId('pin-input-container');
    
    // Call props onPinComplete on PinInput components
    fireEvent(pinInputComponent, 'onPinComplete', '1234');

    // ===== ASSERT =====
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('1234');
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'LOGIN' });
    });
  });

  it('should display an error message when login fails', async () => {
    // ===== ARRANGE =====
    const mockLogin = jest.fn().mockResolvedValue(false);
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      loading: false,
      error: 'PIN yang Anda masukkan salah.',
      clearError: jest.fn(),
    });

    // ===== ACT =====
    const { getByTestId, findByText } = render(<AuthScreen />);
    const pinInputComponent = getByTestId('pin-input-container');
    fireEvent(pinInputComponent, 'onPinComplete', '1111');

    // ===== ASSERT =====
    const errorMessage = await findByText('PIN yang Anda masukkan salah.');
    expect(errorMessage).toBeTruthy();
  });
});
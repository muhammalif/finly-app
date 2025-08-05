import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import TransactionHistoryScreen from '../TransactionHistoryScreen';
import { useTransactions } from '../../hooks/useTransactions';

// ===================== MOCKS =====================

// Mock the custom hook for fetching transaction data.
jest.mock('../../hooks/useTransactions');

// Mock the useFocusEffect to behave like a standard useEffect for testing purposes.
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useFocusEffect: require('react').useEffect,
}));

// Mock the translation hook (i18n) to simply return the key itself.
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock the TransactionItem component to simplify the test's rendered output.
jest.mock('@components/transactions/TransactionItem', () => {
  const { View, Text } = require('react-native');
  return ({ transaction }: { transaction: { description: string } }) => (
    <View>
      <Text>{transaction.description}</Text>
    </View>
  );
});

// Cast the mocked hook to a Jest mock type for easier manipulation.
const mockUseTransactions = useTransactions as jest.Mock;


// Test suite for the TransactionHistoryScreen.
describe('TransactionHistoryScreen', () => {
  // Enable Jest's fake timers to control setTimeout, setInterval, etc., in tests.
  jest.useFakeTimers();

  // Create a mock data array with 20 transactions for testing pagination.
  const mockTransactions = Array.from({ length: 20 }, (_, i) => ({
    id: `id-${i + 1}`,
    type: i % 3 === 0 ? 'income' : 'expense',
    amount: (i + 1) * 1000,
    description: `Transaksi ke-${i + 1}`,
    category: 'food',
    date: new Date().toISOString(),
  }));

  // Clean up all mocks after each test to ensure test isolation.
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test case: It should display the loading skeleton when `loading` is true.
  it('should display loading state (skeleton)', () => {
    // Arrange: Set the hook to return a loading state.
    mockUseTransactions.mockReturnValue({
      transactions: [],
      loading: true,
      error: null,
      refresh: jest.fn(),
    });
    // Act: Render the component.
    const { getByTestId } = render(<TransactionHistoryScreen />);
    // Assert: Check if the loading skeleton is visible.
    expect(getByTestId('loading-skeleton')).toBeTruthy();
  });

  // Test case: It should display an error message and a retry button when an error occurs.
  it('should display error message and retry button', () => {
    // Arrange: Set the hook to return an error state.
    mockUseTransactions.mockReturnValue({
      transactions: [],
      loading: false,
      error: 'Failed to load data',
      refresh: jest.fn(),
    });
    // Act: Render the component.
    const { getByText, getByTestId } = render(<TransactionHistoryScreen />);
    // Assert: Check if the error message and retry button are visible.
    expect(getByText('Failed to load data')).toBeTruthy();
    expect(getByTestId('retry-button')).toBeTruthy();
  });

  // Test case: It should display an "empty" message if there are no transactions.
  it('should display "No Transactions" message when data is empty', () => {
    // Arrange: Set the hook to return an empty, non-loading, error-free state.
    mockUseTransactions.mockReturnValue({
      transactions: [],
      loading: false,
      error: null,
      refresh: jest.fn(),
    });
    // Act: Render the component.
    const { getByTestId } = render(<TransactionHistoryScreen />);
    // Assert: Check if the empty list message is visible.
    expect(getByTestId('empty-list-message')).toBeTruthy();
  });

  // Test case: It should correctly render the first page of transactions.
  it('should display the first page of transactions correctly', () => {
    // Arrange: Provide the full list of mock transactions.
    mockUseTransactions.mockReturnValue({
      transactions: mockTransactions,
      loading: false,
      error: null,
      refresh: jest.fn(),
    });
    // Act: Render the component.
    const { getByText, queryByText } = render(<TransactionHistoryScreen />);
    // Assert: Check that the first and last items of the first page are visible.
    expect(getByText('Transaksi ke-1')).toBeTruthy();
    expect(getByText('Transaksi ke-15')).toBeTruthy();
    // Assert: Check that an item from the second page is NOT visible initially.
    expect(queryByText('Transaksi ke-16')).toBeNull();
  });

  // Test case: It should load more data (page 2) for infinite scroll.
  it('should load more data (page 2) when scrolled to the bottom', async () => {
    // Arrange: Provide the full list of mock transactions.
    mockUseTransactions.mockReturnValue({
      transactions: mockTransactions,
      loading: false,
      error: null,
      refresh: jest.fn(),
    });

    // Act: Render the component.
    const { getByTestId, findByText } = render(<TransactionHistoryScreen />);
    // Get the FlatList component by its test ID.
    const flatList = getByTestId('transaction-flat-list');

    // Act: Directly call the onEndReached prop to simulate reaching the end of the list.
    act(() => {
      flatList.props.onEndReached()
    });

    // Act: Fast-forward time by 400ms to trigger the setTimeout in the component's handleEndReached function.
    act(() => {
      jest.advanceTimersByTime(400);
    });

    // Act: Fast-forward a bit more to ensure any pending state updates are processed.
    act(() => {
      jest.advanceTimersByTime(100);
    });

    // Assert: Wait for the last item of the second page to appear in the UI.
    const lastItem = await findByText('Transaksi ke-20');
    // Assert: Confirm that the new item was found.
    expect(lastItem).toBeTruthy();
  });
});
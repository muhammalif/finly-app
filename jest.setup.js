// Mock react-native-localize
jest.mock('react-native-localize', () => ({
  getLocales: () => [{ countryCode: 'ID', languageTag: 'id-ID', languageCode: 'id', isRTL: false }],
  findBestAvailableLanguage: () => ({ languageTag: 'id-ID', isRTL: false }),
  getNumberFormatSettings: () => ({ decimalSeparator: '.', groupingSeparator: ',' }),
  getCalendar: () => 'gregorian',
  getCountry: () => 'ID',
  getCurrencies: () => ['IDR'],
  getTemperatureUnit: () => 'celsius',
  getTimeZone: () => 'Asia/Jakarta',
  uses24HourClock: () => true,
  usesMetricSystem: () => true,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }) => children,
  Swipeable: jest.fn(),
  DrawerLayout: jest.fn(),
  State: {},
  PanGestureHandler: jest.fn(),
  TapGestureHandler: jest.fn(),
  LongPressGestureHandler: jest.fn(),
  FlingGestureHandler: jest.fn(),
  Directions: {},
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock react-native-fs
jest.mock('react-native-fs', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
  unlink: jest.fn(),
  exists: jest.fn(),
  mkdir: jest.fn(),
  downloadFile: jest.fn(),
  moveFile: jest.fn(),
  copyFile: jest.fn(),
  stat: jest.fn(),
}));

// Mock react-native-share
jest.mock('react-native-share', () => ({
  open: jest.fn(),
  shareSingle: jest.fn(),
  isPackageInstalled: jest.fn(),
}));

// Mock react-native-masked-view
jest.mock('@react-native-masked-view/masked-view', () => {
  const React = require('react');
  return (props) => React.createElement('View', props, props.children);
});

// Mock victory-native
jest.mock('victory-native')


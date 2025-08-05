module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    "node_modules/(?!(react-native" +
      "|@react-native" +
      "|@react-native-community" +
      "|@react-native-community/datetimepicker" +
      "|@react-native-picker/picker" +
      "|react-native-blob-util" +
      "|react-native-chart-kit" +
      "|react-native-device-info" +
      "|react-native-fs" +
      "|react-native-gesture-handler" +
      "|react-native-image-picker" +
      "|react-native-keychain" +
      "|react-native-linear-gradient" +
      "|react-native-localize" +
      "|react-native-modal-datetime-picker" +
      "|react-native-safe-area-context" +
      "|react-native-screens" +
      "|react-native-share" +
      "|react-native-skeleton-placeholder" +
      "|react-native-sqlite-storage" +
      "|react-native-svg" +
      "|react-native-svg-transformer" +
      "|react-native-text-recognition" +
      "|react-native-vector-icons" +
      "|react-native-version-check" +
      "|victory-native" +
      "|victory-core" +
      "|victory-area" +
      "|victory-bar" +
      "victory-candlestick" +
      "|@react-native-masked-view/masked-view" +
      "|@react-native-masked-view/masked-view/js" +
      ")/)"
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '^victory-native$': '<rootDir>/__mocks__/victory-native.js',
    
  },
};
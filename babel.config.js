module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
        [
            'module-resolver',
            {
                root: ['./src'],
                extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
                alias: {
                    '@assets': ['./src/assets'],
                    '@components': ['./src/components'],
                    '@lib': ['./src/lib'],
                    '@screens': ['./src/screens'],
                    '@store': ['./src/store'],
                    '@navigation': ['./src/navigation'],
                    '@types': ['./src/types'],
                    '@utils': ['./src/utils'],
                    '@hooks': ['./src/hooks'],
                    '@themes': ['./src/themes'],
                    '@settings': ['./src/components/settings']
                }
            }
        ],
    ],
};
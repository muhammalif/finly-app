import './src/i18n';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context'
import AppNavigator from '@navigation/AppNavigator';
import { AppProvider } from '@store/AppContext';
import { initDB } from '@lib/database/db';

const App = () => {
  useEffect(() => {
    initDB().catch(console.error)
  }, [])

  return (
    <AppProvider>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </AppProvider>
  )
}

export default App
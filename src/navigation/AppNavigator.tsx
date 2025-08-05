/**
 * AppNavigator sets up the main navigation stack for the app.
 * Handles onboarding, authentication, main tabs, and PIN change flows.
 * @module AppNavigator
 */
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabs from './BottomTabs';
import AuthScreen from '@screens/AuthScreen';
import { useAppContext } from '@store/AppContext';
import { ChangePinOldScreen, ChangePinNewScreen, ChangePinConfirmScreen } from '@screens/ChangePinScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingScreen from '@screens/OnboardingScreen';

const Stack = createStackNavigator();

/**
 * Main navigation component for the app.
 * Handles onboarding, authentication, and main app navigation.
 */
const AppNavigator = () => {
    const { state } = useAppContext();
    const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);

    useEffect(() => {
        AsyncStorage.getItem('onboardingDone').then(val => setOnboardingDone(val === 'true'));
    }, []);

    if (onboardingDone === null) return null;

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {onboardingDone ? (
                    state.isAuthenticated ? (
                        <>
                            <Stack.Screen 
                                name="MainTabs" 
                                component={BottomTabs} 
                                options={{ headerShown: false }} 
                            />
                            <Stack.Screen 
                                name="ChangePinOld" 
                                component={ChangePinOldScreen} 
                                options={{ title: 'Ubah PIN' }} 
                            />
                            <Stack.Screen 
                                name="ChangePinNew" 
                                component={ChangePinNewScreen} 
                                options={{ title: 'PIN Baru' }} 
                            />
                            <Stack.Screen 
                                name="ChangePinConfirm" 
                                component={ChangePinConfirmScreen} 
                                options={{ title: 'Konfirmasi PIN Baru' }} 
                            />
                        </>
                    ) : (
                        <Stack.Screen 
                            name="Auth" 
                            component={AuthScreen} 
                            options={{ headerShown: false }} 
                        />
                    )
                ) : (
                    <Stack.Screen 
                        name="Onboarding" 
                        options={{ headerShown: false }}
                    >
                        {props => <OnboardingScreen {...props} onDone={() => setOnboardingDone(true)} />}
                    </Stack.Screen>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
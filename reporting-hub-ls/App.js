import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { AppDataProvider } from './src/context/AppDataContext';
import { ReportsProvider } from './src/context/ReportsContext';
import LoginScreen from './src/screens/LoginScreen';
import {
  StudentTabs,
  LecturerTabs,
  PRLTabs,
  PLTabs,
} from './src/navigation/AppNavigator';

const Stack = createStackNavigator();

function RootNavigator() {
  const { loaded, user } = useAuth();

  if (!loaded) return null;

  const getHomeScreen = () => {
    switch (user?.role) {
      case 'Student':
        return <Stack.Screen name="StudentTabs" component={StudentTabs} />;
      case 'Lecturer':
        return <Stack.Screen name="LecturerTabs" component={LecturerTabs} />;
      case 'PRL':
        return <Stack.Screen name="PRLTabs" component={PRLTabs} />;
      case 'PL':
        return <Stack.Screen name="PLTabs" component={PLTabs} />;
      default:
        return <Stack.Screen name="Login" component={LoginScreen} />;
    }
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {getHomeScreen()}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <AppDataProvider>
            <ReportsProvider>
              <NavigationContainer>
                <StatusBar style="light" backgroundColor="#0A3556" />
                <RootNavigator />
              </NavigationContainer>
            </ReportsProvider>
          </AppDataProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

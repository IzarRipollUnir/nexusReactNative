import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../shared/contexts/AuthContext';
import LoadingScreen from '../shared/components/LoadingScreen';
import LoginScreen from '../features/auth/screens/LoginScreen';
import HomeScreen from '../features/home/screens/HomeScreen';
import LibraryDrawerNavigator from './DrawerNavigator';
import CoworkingStack from './CoworkingStack';
import { LibraryCartProvider } from '../features/library/contexts/LibraryCartContext';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Loading" component={LoadingScreen} />
      </Stack.Navigator>
    );
  }

  if (!user) {
    return (
      <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={HomeScreen} />
      <Stack.Screen
        name="Library"
        children={() => (
          <LibraryCartProvider>
            <LibraryDrawerNavigator />
          </LibraryCartProvider>
        )}
      />
      <Stack.Screen name="Coworking" component={CoworkingStack} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

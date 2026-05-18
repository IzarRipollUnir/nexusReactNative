import 'react-native-gesture-handler';
import './global.css';

import React from 'react';
import { Text, TextInput } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/shared/contexts/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import { useFonts } from 'expo-font';
import LoadingScreen from './src/shared/components/LoadingScreen';

export default function App(): React.ReactElement {
  const [fontsLoaded] = useFonts({
    'SpaceGrotesk': require('./assets/fonts/SpaceGrotesk-VariableFont_wght.ttf'),
    'Manrope': require('./assets/fonts/Manrope-VariableFont_wght.ttf'),
  });

  React.useEffect(() => {
    try {
      const t = Text as any;
      const ti = TextInput as any;
      if (!t.defaultProps) t.defaultProps = {};
      if (!ti.defaultProps) ti.defaultProps = {};
      t.defaultProps.style = [{ fontFamily: 'Manrope' }, t.defaultProps.style || {}];
      ti.defaultProps.style = [{ fontFamily: 'Manrope' }, ti.defaultProps.style || {}];
    } catch (e) {
    }
  }, []);

  if (!fontsLoaded) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <LoadingScreen />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

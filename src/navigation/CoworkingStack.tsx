import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CoworkingHomeScreen from '../features/coworking/screens/CoworkingHomeScreen';

const Stack = createNativeStackNavigator();

export default function CoworkingStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CoworkingHome" component={CoworkingHomeScreen} options={{ title: 'Coworking' }} />
    </Stack.Navigator>
  );
}

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LibraryHomeScreen from '../features/library/screens/LibraryHomeScreen';
import LibraryDetailScreen from '../features/library/screens/LibraryDetailScreen';
import CartScreen from '../features/library/screens/CartScreen';
import LibraryCategoryScreen from '../features/library/screens/LibraryCategoryScreen';
import LibraryHistoricScreen from '../features/library/screens/LibraryHistoricScreen';

const Stack = createNativeStackNavigator();

export default function LibraryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LibraryHome" component={LibraryHomeScreen} options={{ title: 'Library' }} />
      <Stack.Screen name="LibraryCategory" component={LibraryCategoryScreen} options={{ title: 'Category' }} />
      <Stack.Screen name="LibraryDetail" component={LibraryDetailScreen} options={{ title: 'Detail' }} />
      <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Cart' }} />
      <Stack.Screen name="Historic" component={LibraryHistoricScreen} options={{ title: 'Historic' }} />
    </Stack.Navigator>
  );
}

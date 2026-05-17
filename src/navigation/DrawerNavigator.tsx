import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LibraryHomeScreen from '../features/library/screens/LibraryHomeScreen';
import LibraryDetailScreen from '../features/library/screens/LibraryDetailScreen';
import CartScreen from '../features/library/screens/CartScreen';
import LibraryCategoryScreen from '../features/library/screens/LibraryCategoryScreen';
import LibraryHistoricScreen from '../features/library/screens/LibraryHistoricScreen';
import LibraryDrawerContent from './LibraryDrawerContent';

const Drawer = createDrawerNavigator();

export default function LibraryDrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="LibraryHome"
      drawerContent={(props) => <LibraryDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="LibraryHome" component={LibraryHomeScreen} options={{ title: 'Library' }} />
      <Drawer.Screen name="LibraryCategory" component={LibraryCategoryScreen} options={{ title: 'Category' }} />
      <Drawer.Screen name="LibraryDetail" component={LibraryDetailScreen} options={{ title: 'Detail' }} />
      <Drawer.Screen name="Cart" component={CartScreen} options={{ title: 'Cart' }} />
      <Drawer.Screen name="Historic" component={LibraryHistoricScreen} options={{ title: 'Historic' }} />
    </Drawer.Navigator>
  );
}

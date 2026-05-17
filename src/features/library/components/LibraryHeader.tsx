import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type LibraryHeaderProps = {
  title?: string;
  navigation: {
    dispatch: (action: any) => void;
    navigate: (routeName: string) => void;
  };
};

export default function LibraryHeader({ title = 'Librería Universitaria', navigation }: LibraryHeaderProps) {
  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View className="mb-4 flex-row items-center justify-between rounded-2xl bg-slate-950 px-4 py-4">
      <Text className="text-xl font-bold text-white">{title}</Text>
      <View className="flex-row items-center gap-2">
        <Pressable onPress={() => navigation.navigate('LibraryHome')} className="rounded-full p-2 active:opacity-80">
          <MaterialCommunityIcons name="home-outline" size={24} color="white" />
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Cart')} className="rounded-full p-2 active:opacity-80">
          <MaterialCommunityIcons name="cart-outline" size={24} color="white" />
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Historic')} className="rounded-full p-2 active:opacity-80">
          <MaterialCommunityIcons name="history" size={24} color="white" />
        </Pressable>
        <Pressable onPress={openDrawer} className="rounded-full p-2 active:opacity-80">
          <MaterialCommunityIcons name="menu" size={24} color="white" />
        </Pressable>
      </View>
    </View>
  );
}
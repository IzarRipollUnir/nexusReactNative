import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getCategories } from '../features/library/services/libraryClient';
import type { Category } from '../features/library/types';

export default function LibraryDrawerContent(props: DrawerContentComponentProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await getCategories();
        if (mounted) {
          setCategories(data);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <DrawerContentScrollView {...props}>
      <View className="px-4 py-2">
        <Text className="mb-3 text-lg font-semibold text-slate-950">Librería</Text>
        <View className="mb-4 gap-2">
          <Pressable
            onPress={() => props.navigation.navigate('LibraryHome')}
            className="flex-row items-center rounded-xl bg-slate-950 px-4 py-3 active:opacity-80"
          >
            <MaterialCommunityIcons name="home-outline" size={20} color="white" />
            <Text className="ml-3 text-base font-medium text-white">Inicio</Text>
          </Pressable>
          <Pressable
            onPress={() => props.navigation.navigate('Cart')}
            className="flex-row items-center rounded-xl bg-slate-100 px-4 py-3 active:opacity-80"
          >
            <MaterialCommunityIcons name="cart-outline" size={20} color="#0f172a" />
            <Text className="ml-3 text-base font-medium text-slate-950">Carrito</Text>
          </Pressable>
          <Pressable
            onPress={() => props.navigation.navigate('Historic')}
            className="flex-row items-center rounded-xl bg-slate-100 px-4 py-3 active:opacity-80"
          >
            <MaterialCommunityIcons name="history" size={20} color="#0f172a" />
            <Text className="ml-3 text-base font-medium text-slate-950">Histórico</Text>
          </Pressable>
        </View>

        <Text className="mb-3 text-lg font-semibold text-slate-950">Categorías</Text>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <View>
            {categories.map((category) => (
              <Pressable
                key={category.id}
                onPress={() => props.navigation.navigate('LibraryCategory', { id: category.id, name: category.name })}
                className="mb-2 rounded-xl bg-slate-100 px-4 py-3 active:opacity-80"
              >
                <Text className="text-base text-slate-900">{category.name}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </DrawerContentScrollView>
  );
}
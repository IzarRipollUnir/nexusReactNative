import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Navbar from '../../../shared/components/Navbar';
import LibraryHeader from '../components/LibraryHeader';
import { getHistoric } from '../services/libraryClient';
import { useAuth } from '../../../shared/contexts/AuthContext';
import type { Book } from '../types';

import * as Haptics from 'expo-haptics';

export default function LibraryHistoricScreen({ navigation }: any) {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistoric = useCallback(async () => {
    try {
      setError(null);

      setLoading(true);
      const data = await getHistoric('1');
      setBooks(data);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'No se pudo cargar el histórico');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      void loadHistoric();
    }, [loadHistoric])
  );

  return (
    <>
      <Navbar navigation={navigation} />
      <SafeAreaView className="flex-1 bg-white" edges={[]}>
        <ScrollView className="flex-1 px-4 pt-4" contentContainerClassName="pb-10">
        <LibraryHeader title="Histórico" navigation={navigation} />

          {loading ? (
            <View className="items-center justify-center py-10">
              <ActivityIndicator />
            </View>
          ) : error ? (
            <View className="rounded-2xl bg-red-50 px-4 py-5">
              <Text className="text-base font-semibold text-red-700">No se pudo cargar el histórico.</Text>
              <Text className="mt-1 text-sm text-red-600">{error}</Text>
            </View>
          ) : books.length === 0 ? (
            <View className="items-center rounded-3xl bg-slate-50 px-5 py-14">
              <MaterialCommunityIcons name="history" size={56} color="#94a3b8" />
              <Text className="mt-4 text-xl font-semibold text-slate-950">Sin compras registradas</Text>
              <Text className="mt-2 text-center text-base leading-6 text-slate-500">
                Cuando realices una compra, aparecerá aquí el detalle de tus libros.
              </Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {books.map((book) => (
                <Pressable
                  key={book.id}
                  onPress={async () => {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    navigation.navigate('LibraryDetail', { id: book.id });
                  }}
                  className="mb-4 w-[48%] overflow-hidden rounded-2xl bg-white"
                  style={{ elevation: 2 }}
                >
                  <Image source={{ uri: book.cover }} className="h-48 w-full" resizeMode="cover" />
                  <View className="p-4">
                    <Text className="text-base font-medium text-slate-950" numberOfLines={1}>
                      {book.title}
                    </Text>
                    <Text className="mt-1 text-sm text-slate-500" numberOfLines={1}>
                      {book.author}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
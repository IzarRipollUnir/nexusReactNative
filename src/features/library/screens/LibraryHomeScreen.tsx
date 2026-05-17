import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LibraryHeader from '../components/LibraryHeader';
import { getBestSellers } from '../services/libraryClient';
import type { Book } from '../types';

export default function LibraryHomeScreen({ navigation }: any) {
  const [bestSellers, setBestSellers] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await getBestSellers();
        if (mounted) {
          setBestSellers(data);
        }
      } catch (fetchError) {
        if (mounted) {
          setError(fetchError instanceof Error ? fetchError.message : 'No se pudieron cargar los libros');
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
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView className="flex-1 px-4 pt-4" contentContainerClassName="pb-10">
        <LibraryHeader navigation={navigation} />

        <Text className="mb-4 text-2xl font-semibold text-slate-950">Los 10 Más Vendidos</Text>

        {loading ? (
          <View className="items-center justify-center py-10">
            <ActivityIndicator size="large" color="#667eea" />
          </View>
        ) : error ? (
          <View className="rounded-2xl bg-red-50 px-4 py-5">
            <Text className="text-base font-semibold text-red-700">No se pudieron cargar los destacados.</Text>
            <Text className="mt-1 text-sm text-red-600">{error}</Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between">
            {bestSellers.map((book) => (
              <Pressable
                key={book.id}
                onPress={() => navigation.navigate('LibraryDetail', { id: book.id })}
                className="mb-4 w-[48%] overflow-hidden rounded-2xl bg-white"
                style={{ elevation: 2 }}
              >
                <Image source={{ uri: book.cover }} className="h-56 w-full" resizeMode="cover" />
                <View className="p-4">
                  <Text className="text-base font-medium text-slate-950" numberOfLines={1}>
                    {book.title}
                  </Text>
                  <Text className="mt-1 text-sm text-slate-500" numberOfLines={1}>
                    {book.author}
                  </Text>
                  <Text className="mt-2 text-lg font-semibold text-blue-600">
                    €{book.price.toFixed(2)}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

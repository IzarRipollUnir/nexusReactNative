import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../../../shared/components/Navbar';
import LibraryHeader from '../components/LibraryHeader';
import { getBookByCategory, getBooksWithFilters } from '../services/libraryClient';
import type { Book } from '../types';
import * as Haptics from 'expo-haptics';
type Props = {
  route: { params?: { id?: number; name?: string } };
  navigation: any;
};

export default function LibraryCategoryScreen({ route, navigation }: Props) {
  const categoryId = route.params?.id;
  const categoryName = route.params?.name ?? '';
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [isbn, setIsbn] = useState('');
  const [year, setYear] = useState('');
  const [priceMax, setPriceMax] = useState('');

  const loadBooks = async (applyFilters = false) => {
    try {
      setLoading(true);
      setError(null);

      if (!categoryId) {
        setBooks([]);
        return;
      }

      const data = applyFilters
        ? await getBooksWithFilters({
            category: String(categoryId),
            author: author.trim() || undefined,
            title: title.trim() || undefined,
            ISBN: isbn.trim() || undefined,
            year: year.trim() ? Number(year) : undefined,
            priceMax: priceMax.trim() ? Number(priceMax) : undefined,
          })
        : await getBookByCategory(String(categoryId));

      setBooks(data);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'No se pudieron cargar los libros');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (mounted) {
        await loadBooks(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [categoryId]);

  const handleApplyFilters = async () => {
    await loadBooks(true);
  };

  const handleResetFilters = async () => {
    setAuthor('');
    setTitle('');
    setIsbn('');
    setYear('');
    setPriceMax('');
    await loadBooks(false);
  };

  return (
    <>
      <Navbar navigation={navigation} />
      <SafeAreaView className="flex-1 bg-white" edges={[]}>
        <ScrollView className="flex-1 px-4 pt-4" contentContainerClassName="pb-10">
        <LibraryHeader title={`Categoría: ${categoryName || 'Cargando...'}`} navigation={navigation} />

          <View className="mb-5 rounded-2xl bg-slate-50 p-4">
            <Text className="text-lg font-semibold text-slate-950">Filtrar libros: {categoryName || 'Cargando...'}</Text>
            <TextInput
              value={isbn}
              onChangeText={setIsbn}
              placeholder="ISBN"
              className="mt-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-950"
              placeholderTextColor="#94a3b8"
            />
            <TextInput
              value={author}
              onChangeText={setAuthor}
              placeholder="Autor"
              className="mt-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-950"
              placeholderTextColor="#94a3b8"
            />
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Título"
              className="mt-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-950"
              placeholderTextColor="#94a3b8"
            />
            <View className="mt-3 flex-row gap-3">
              <TextInput
                value={year}
                onChangeText={setYear}
                placeholder="Año"
                keyboardType="numeric"
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-950"
                placeholderTextColor="#94a3b8"
              />
              <TextInput
                value={priceMax}
                onChangeText={setPriceMax}
                placeholder="Precio máx."
                keyboardType="numeric"
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-950"
                placeholderTextColor="#94a3b8"
              />
            </View>
            <View className="mt-4 flex-row gap-3">
              <Pressable onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                await handleApplyFilters();
              }} className="flex-1 rounded-xl bg-slate-950 px-4 py-3 active:opacity-90">
                <Text className="text-center text-base font-semibold text-white">Aplicar filtros</Text>
              </Pressable>
              <Pressable onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                await handleResetFilters();
              }} className="rounded-xl border border-slate-200 bg-white px-4 py-3 active:opacity-90">
                <Text className="text-center text-base font-semibold text-slate-950">Limpiar</Text>
              </Pressable>
            </View>
          </View>

          {loading ? (
            <View className="items-center justify-center py-10">
              <ActivityIndicator />
            </View>
          ) : error ? (
            <View className="rounded-2xl bg-red-50 px-4 py-5">
              <Text className="text-base font-semibold text-red-700">No se pudieron cargar los libros.</Text>
              <Text className="mt-1 text-sm text-red-600">{error}</Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {books.map((book) => (
                <Pressable
                  key={book.id}
                  onPress={async() => {
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
    </>
  );
}
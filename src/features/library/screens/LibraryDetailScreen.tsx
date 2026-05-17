import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Navbar from '../../../shared/components/Navbar';
import LibraryHeader from '../components/LibraryHeader';
import { getBookDetail } from '../services/libraryClient';
import type { Book } from '../types';
import { useLibraryCart } from '../contexts/LibraryCartContext';

export default function LibraryDetailScreen({ route, navigation }: any) {
  const { id } = route.params || {};
  const { addItem, hasItem } = useLibraryCart();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        if (!id) {
          throw new Error('No se recibió un identificador de libro.');
        }

        const data = await getBookDetail(String(id));
        if (mounted) {
          setBook(data);
        }
      } catch (fetchError) {
        if (mounted) {
          setError(fetchError instanceof Error ? fetchError.message : 'No se pudo cargar el libro');
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
  }, [id]);

  const handleAddToCart = () => {
    if (!book) {
      return;
    }

    addItem(book);
    Alert.alert('Añadido al carrito', `${book.title} se ha agregado correctamente.`);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#667eea" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !book) {
    return (
      <>
        <Navbar navigation={navigation} />
        <SafeAreaView className="flex-1 bg-white" edges={[]}>
          <ScrollView className="flex-1 px-4 pt-4" contentContainerClassName="pb-10">
          <LibraryHeader title="Detalle" navigation={navigation} />
            <View className="rounded-2xl bg-red-50 px-4 py-5">
              <Text className="text-base font-semibold text-red-700">No se pudo cargar el libro.</Text>
              <Text className="mt-1 text-sm text-red-600">{error ?? 'Inténtalo de nuevo más tarde.'}</Text>
            </View>
            <Pressable
              onPress={() => navigation.goBack()}
              className="mt-4 flex-row items-center self-start rounded-xl bg-slate-950 px-4 py-3 active:opacity-90"
            >
              <MaterialCommunityIcons name="arrow-left" size={18} color="white" />
              <Text className="ml-2 text-base font-semibold text-white">Volver</Text>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <Navbar navigation={navigation} />
      <SafeAreaView className="flex-1 bg-white" edges={[]}>
        <ScrollView className="flex-1 px-4 pt-4" contentContainerClassName="pb-10">
        <LibraryHeader title="Detalle del libro" navigation={navigation} />

          <Pressable
            onPress={() => navigation.goBack()}
            className="mb-4 flex-row items-center self-start rounded-xl bg-slate-100 px-4 py-3 active:opacity-90"
          >
            <MaterialCommunityIcons name="arrow-left" size={18} color="#0f172a" />
            <Text className="ml-2 text-base font-semibold text-slate-950">Volver</Text>
          </Pressable>

          <View className="overflow-hidden rounded-3xl bg-white" style={{ elevation: 3 }}>
            <Image source={{ uri: book.cover }} className="h-96 w-full" resizeMode="cover" />
            <View className="p-5">
              <Text className="text-3xl font-bold text-slate-950">{book.title}</Text>
              <Text className="mt-2 text-lg text-slate-500">{book.author}</Text>

              <View className="mt-4 flex-row flex-wrap gap-2">
                <View className="rounded-full bg-blue-50 px-3 py-2">
                  <Text className="font-medium text-blue-700">{book.category}</Text>
                </View>
                <View className="rounded-full bg-slate-100 px-3 py-2">
                  <Text className="font-medium text-slate-700">ISBN: {book.ISBN}</Text>
                </View>
                <View className="rounded-full bg-slate-100 px-3 py-2">
                  <Text className="font-medium text-slate-700">Año: {book.year}</Text>
                </View>
              </View>

              <Text className="mt-5 text-3xl font-bold text-blue-600">€{book.price.toFixed(2)}</Text>

              <Text className="mt-6 text-lg font-semibold text-slate-950">Descripción</Text>
              <Text className="mt-2 leading-6 text-slate-600">{book.description}</Text>

              <Pressable
                onPress={handleAddToCart}
                disabled={hasItem(book.id)}
                className={`mt-6 flex-row items-center justify-center rounded-2xl px-5 py-4 ${hasItem(book.id) ? 'bg-emerald-600' : 'bg-slate-950'}`}
                style={{ opacity: hasItem(book.id) ? 0.9 : 1 }}
              >
                <MaterialCommunityIcons name="cart-outline" size={20} color="white" />
                <Text className="ml-2 text-base font-semibold text-white">
                  {hasItem(book.id) ? 'Ya está en el carrito' : 'Añadir al carrito'}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

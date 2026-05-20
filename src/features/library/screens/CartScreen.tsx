import React from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Navbar from '../../../shared/components/Navbar';
import LibraryHeader from '../components/LibraryHeader';
import { purchaseBooks } from '../services/libraryClient';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { useLibraryCart } from '../contexts/LibraryCartContext';
import * as Haptics from 'expo-haptics';

export default function CartScreen({ navigation }: any) {
  const { user } = useAuth();
  const { items, removeItem, clearCart, loading } = useLibraryCart();
  const [processing, setProcessing] = React.useState(false);

  const totalPrice = items.reduce((sum, book) => sum + (book.price ?? 0), 0);

  const handlePurchase = async () => {
    if (!user) {
      Alert.alert('Sesión requerida', 'Debes iniciar sesión para completar la compra.');
      return;
    }

    if (items.length === 0) {
      return;
    }

    try {
      setProcessing(true);
      await purchaseBooks(Number(user.id), items.map((book) => book.id));
      clearCart();
      Alert.alert('Compra realizada', 'Tu pedido se ha completado correctamente.');
      navigation.navigate('Historic');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'No se pudo completar la compra.');
    } finally {
      setProcessing(false);
    }
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

  return (
    <>
      <Navbar navigation={navigation} />
      <SafeAreaView className="flex-1 bg-white" edges={[]}>
        <ScrollView className="flex-1 px-4 pt-4" contentContainerClassName="pb-10">
        <LibraryHeader title="Carrito" navigation={navigation} />

          {items.length === 0 ? (
            <View className="items-center rounded-3xl bg-slate-50 px-5 py-14">
              <MaterialCommunityIcons name="cart-outline" size={56} color="#94a3b8" />
              <Text className="mt-4 text-xl font-semibold text-slate-950">Tu carrito está vacío</Text>
              <Text className="mt-2 text-center text-base leading-6 text-slate-500">
                Añade libros desde el detalle para continuar con la compra.
              </Text>
              <Pressable
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  navigation.navigate('LibraryHome');
                }}
                className="mt-6 rounded-xl bg-slate-950 px-5 py-3 active:opacity-90"
              >
                <Text className="text-base font-semibold text-white">Ir a la librería</Text>
              </Pressable>
            </View>
          ) : (
            <View>
              {items.map((book) => (
                <View key={book.id} className="mb-4 overflow-hidden rounded-2xl bg-white" style={{ elevation: 2 }}>
                  <View className="flex-row">
                    <Image source={{ uri: book.cover }} className="h-32 w-24" resizeMode="cover" />
                    <View className="flex-1 p-4">
                      <Text className="text-base font-semibold text-slate-950" numberOfLines={2}>
                        {book.title}
                      </Text>
                      <Text className="mt-1 text-sm text-slate-500" numberOfLines={1}>
                        {book.author}
                      </Text>
                      <Text className="mt-2 text-lg font-bold text-blue-600">€{book.price.toFixed(2)}</Text>
                      <Pressable
                        onPress={async () => {
                          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                          removeItem(book.id);
                        }}
                        className="mt-3 self-start rounded-lg bg-red-50 px-3 py-2 active:opacity-90"
                      >
                        <Text className="text-sm font-semibold text-red-700">Eliminar</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              ))}

              <View className="mt-2 rounded-3xl bg-slate-950 p-5">
                <Text className="text-base text-slate-300">Total</Text>
                <Text className="mt-1 text-4xl font-bold text-white">€{totalPrice.toFixed(2)}</Text>
                <Pressable
                  onPress={async () => {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    handlePurchase();
                  }}
                  disabled={processing}
                  className="mt-5 items-center rounded-2xl bg-white px-5 py-4 active:opacity-90"
                  style={{ opacity: processing ? 0.8 : 1 }}
                >
                  <Text className="text-base font-semibold text-slate-950">
                    {processing ? 'Procesando...' : 'Comprar ahora'}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

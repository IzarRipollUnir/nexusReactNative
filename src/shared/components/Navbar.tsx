import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import * as Haptics from 'expo-haptics';

export default function Navbar({ navigation }: any) {
  const { user, signOut } = useAuth();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleConfirmLogout = async () => {
    await signOut();
    setLogoutModalOpen(false);
    navigation?.navigate('Main');
  };

  return (
    <SafeAreaView className="bg-blue-600" edges={['top']}>
      <View className="px-4 py-3">
        {/* TOP ROW */}
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              navigation?.navigate('Main');
            }}
          >
            <Text className="text-2xl font-bold text-white">
              NEXUS
            </Text>
          </Pressable>

          {user && (
            <View className="flex-row items-center gap-2">
              <Text className="text-sm font-medium text-white">
                {user.username}
              </Text>

              <Pressable
                onPress={async () => {
                  await Haptics.impactAsync(
                    Haptics.ImpactFeedbackStyle.Medium,
                  );
                  setLogoutModalOpen(true);
                }}
                className="p-2"
              >
                <MaterialCommunityIcons
                  name="logout"
                  size={20}
                  color="white"
                />
              </Pressable>
            </View>
          )}
        </View>

        {/* NAV BUTTONS ROW */}
        <View className="mt-3 flex-row flex-wrap gap-3">
          {user ? (
            <>
              <Pressable
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  navigation?.navigate('Library');
                }}
                className="flex-row items-center rounded-full bg-white/15 px-4 py-2"
              >
                <MaterialCommunityIcons
                  name="book-outline"
                  size={20}
                  color="white"
                />
                <Text className="ml-2 text-white">Librería</Text>
              </Pressable>

              <Pressable
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  navigation?.navigate('Coworking');
                }}
                className="flex-row items-center rounded-full bg-white/15 px-4 py-2"
              >
                <MaterialCommunityIcons
                  name="briefcase-outline"
                  size={20}
                  color="white"
                />
                <Text className="ml-2 text-white">Co-working</Text>
              </Pressable>
            </>
          ) : (
            <Pressable
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                navigation?.navigate('Login');
              }}
              className="rounded-full bg-white/15 px-4 py-2"
            >
              <Text className="text-white">Login</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* MODAL */}
      {logoutModalOpen && (
        <View className="absolute inset-0 z-50 items-center justify-center bg-black/40">
          <View className="w-4/5 rounded-xl bg-white p-6">
            <Text className="text-lg font-bold">
              Cerrar sesión
            </Text>

            <Text className="mt-2 text-gray-600">
              ¿Estás seguro?
            </Text>

            <View className="mt-5 flex-row justify-end gap-3">
              <Pressable
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setLogoutModalOpen(false);
                }}
                className="px-4 py-2"
              >
                <Text>Cancelar</Text>
              </Pressable>

              <Pressable
                onPress={ async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  await handleConfirmLogout();
                }}
                className="rounded-lg bg-red-600 px-4 py-2"
              >
                <Text className="font-bold text-white">
                  Salir
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
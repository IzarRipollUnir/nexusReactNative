import React, { useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import * as Haptics from 'expo-haptics';
type NavbarProps = {
  navigation?: {
    navigate: (route: 'Main' | 'Library' | 'Coworking' | 'Login' | string) => void;
    goBack?: () => void;
  };
};

export default function Navbar({ navigation }: NavbarProps) {
  const { user, signOut } = useAuth();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleRequestLogout = () => {
    setLogoutModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    await signOut();
    setLogoutModalOpen(false);
    navigation?.navigate('Main');
  };

  const handleCloseLogoutModal = () => {
    setLogoutModalOpen(false);
  };

  return (
    <SafeAreaView className="bg-blue-600" edges={['top']}>
      <View className="flex-row items-center justify-between px-4 py-4">
        <Pressable onPress={async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          navigation?.navigate('Main');
        }}>
          <Text className="text-2xl font-bold text-white">NEXUS</Text>
        </Pressable>

        <View className="flex-row items-center gap-4">
          {user ? (
            <>
              <Pressable
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  navigation?.navigate('Library');
                }}
                className="flex-row items-center gap-1 rounded-full px-3 py-2 active:opacity-80"
              >
                <MaterialCommunityIcons name="book-outline" size={20} color="white" />
                <Text className="text-white font-medium">Librería</Text>
              </Pressable>

              <Pressable
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  navigation?.navigate('Coworking');
                }}
                className="flex-row items-center gap-1 rounded-full px-3 py-2 active:opacity-80"
              >
                <MaterialCommunityIcons name="briefcase-outline" size={20} color="white" />
                <Text className="text-white font-medium">Co-working</Text>
              </Pressable>

              <Text className="text-white text-sm font-medium">{user.username}</Text>

              <Pressable
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  handleRequestLogout();
                }}
                className="rounded-full p-2 active:opacity-80"
              >
                <MaterialCommunityIcons name="logout" size={20} color="white" />
              </Pressable>
            </>
          ) : (
            <Pressable
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                navigation?.navigate('Login');
              }}
              className="rounded-full px-3 py-2 active:opacity-80"
            >
              <Text className="text-white font-medium">Login</Text>
            </Pressable>
          )}
        </View>
      </View>

      {logoutModalOpen && (
        <View className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <View className="w-4/5 rounded-xl bg-white p-6">
            <Text className="text-lg font-bold text-gray-800">Cerrar sesión</Text>
            <Text className="mt-2 text-gray-600">¿Estás seguro de que deseas cerrar sesión?</Text>
            <View className="mt-6 flex-row justify-end gap-3">
              <Pressable
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  handleCloseLogoutModal();
                }}
                className="rounded-lg px-4 py-2 active:opacity-80"
              >
                <Text className="text-gray-800 font-medium">Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  handleConfirmLogout();
                }}
                className="rounded-lg bg-red-600 px-4 py-2 active:opacity-90"
              >
                <Text className="text-white font-bold">Cerrar sesión</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

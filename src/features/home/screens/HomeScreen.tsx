import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../shared/contexts/AuthContext';
import Navbar from '../../../shared/components/Navbar';
import * as Haptics from 'expo-haptics';
type ServiceCard = {
  title: string;
  description: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  route?: 'Library' | 'Coworking';
  color: string;
  disabled?: boolean;
};

type HomeScreenProps = {
  navigation?: {
    navigate: (route: 'Library' | 'Coworking' | 'Login') => void;
  };
};

const services: ServiceCard[] = [
  {
    title: 'Librería Universitaria',
    description: 'Accede a miles de libros y revistas académicas',
    icon: 'book-open-page-variant',
    route: 'Library',
    color: '#2563eb',
  },
  {
    title: 'Co-working',
    description: 'Reserva espacios de trabajo colaborativo',
    icon: 'briefcase-outline',
    route: 'Coworking',
    color: '#16a34a',
  },
  {
    title: 'Cafetería',
    description: 'Próximamente disponible',
    icon: 'coffee-outline',
    color: '#f97316',
    disabled: true,
  },
  {
    title: 'Eventos',
    description: 'Próximamente disponible',
    icon: 'calendar-star',
    color: '#a855f7',
    disabled: true,
  },
];

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { user } = useAuth();
  const username = user?.username ?? user?.email?.split('@')[0] ?? 'estudiante';

  const navigateTo = (route?: ServiceCard['route']) => {
    if (!route) {
      return;
    }

    if (!user) {
      navigation?.navigate('Login');
      return;
    }

    navigation?.navigate(route);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={[ 'bottom' ]}>
      <Navbar navigation={navigation} />
      <ScrollView className="flex-1 bg-white" contentContainerClassName="flex-grow px-4 pb-10 pt-4">
        <View className="overflow-hidden rounded-3xl px-6 py-16" style={{ backgroundColor: '#667eea' }}>

          <Text className="text-center text-5xl font-bold leading-tight text-white">
            Bienvenido a NEXUS
          </Text>
          {user && (
            <Text className="mt-3 text-center text-lg font-medium text-white/90">
              Hola, {username}
            </Text>
          )}
          <Text className="mt-4 text-center text-xl text-white/95">
            Tu plataforma universitaria integral
          </Text>
          {!user && (
            <Pressable
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                navigation?.navigate('Login');
              }}
              className="mt-6 self-center rounded-xl bg-white px-6 py-3 active:opacity-90"
              style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}
            >
              <Text className="text-base font-semibold" style={{ color: '#667eea' }}>
                Iniciar Sesión
              </Text>
            </Pressable>
          )}
        </View>

        <View className="mt-8">
          <Text className="text-4xl font-semibold text-slate-950">Nuestros Servicios</Text>
        </View>

        <View className="mt-6 flex-row flex-wrap justify-between">
          {services.map((service) => {
            const enabled = !service.disabled && Boolean(service.route);
            const accentBackground = `${service.color}15`;

            return (
              <Pressable
                key={service.title}
                onPress={async (event) => {
                  event.stopPropagation();
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  navigateTo(service.route);
                }}
                disabled={!enabled}
                className="mb-4 w-[48%] rounded-xl border border-slate-200 bg-white p-5 active:scale-[0.98]"
                style={{
                  opacity: service.disabled ? 0.6 : 1,
                  elevation: 2,
                  shadowColor: '#000000',
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 },
                }}
              >
                <View
                  className="mb-4 h-16 w-16 items-center justify-center self-center rounded-xl"
                  style={{ backgroundColor: accentBackground }}
                >
                  <MaterialCommunityIcons name={service.icon} size={34} color={service.color} />
                </View>

                <Text className="text-center text-lg font-medium text-slate-950">{service.title}</Text>
                <Text className="mt-2 text-center text-sm leading-5 text-slate-500">{service.description}</Text>

                <View
                  className={`mt-4 self-center rounded-md border px-4 py-2 ${service.disabled ? 'border-slate-200 bg-slate-100' : 'bg-transparent'}`}
                  style={enabled ? { borderColor: service.color } : undefined}
                >
                  <Text className={`text-sm font-medium ${service.disabled ? 'text-slate-500' : 'font-semibold'}`} style={enabled ? { color: service.color } : undefined}>
                    {service.disabled ? 'Próximamente' : 'Acceder'}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

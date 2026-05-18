import React, { useEffect, useState } from 'react';
import * as Haptics from 'expo-haptics';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../../../shared/components/Navbar';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { CoworkingSpaceModal } from '../components/CoworkingSpaceModal';
import { ReservationModal } from '../components/ReservationModal';
import { coworkingService } from '../services/coworkingService';
import type { CoworkingSpace, Reservation } from '../types';

function formatTime(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export default function CoworkingHomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const [spaces, setSpaces] = useState<CoworkingSpace[]>([]);
  const [loadingSpaces, setLoadingSpaces] = useState(true);
  const [myReservations, setMyReservations] = useState<Reservation[]>([]);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [selectedSpaceId, setSelectedSpaceId] = useState<number | null>(null);
  const [spaceModalOpen, setSpaceModalOpen] = useState(false);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [selectedSpaceForReservation, setSelectedSpaceForReservation] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<Reservation | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadSpaces = async () => {
    setLoadingSpaces(true);
    try {
      const data = await coworkingService.getSpaces();
      setSpaces(data);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoadingSpaces(false);
    }
  };

  const loadReservations = async () => {
    if (!user?.id) return;
    setLoadingReservations(true);
    try {
      const data = await coworkingService.getReservations(String(user.id));
      setMyReservations(data);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoadingReservations(false);
    }
  };

  useEffect(() => {
    loadSpaces();
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadReservations();
    }
  }, [user]);

  const handleSpacePress = (spaceId: number) => {
    setSelectedSpaceId(spaceId);
    setSpaceModalOpen(true);
  };

  const handleReserve = (spaceId: number) => {
    setSelectedSpaceForReservation(spaceId);
    setEditingReservation(null);
    setReservationModalOpen(true);
  };

  const handleEditReservation = (reservation: Reservation) => {
    setSelectedSpaceForReservation(reservation.spaceId);
    setEditingReservation(reservation);
    setReservationModalOpen(true);
  };

  const handleRequestDeleteReservation = (reservation: Reservation) => {
    setReservationToDelete(reservation);
    setDeleteModalOpen(true);
  };

  const handleConfirmDeleteReservation = async () => {
    if (!reservationToDelete) return;
    setActionError(null);
    try {
      await coworkingService.deleteReservation(String(reservationToDelete.id));
      setDeleteModalOpen(false);
      setReservationToDelete(null);
      await loadSpaces();
      await loadReservations();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'No se pudo eliminar la reserva');
    }
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setReservationToDelete(null);
  };

  const handleReservationSaved = async () => {
    await loadSpaces();
    await loadReservations();
  };

  return (
    <>
      <Navbar navigation={navigation} />
      <SafeAreaView className="flex-1 bg-slate-50" edges={['bottom']}>
        <ScrollView className="flex-1 px-4 pt-4" contentContainerClassName="pb-10">
          <Text className="text-3xl font-semibold text-slate-950">Espacios de Co-working</Text>
          <Text className="mt-2 text-base text-slate-600">Reserva tu espacio de trabajo colaborativo</Text>

          {loadingSpaces ? (
            <View className="items-center justify-center py-10">
              <ActivityIndicator size="large" color="#2563eb" />
            </View>
          ) : (
            <View className="mt-4 flex-row flex-wrap justify-between gap-3">
              {spaces.map((space) => {
                const isOccupied = space.occupied;
                return (
                  <Pressable
                    key={space.id}
                    onPress={async (event) => {
                      event.stopPropagation();
                      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      handleSpacePress(space.id);
                    }}
                    className="w-full overflow-hidden rounded-3xl bg-white p-4 shadow-sm"
                    style={{ elevation: 2, borderWidth: 2, borderColor: isOccupied ? '#dc2626' : '#15803d' }}
                  >
                    <View className="flex-row items-center justify-between">
                      <Text className="text-lg font-semibold text-slate-950">{space.name}</Text>
                      <View
                        className="rounded-full px-3 py-1"
                        style={{ backgroundColor: isOccupied ? '#fee2e2' : '#d1fae5' }}
                      >
                        <Text style={{ color: isOccupied ? '#b91c1c' : '#166534', fontWeight: '700' }}>
                          {isOccupied ? 'Ocupado' : 'Disponible'}
                        </Text>
                      </View>
                    </View>

                    <View className="mt-3 flex-row items-center gap-2">
                      <Text className="text-sm text-slate-600">👥</Text>
                      <Text className="text-sm text-slate-700">Capacidad: {space.capacity} personas</Text>
                    </View>

                    {isOccupied ? (
                      <View className="mt-3 rounded-2xl bg-slate-100 p-3">
                        <Text className="text-sm font-semibold text-slate-800">Reserva activa</Text>
                        <Text className="mt-1 text-sm text-slate-700">{space.reservedBy}</Text>
                        <Text className="mt-1 text-sm text-slate-500">
                          {formatTime(space.startTime)} → {formatTime(space.endTime)}
                        </Text>
                      </View>
                    ) : (
                      <Pressable
                        onPress={async (event) => {
                          event.stopPropagation();
                          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                          handleReserve(space.id);
                        }}
                        className="mt-4 rounded-2xl bg-blue-600 px-4 py-3"
                        style={{ minWidth: 92 }}
                      >
                        <Text className="text-center text-sm font-semibold text-white">Reservar</Text>
                      </Pressable>
                    )}

                    <View className="mt-4 flex-row flex-wrap gap-2">
                      {space.features?.map((feature) => (
                        <View key={feature} className="rounded-full bg-slate-200 px-3 py-1">
                          <Text className="text-xs text-slate-600">{feature}</Text>
                        </View>
                      ))}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}

          <Text className="mt-8 text-2xl font-semibold text-slate-950">Mis reservas</Text>

          {loadingReservations ? (
            <View className="items-center justify-center py-10">
              <ActivityIndicator size="small" color="#2563eb" />
            </View>
          ) : myReservations.length === 0 ? (
            <Text className="mt-3 text-sm text-slate-500">No tienes reservas activas</Text>
          ) : (
            <View className="mt-3 space-y-3">
              {myReservations.map((reservation) => (
                <View key={String(reservation.id)} className="rounded-3xl bg-white p-4 shadow-sm" style={{ elevation: 2 }}>
                  <Text className="text-sm text-slate-500">
                    ⏰ {formatTime(reservation.startTime)} → {formatTime(reservation.endTime)}
                  </Text>
                  <View className="mt-3 flex-row gap-3">
                    <Pressable
                      onPress={async  () => {
                        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        handleEditReservation(reservation);
                      }}
                      className="rounded-full bg-blue-600 px-4 py-2"
                    >
                      <Text className="text-sm font-semibold text-white">Editar</Text>
                    </Pressable>
                    <Pressable
                      onPress={async () => {
                        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        handleRequestDeleteReservation(reservation);
                      }}
                      className="rounded-full bg-red-600 px-4 py-2"
                    >
                      <Text className="text-sm font-semibold text-white">Eliminar</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}

          {actionError ? (
            <Text className="mt-4 text-sm text-red-600">{actionError}</Text>
          ) : null}
        </ScrollView>
      </SafeAreaView>

      <CoworkingSpaceModal
        open={spaceModalOpen}
        spaceId={selectedSpaceId}
        onClose={() => {
          setSpaceModalOpen(false);
          setSelectedSpaceId(null);
        }}
      />

      <ReservationModal
        open={reservationModalOpen}
        onClose={() => setReservationModalOpen(false)}
        spaceId={selectedSpaceForReservation ?? selectedSpaceId ?? 0}
        existingReservation={editingReservation ?? undefined}
        onSaved={handleReservationSaved}
      />

      <Modal animationType="fade" transparent visible={deleteModalOpen} onRequestClose={closeDeleteModal}>
        <View className="flex-1 items-center justify-center bg-black/30 px-4">
          <View className="w-full rounded-3xl bg-white p-6 shadow-lg" style={{ elevation: 8 }}>
            <Text className="text-lg font-semibold text-slate-950">Eliminar reserva</Text>
            <Text className="mt-3 text-slate-600">¿Estás seguro de que deseas eliminar esta reserva?</Text>
            {reservationToDelete ? (
              <Text className="mt-3 text-sm text-slate-500">
                ⏰ {formatTime(reservationToDelete.startTime)} → {formatTime(reservationToDelete.endTime)}
              </Text>
            ) : null}
            <View className="mt-6 flex-row justify-end gap-3">
              <Pressable onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                closeDeleteModal();
              }} className="rounded-2xl px-4 py-3 bg-slate-100">
                <Text className="text-sm font-semibold text-slate-700">Cancelar</Text>
              </Pressable>
              <Pressable onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                handleConfirmDeleteReservation();
              }} className="rounded-2xl bg-red-600 px-4 py-3">
                <Text className="text-sm font-semibold text-white">Eliminar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

import React, { useEffect, useState } from 'react';
import * as Haptics from 'expo-haptics';
import {
  Modal,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Pressable,
} from 'react-native';

import { useAuth } from '../../../shared/contexts/AuthContext';
import { coworkingService } from '../services/coworkingService';
import type { Reservation } from '../types';

type Props = {
  open: boolean;
  onClose: () => void;
  spaceId: number;
  existingReservation?: Reservation;
  onSaved?: () => void;
};

function formatDateTimeInput(value?: string) {
  if (!value) return '';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${minute}`;
}

function parseDateTime(value: string) {
  const normalized = value.trim().replace(' ', 'T');
  const date = new Date(normalized);

  return Number.isNaN(date.getTime()) ? null : date;
}

export const ReservationModal = ({
  open,
  onClose,
  spaceId,
  existingReservation,
  onSaved,
}: Props) => {
  const { user } = useAuth();

  const [startText, setStartText] = useState('');
  const [endText, setEndText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isEditing = Boolean(existingReservation?.id);

  useEffect(() => {
    if (existingReservation) {
      setStartText(formatDateTimeInput(existingReservation.startTime));
      setEndText(formatDateTimeInput(existingReservation.endTime));
    } else {
      const now = new Date();
      const nextHour = new Date(now.getTime() + 60 * 60 * 1000);

      const defaultStart = `${now.getFullYear()}-${String(
        now.getMonth() + 1,
      ).padStart(2, '0')}-${String(now.getDate()).padStart(
        2,
        '0',
      )} ${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes(),
      ).padStart(2, '0')}`;

      const defaultEnd = `${nextHour.getFullYear()}-${String(
        nextHour.getMonth() + 1,
      ).padStart(2, '0')}-${String(nextHour.getDate()).padStart(
        2,
        '0',
      )} ${String(nextHour.getHours()).padStart(2, '0')}:${String(
        nextHour.getMinutes(),
      ).padStart(2, '0')}`;

      setStartText(defaultStart);
      setEndText(defaultEnd);
    }

    setError(null);
  }, [existingReservation, open]);

  const title = isEditing ? 'Editar reserva' : 'Nueva reserva';
  const buttonText = isEditing ? 'Actualizar' : 'Reservar';

  const handleSave = async () => {
    setError(null);

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const startDate = parseDateTime(startText);
    const endDate = parseDateTime(endText);

    if (!startDate || !endDate) {
      setError('Debes usar el formato YYYY-MM-DD HH:mm');
      return;
    }

    if (endDate.getTime() <= startDate.getTime()) {
      setError('La hora de fin debe ser posterior a la hora de inicio');
      return;
    }

    if (!user) {
      setError('No se encontró usuario autenticado.');
      return;
    }

    const reservation: Reservation = {
      spaceId,
      user: user.username,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      ...(existingReservation?.id
        ? { id: existingReservation.id }
        : {}),
    };

    try {
      setLoading(true);

      if (existingReservation?.id) {
        await coworkingService.updateReservation(
          String(existingReservation.id),
          reservation,
        );
      } else {
        await coworkingService.createReservation(reservation);
      }

      onSaved?.();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo guardar la reserva',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={open}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center bg-black/35 p-4">
        <View className="overflow-hidden rounded-3xl bg-white">
          <View className="flex-row items-center justify-between border-b border-gray-200 p-4">
            <Text className="text-lg font-bold text-gray-900">
              {title}
            </Text>

            <Pressable
              className="px-3 py-1.5"
              onPress={async (event) => {
                event.stopPropagation();

                await Haptics.impactAsync(
                  Haptics.ImpactFeedbackStyle.Medium,
                );

                onClose();
              }}
            >
              <Text className="font-bold text-blue-600">
                Cerrar
              </Text>
            </Pressable>
          </View>

          <View className="p-4">
            <Text className="mb-1.5 text-sm text-gray-700">
              Hora de inicio
            </Text>

            <TextInput
              className="mb-4 rounded-2xl border border-slate-300 p-3 text-slate-900"
              value={startText}
              onChangeText={setStartText}
              placeholder="YYYY-MM-DD HH:mm"
              keyboardType="default"
            />

            <Text className="mb-1.5 text-sm text-gray-700">
              Hora de fin
            </Text>

            <TextInput
              className="mb-4 rounded-2xl border border-slate-300 p-3 text-slate-900"
              value={endText}
              onChangeText={setEndText}
              placeholder="YYYY-MM-DD HH:mm"
              keyboardType="default"
            />

            {error ? (
              <Text className="mb-3 text-red-700">
                {error}
              </Text>
            ) : null}

            <Pressable
              disabled={loading}
              className={`mt-2 items-center rounded-2xl py-3.5 ${
                loading ? 'bg-slate-400' : 'bg-blue-600'
              }`}
              onPress={async (event) => {
                event.stopPropagation();

                await Haptics.impactAsync(
                  Haptics.ImpactFeedbackStyle.Medium,
                );

                await handleSave();
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-base font-bold text-white">
                  {buttonText}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};
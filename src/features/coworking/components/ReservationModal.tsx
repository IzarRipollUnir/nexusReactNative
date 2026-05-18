import React, { useEffect, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { Modal, View, Text, TextInput, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
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
      const defaultStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const defaultEnd = `${nextHour.getFullYear()}-${String(nextHour.getMonth() + 1).padStart(2, '0')}-${String(nextHour.getDate()).padStart(2, '0')} ${String(nextHour.getHours()).padStart(2, '0')}:${String(nextHour.getMinutes()).padStart(2, '0')}`;
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
      ...(existingReservation?.id ? { id: existingReservation.id } : {}),
    };

    try {
      setLoading(true);
      if (existingReservation?.id) {
        await coworkingService.updateReservation(String(existingReservation.id), reservation);
      } else {
        await coworkingService.createReservation(reservation);
      }
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la reserva');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal animationType="slide" transparent visible={open} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalWrapper}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={async (event) => {
              event.stopPropagation();
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onClose();
            }} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>Cerrar</Text>
            </Pressable>
          </View>

          <View style={styles.content}>
            <Text style={styles.label}>Hora de inicio</Text>
            <TextInput
              style={styles.input}
              value={startText}
              onChangeText={setStartText}
              placeholder="YYYY-MM-DD HH:mm"
              keyboardType="default"
            />

            <Text style={styles.label}>Hora de fin</Text>
            <TextInput
              style={styles.input}
              value={endText}
              onChangeText={setEndText}
              placeholder="YYYY-MM-DD HH:mm"
              keyboardType="default"
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable onPress={async (event) => {
              event.stopPropagation();
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              await handleSave();
            }} style={[styles.button, loading && styles.buttonDisabled]} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>{buttonText}</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 16,
  },
  modalWrapper: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  headerButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  headerButtonText: {
    color: '#2563eb',
    fontWeight: '700',
  },
  content: {
    padding: 16,
  },
  label: {
    color: '#374151',
    marginBottom: 6,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    color: '#0f172a',
  },
  error: {
    color: '#b91c1c',
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
    borderRadius: 14,
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

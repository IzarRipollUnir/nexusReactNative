import React, { useEffect, useState } from 'react';
import { Modal, View, Text, ScrollView, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { coworkingService } from '../services/coworkingService';
import type { CoworkingSpace } from '../types';
import * as Haptics from 'expo-haptics';
type Props = {
  open: boolean;
  spaceId: number | null;
  onClose: () => void;
};

function formatTime(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export const CoworkingSpaceModal = ({ open, spaceId, onClose }: Props) => {
  const [space, setSpace] = useState<CoworkingSpace | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    if (!open || spaceId === null) {
      setSpace(null);
      return;
    }

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await coworkingService.getSpaceById(String(spaceId));
        if (mounted) {
          setSpace(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'No se pudieron cargar los detalles');
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
  }, [open, spaceId]);

  return (
    <Modal animationType="slide" transparent visible={open} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalWrapper}>
          <View style={styles.header}>
            <Text style={styles.title}>Detalle del espacio</Text>
            <Pressable onPress={async (event) => {
              event.stopPropagation();
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onClose();
            }} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>Cerrar</Text>
            </Pressable>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2563eb" />
            </View>
          ) : error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.content}>
              {space ? (
                <>
                  <Text style={styles.spaceTitle}>{space.name}</Text>
                  <View style={styles.row}>
                    <Text style={styles.label}>Capacidad:</Text>
                    <Text style={styles.value}>{space.capacity} personas</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Descripción:</Text>
                    <Text style={styles.value}>{space.description ?? 'Sin descripción'}</Text>
                  </View>

                  {space.occupied && (
                    <View style={styles.box}>
                      <Text style={styles.subTitle}>Reserva actual</Text>
                      <Text style={styles.value}>{space.reservedBy ?? 'Usuario desconocido'}</Text>
                      <Text style={styles.value}>
                        {formatTime(space.startTime)} → {formatTime(space.endTime)}
                      </Text>
                    </View>
                  )}

                  <View style={styles.featuresContainer}>
                    {space.features?.map((feature) => (
                      <View key={feature} style={styles.featureTag}>
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>
                </>
              ) : (
                <Text style={styles.emptyText}>Selecciona un espacio para ver detalles.</Text>
              )}
            </ScrollView>
          )}
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
    maxHeight: '85%',
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
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  headerButtonText: {
    color: '#2563eb',
    fontWeight: '700',
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  errorBox: {
    padding: 20,
  },
  errorText: {
    color: '#b91c1c',
  },
  content: {
    padding: 16,
  },
  spaceTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  row: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    color: '#111827',
    lineHeight: 22,
  },
  box: {
    marginTop: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#f3f4f6',
  },
  subTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
    color: '#0f172a',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  featureTag: {
    backgroundColor: '#e2e8f0',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  featureText: {
    color: '#334155',
    fontSize: 13,
  },
  emptyText: {
    color: '#475569',
    fontSize: 15,
  },
});

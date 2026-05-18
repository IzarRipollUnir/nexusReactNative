import { apiClient } from '../../../shared/api/apiClient';
import type { CoworkingSpace, Reservation } from '../types';

export const coworkingService = {
  getSpaces: () => apiClient.get<CoworkingSpace[]>('/coworking/spaces'),

  getSpaceById: (id: string) => apiClient.get<CoworkingSpace>(`/coworking/spaces/${id}`),

  createReservation: (reservation: Reservation) => apiClient.post<Reservation>('/coworking/reservations', reservation),

  deleteReservation: (id: string) => apiClient.del(`/coworking/reservations/${id}`),

  updateReservation: (id: string, data: Reservation) => apiClient.put<Reservation>(`/coworking/reservations/${id}`, data),

  getReservations: (userId: string) => apiClient.get<Reservation[]>(`/coworking/${userId}/reservations`),
};

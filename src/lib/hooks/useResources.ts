'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { env } from '@/env';
import { Room, Reservation, DayPass, DashboardStats } from '@/types/models';
import { CreateReservationRequest, CreateDayPassRequest } from '@/types/api';

const apiClient = axios.create({
  baseURL: env.API_URL,
});

// Rooms
export function useRooms() {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: Room[] }>('/api/rooms');
      return response.data.data;
    },
  });
}

export function useRoom(id: string) {
  return useQuery({
    queryKey: ['room', id],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: Room }>(
        `/api/rooms/${id}`
      );
      return response.data.data;
    },
  });
}

// Reservations
export function useReservations() {
  return useQuery({
    queryKey: ['reservations'],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: Reservation[] }>(
        '/api/reservations'
      );
      return response.data.data;
    },
  });
}

export function useCreateReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateReservationRequest) => {
      const response = await apiClient.post<{ success: boolean; data: Reservation }>(
        '/api/reservations',
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

// Day Passes
export function useDayPasses() {
  return useQuery({
    queryKey: ['dayPasses'],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: DayPass[] }>(
        '/api/day-passes'
      );
      return response.data.data;
    },
  });
}

export function useCreateDayPass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateDayPassRequest) => {
      const response = await apiClient.post<{ success: boolean; data: DayPass }>(
        '/api/day-passes',
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dayPasses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

// Dashboard Stats
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: DashboardStats }>(
        '/api/reports/dashboard'
      );
      return response.data.data;
    },
    refetchInterval: 30000, // Refrescar cada 30 segundos
  });
}

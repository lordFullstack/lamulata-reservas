import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Contraseña mínimo 6 caracteres'),
});

export const createRoomSchema = z.object({
  number: z.string().min(1, 'Número requerido'),
  floor: z.number().int().min(0).max(3),
  type: z.enum([
    'double',
    'triple',
    'quadruple',
    'quintuple',
    'sextuple',
    'seven_person',
    'cabin_a',
    'cabin_b',
  ]),
  capacity: z.number().int().min(1).max(16),
});

export const createReservationSchema = z.object({
  roomId: z.string().uuid('ID de habitación inválido'),
  guestName: z.string().min(3, 'Nombre mínimo 3 caracteres'),
  guestDocument: z.string().min(8, 'Documento inválido'),
  guestPhone: z.string().min(10, 'Teléfono inválido'),
  checkInDate: z.string().datetime(),
  checkOutDate: z.string().datetime(),
  guestCount: z.number().int().min(1),
  advance: z.number().min(0),
  observations: z.string().optional(),
});

export const createDayPassSchema = z.object({
  guestName: z.string().min(3, 'Nombre mínimo 3 caracteres'),
  guestPhone: z.string().min(10, 'Teléfono inválido'),
  date: z.string().datetime(),
  guestCount: z.number().int().min(1),
  observations: z.string().optional(),
});

export const updateReservationStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled']),
});

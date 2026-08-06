import { RoomStatus, RoomType } from './enums';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'staff';
  createdAt: Date;
  updatedAt: Date;
}

export interface Room {
  id: string;
  number: string;
  floor: number;
  type: RoomType;
  capacity: number;
  status: RoomStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reservation {
  id: string;
  userId: string;
  roomId: string;
  guestName: string;
  guestDocument: string;
  guestPhone: string;
  checkInDate: Date;
  checkOutDate: Date;
  guestCount: number;
  advance: number;
  observations?: string;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface DayPass {
  id: string;
  userId: string;
  guestName: string;
  guestPhone: string;
  date: Date;
  guestCount: number;
  unitPrice: number;
  total: number;
  observations?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  availableRooms: number;
  occupiedRooms: number;
  reservationsToday: number;
  dayPassesToday: number;
  mealsRequired: number;
  dailyIncome: number;
}

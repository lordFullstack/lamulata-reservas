import { Database } from '@/lib/db/client';
import { Reservation } from '@/types/models';
import { RoomStatus, DAY_PASS_UNIT_PRICE } from '@/types/enums';
import { CreateReservationRequest } from '@/types/api';
import { RoomService } from './RoomService';

export class ReservationService {
  static async getAllReservations(): Promise<Reservation[]> {
    return Database.reservations.findAll();
  }

  static async getReservationById(id: string): Promise<Reservation | null> {
    return Database.reservations.findById(id);
  }

  static async createReservation(
    userId: string,
    data: CreateReservationRequest
  ): Promise<Reservation> {
    // Validar que no haya superposición
    const overlap = await Database.reservations.checkOverlap(
      data.roomId,
      new Date(data.checkInDate),
      new Date(data.checkOutDate)
    );

    if (overlap) {
      throw new Error('La habitación tiene conflicto de fechas');
    }

    // Validar que la habitación existe
    const room = await Database.rooms.findById(data.roomId);
    if (!room) {
      throw new Error('Habitación no encontrada');
    }

    // Crear reserva
    const reservation = await Database.reservations.create({
      userId,
      roomId: data.roomId,
      guestName: data.guestName,
      guestDocument: data.guestDocument,
      guestPhone: data.guestPhone,
      checkInDate: new Date(data.checkInDate),
      checkOutDate: new Date(data.checkOutDate),
      guestCount: data.guestCount,
      advance: data.advance,
      observations: data.observations,
      status: 'confirmed',
    });

    // Actualizar estado de la habitación
    await this.updateRoomStatusForReservation(reservation);

    return reservation;
  }

  static async updateReservationStatus(
    id: string,
    status: Reservation['status']
  ): Promise<Reservation> {
    const reservation = await Database.reservations.findById(id);
    if (!reservation) {
      throw new Error('Reserva no encontrada');
    }

    const updated = await Database.reservations.update(id, { status });

    // Actualizar estado de la habitación
    await this.updateRoomStatusForReservation(updated);

    return updated;
  }

  static async deleteReservation(id: string): Promise<void> {
    const reservation = await Database.reservations.findById(id);
    if (!reservation) {
      throw new Error('Reserva no encontrada');
    }

    await this.updateReservationStatus(id, 'cancelled');
  }

  static async getTodayReservations(): Promise<Reservation[]> {
    return Database.reservations.getTodayReservations();
  }

  static async getReservationsByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<Reservation[]> {
    return Database.reservations.findByDateRange(startDate, endDate);
  }

  static async getReservationsByRoom(roomId: string): Promise<Reservation[]> {
    return Database.reservations.findByRoomId(roomId);
  }

  private static async updateRoomStatusForReservation(
    reservation: Reservation
  ): Promise<void> {
    if (reservation.status === 'cancelled') {
      await Database.rooms.update(reservation.roomId, { status: RoomStatus.AVAILABLE });
      return;
    }

    const now = new Date();
    const checkIn = new Date(reservation.checkInDate);
    const checkOut = new Date(reservation.checkOutDate);

    let newStatus: RoomStatus;
    if (checkIn <= now && checkOut > now) {
      newStatus = RoomStatus.OCCUPIED;
    } else if (checkIn > now) {
      newStatus = RoomStatus.RESERVED;
    } else {
      newStatus = RoomStatus.AVAILABLE;
    }

    await Database.rooms.update(reservation.roomId, { status: newStatus });
  }

  static async getMealsRequiredToday(): Promise<number> {
    const reservations = await this.getTodayReservations();
    return reservations.reduce((acc, res) => {
      if (res.status === 'checked_in' || res.status === 'confirmed') {
        return acc + res.guestCount;
      }
      return acc;
    }, 0);
  }
}

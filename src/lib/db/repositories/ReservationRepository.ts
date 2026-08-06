import { randomUUID } from 'crypto';
import { Reservation } from '@/types/models';
import { BaseRepository } from './BaseRepository';
import { isBefore, isAfter, isEqual } from 'date-fns';

export class ReservationRepository extends BaseRepository<Reservation> {
  protected tableName = 'reservations';
  private static store: Map<string, Reservation> = new Map();

  async create(
    data: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Reservation> {
    const reservation: Reservation = {
      ...data,
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    ReservationRepository.store.set(reservation.id, reservation);
    return reservation;
  }

  async findById(id: string): Promise<Reservation | null> {
    return ReservationRepository.store.get(id) || null;
  }

  async findAll(): Promise<Reservation[]> {
    return Array.from(ReservationRepository.store.values());
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Reservation[]> {
    return Array.from(ReservationRepository.store.values()).filter((res) => {
      const resStart = new Date(res.checkInDate);
      const resEnd = new Date(res.checkOutDate);
      return (
        (isAfter(resStart, startDate) || isEqual(resStart, startDate)) &&
        (isBefore(resEnd, endDate) || isEqual(resEnd, endDate))
      );
    });
  }

  async findByRoomId(roomId: string): Promise<Reservation[]> {
    return Array.from(ReservationRepository.store.values()).filter(
      (res) => res.roomId === roomId && res.status !== 'cancelled'
    );
  }

  async findByRoomIdAndDateRange(
    roomId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Reservation[]> {
    const byRoom = await this.findByRoomId(roomId);
    return byRoom.filter((res) => {
      const resStart = new Date(res.checkInDate);
      const resEnd = new Date(res.checkOutDate);
      const end = new Date(endDate);
      const start = new Date(startDate);

      return !(isBefore(resEnd, start) || isAfter(resStart, end));
    });
  }

  async checkOverlap(roomId: string, checkIn: Date, checkOut: Date): Promise<boolean> {
    const overlaps = await this.findByRoomIdAndDateRange(
      roomId,
      checkIn,
      checkOut
    );
    return overlaps.length > 0;
  }

  async update(id: string, data: Partial<Reservation>): Promise<Reservation> {
    const reservation = ReservationRepository.store.get(id);
    if (!reservation) throw new Error(`Reservation ${id} not found`);

    const updated: Reservation = {
      ...reservation,
      ...data,
      updatedAt: new Date(),
    };
    ReservationRepository.store.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    ReservationRepository.store.delete(id);
  }

  async getTodayReservations(): Promise<Reservation[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return Array.from(ReservationRepository.store.values()).filter((res) => {
      const checkIn = new Date(res.checkInDate);
      const checkOut = new Date(res.checkOutDate);
      checkIn.setHours(0, 0, 0, 0);
      checkOut.setHours(0, 0, 0, 0);

      return (
        (isEqual(checkIn, today) || isEqual(checkOut, today)) &&
        res.status !== 'cancelled'
      );
    });
  }
}

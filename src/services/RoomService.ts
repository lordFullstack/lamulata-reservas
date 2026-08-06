import { Database } from '@/lib/db/client';
import { Room, Reservation } from '@/types/models';
import { RoomStatus } from '@/types/enums';
import { CreateRoomRequest } from '@/types/api';

export class RoomService {
  static async getAllRooms(): Promise<Room[]> {
    return Database.rooms.findAll();
  }

  static async getRoomById(id: string): Promise<Room | null> {
    return Database.rooms.findById(id);
  }

  static async getRoomsByStatus(status: RoomStatus): Promise<Room[]> {
    return Database.rooms.findByStatus(status);
  }

  static async getRoomsByFloor(floor: number): Promise<Room[]> {
    return Database.rooms.findByFloor(floor);
  }

  static async createRoom(data: CreateRoomRequest): Promise<Room> {
    return Database.rooms.create(data);
  }

  static async updateRoomStatus(id: string, status: RoomStatus): Promise<Room> {
    return Database.rooms.update(id, { status });
  }

  static async getAvailableRooms(): Promise<Room[]> {
    return Database.rooms.findByStatus(RoomStatus.AVAILABLE);
  }

  static async getOccupiedRooms(): Promise<Room[]> {
    return Database.rooms.findByStatus(RoomStatus.OCCUPIED);
  }

  static async getStats(): Promise<{
    total: number;
    available: number;
    occupied: number;
    reserved: number;
  }> {
    const all = await this.getAllRooms();
    const available = await this.getAvailableRooms();
    const occupied = await this.getOccupiedRooms();
    const reserved = await Database.rooms.findByStatus(RoomStatus.RESERVED);

    return {
      total: all.length,
      available: available.length,
      occupied: occupied.length,
      reserved: reserved.length,
    };
  }

  static updateRoomStatusFromReservation(
    reservation: Reservation,
    newStatus: 'active' | 'cancelled'
  ): RoomStatus {
    if (newStatus === 'cancelled') {
      return RoomStatus.AVAILABLE;
    }

    const now = new Date();
    if (new Date(reservation.checkInDate) <= now && new Date(reservation.checkOutDate) > now) {
      return RoomStatus.OCCUPIED;
    }

    return RoomStatus.RESERVED;
  }
}

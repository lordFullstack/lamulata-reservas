import { randomUUID } from 'crypto';
import { Room } from '@/types/models';
import { RoomStatus, RoomType, Floor, ROOM_INVENTORY } from '@/types/enums';
import { BaseRepository } from './BaseRepository';

export class RoomRepository extends BaseRepository<Room> {
  protected tableName = 'rooms';
  private static store: Map<string, Room> = new Map();

  async create(data: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>): Promise<Room> {
    const room: Room = {
      ...data,
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    RoomRepository.store.set(room.id, room);
    return room;
  }

  async findById(id: string): Promise<Room | null> {
    return RoomRepository.store.get(id) || null;
  }

  async findAll(): Promise<Room[]> {
    return Array.from(RoomRepository.store.values()).sort((a, b) => 
      parseInt(a.number) - parseInt(b.number)
    );
  }

  async findByStatus(status: RoomStatus): Promise<Room[]> {
    return Array.from(RoomRepository.store.values()).filter(
      (room) => room.status === status
    );
  }

  async findByFloor(floor: number): Promise<Room[]> {
    return Array.from(RoomRepository.store.values()).filter(
      (room) => room.floor === floor
    );
  }

  async findByType(type: RoomType): Promise<Room[]> {
    return Array.from(RoomRepository.store.values()).filter(
      (room) => room.type === type
    );
  }

  async update(id: string, data: Partial<Room>): Promise<Room> {
    const room = RoomRepository.store.get(id);
    if (!room) throw new Error(`Room ${id} not found`);

    const updated: Room = {
      ...room,
      ...data,
      updatedAt: new Date(),
    };
    RoomRepository.store.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    RoomRepository.store.delete(id);
  }

  static async seed(): Promise<void> {
    if (RoomRepository.store.size > 0) return;

    for (const [floor, types] of Object.entries(ROOM_INVENTORY)) {
      const floorNum = parseInt(floor) as Floor;

      for (const [type, config] of Object.entries(types)) {
        const roomType = type as RoomType;
        const { numbers } = config;

        for (const number of numbers) {
          const capacity = roomType === 'cabin_a' ? 16 : roomType === 'cabin_b' ? 9 : 
                          roomType === 'seven_person' ? 7 : roomType === 'sextuple' ? 6 :
                          roomType === 'quintuple' ? 5 : roomType === 'quadruple' ? 4 :
                          roomType === 'triple' ? 3 : 2;

          await new RoomRepository().create({
            number,
            floor: floorNum,
            type: roomType,
            capacity,
            status: RoomStatus.AVAILABLE,
          });
        }
      }
    }
  }
}

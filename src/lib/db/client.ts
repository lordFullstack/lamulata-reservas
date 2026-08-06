import { UserRepository } from './repositories/UserRepository';
import { RoomRepository } from './repositories/RoomRepository';
import { ReservationRepository } from './repositories/ReservationRepository';
import { DayPassRepository } from './repositories/DayPassRepository';

let isInitialized = false;

export class Database {
  static readonly users = new UserRepository();
  static readonly rooms = new RoomRepository();
  static readonly reservations = new ReservationRepository();
  static readonly dayPasses = new DayPassRepository();

  static async initialize(): Promise<void> {
    if (isInitialized) return;

    await UserRepository.seedAdmin();
    await RoomRepository.seed();

    isInitialized = true;
  }

  static reset(): void {
    isInitialized = false;
    // En memoria, solo resetear el flag. Los datos persisten dentro de la ejecución
  }
}

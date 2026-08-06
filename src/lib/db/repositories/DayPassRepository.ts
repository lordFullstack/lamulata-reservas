import { DayPass } from '@/types/models';
import { BaseRepository } from './BaseRepository';
import { v4 as uuidv4 } from 'crypto';
import { isEqual, startOfDay, endOfDay } from 'date-fns';

export class DayPassRepository extends BaseRepository<DayPass> {
  protected tableName = 'day_passes';
  private static store: Map<string, DayPass> = new Map();

  async create(data: Omit<DayPass, 'id' | 'createdAt' | 'updatedAt'>): Promise<DayPass> {
    const dayPass: DayPass = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    DayPassRepository.store.set(dayPass.id, dayPass);
    return dayPass;
  }

  async findById(id: string): Promise<DayPass | null> {
    return DayPassRepository.store.get(id) || null;
  }

  async findAll(): Promise<DayPass[]> {
    return Array.from(DayPassRepository.store.values());
  }

  async findByDate(date: Date): Promise<DayPass[]> {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    return Array.from(DayPassRepository.store.values()).filter((pass) => {
      const passDate = new Date(pass.date);
      passDate.setHours(0, 0, 0, 0);
      return isEqual(passDate, targetDate);
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<DayPass[]> {
    const start = startOfDay(new Date(startDate));
    const end = endOfDay(new Date(endDate));

    return Array.from(DayPassRepository.store.values()).filter((pass) => {
      const passDate = new Date(pass.date);
      return passDate >= start && passDate <= end;
    });
  }

  async update(id: string, data: Partial<DayPass>): Promise<DayPass> {
    const dayPass = DayPassRepository.store.get(id);
    if (!dayPass) throw new Error(`Day pass ${id} not found`);

    const updated: DayPass = {
      ...dayPass,
      ...data,
      updatedAt: new Date(),
    };
    DayPassRepository.store.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    DayPassRepository.store.delete(id);
  }

  async getTodayPasses(): Promise<DayPass[]> {
    const today = new Date();
    return this.findByDate(today);
  }
}

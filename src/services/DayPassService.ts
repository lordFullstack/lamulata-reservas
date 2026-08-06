import { Database } from '@/lib/db/client';
import { DayPass } from '@/types/models';
import { DAY_PASS_UNIT_PRICE } from '@/types/enums';
import { CreateDayPassRequest } from '@/types/api';

export class DayPassService {
  static async getAllDayPasses(): Promise<DayPass[]> {
    return Database.dayPasses.findAll();
  }

  static async getDayPassById(id: string): Promise<DayPass | null> {
    return Database.dayPasses.findById(id);
  }

  static async createDayPass(userId: string, data: CreateDayPassRequest): Promise<DayPass> {
    const unitPrice = DAY_PASS_UNIT_PRICE;
    const total = unitPrice * data.guestCount;

    return Database.dayPasses.create({
      userId,
      guestName: data.guestName,
      guestPhone: data.guestPhone,
      date: new Date(data.date),
      guestCount: data.guestCount,
      unitPrice,
      total,
      observations: data.observations,
    });
  }

  static async updateDayPass(id: string, data: Partial<DayPass>): Promise<DayPass> {
    return Database.dayPasses.update(id, data);
  }

  static async deleteDayPass(id: string): Promise<void> {
    await Database.dayPasses.delete(id);
  }

  static async getDayPassesToday(): Promise<DayPass[]> {
    return Database.dayPasses.getTodayPasses();
  }

  static async getDayPassesByDate(date: Date): Promise<DayPass[]> {
    return Database.dayPasses.findByDate(date);
  }

  static async getDayPassesByDateRange(startDate: Date, endDate: Date): Promise<DayPass[]> {
    return Database.dayPasses.findByDateRange(startDate, endDate);
  }

  static async getTodayStats(): Promise<{
    count: number;
    totalGuests: number;
    totalIncome: number;
  }> {
    const dayPasses = await this.getDayPassesToday();
    return {
      count: dayPasses.length,
      totalGuests: dayPasses.reduce((acc, pass) => acc + pass.guestCount, 0),
      totalIncome: dayPasses.reduce((acc, pass) => acc + pass.total, 0),
    };
  }

  static async getMonthStats(date: Date): Promise<{
    count: number;
    totalGuests: number;
    totalIncome: number;
  }> {
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const dayPasses = await this.getDayPassesByDateRange(startDate, endDate);
    return {
      count: dayPasses.length,
      totalGuests: dayPasses.reduce((acc, pass) => acc + pass.guestCount, 0),
      totalIncome: dayPasses.reduce((acc, pass) => acc + pass.total, 0),
    };
  }
}

import { Database } from '@/lib/db/client';
import { RoomService } from './RoomService';
import { ReservationService } from './ReservationService';
import { DayPassService } from './DayPassService';
import { DashboardStats } from '@/types/models';
import { formatCurrency } from '@/lib/utils/currency';
import * as XLSX from 'xlsx';

export class ReportService {
  static async getDashboardStats(): Promise<DashboardStats> {
    const roomStats = await RoomService.getStats();
    const todayReservations = await ReservationService.getTodayReservations();
    const todayDayPasses = await DayPassService.getDayPassesToday();
    const mealsRequired = await ReservationService.getMealsRequiredToday();

    // Calcular ingresos del día
    const reservationIncome = todayReservations.reduce((acc, res) => acc + res.advance, 0);
    const dayPassIncome = todayDayPasses.reduce((acc, pass) => acc + pass.total, 0);

    return {
      availableRooms: roomStats.available,
      occupiedRooms: roomStats.occupied,
      reservationsToday: todayReservations.length,
      dayPassesToday: todayDayPasses.length,
      mealsRequired,
      dailyIncome: reservationIncome + dayPassIncome,
    };
  }

  static async getDailyReport(date: Date): Promise<{
    date: string;
    reservations: any[];
    dayPasses: any[];
    totalIncome: number;
    occupancyRate: number;
  }> {
    const reservations = await Database.reservations.findByDateRange(
      new Date(date.setHours(0, 0, 0, 0)),
      new Date(date.setHours(23, 59, 59, 999))
    );

    const dayPasses = await DayPassService.getDayPassesByDate(date);

    const roomStats = await RoomService.getStats();
    const occupancyRate = (roomStats.occupied / roomStats.total) * 100;

    const totalIncome =
      reservations.reduce((acc, res) => acc + res.advance, 0) +
      dayPasses.reduce((acc, pass) => acc + pass.total, 0);

    return {
      date: date.toISOString().split('T')[0] ?? '',
      reservations: reservations.map((r) => ({
        ...r,
        checkInDate: r.checkInDate.toISOString(),
        checkOutDate: r.checkOutDate.toISOString(),
      })),
      dayPasses: dayPasses.map((p) => ({
        ...p,
        date: p.date.toISOString(),
      })),
      totalIncome,
      occupancyRate,
    };
  }

  static async getMonthlyReport(year: number, month: number): Promise<{
    year: number;
    month: number;
    totalReservations: number;
    totalDayPasses: number;
    totalIncome: number;
    averageOccupancy: number;
  }> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const reservations = await Database.reservations.findByDateRange(startDate, endDate);
    const dayPasses = await DayPassService.getDayPassesByDateRange(startDate, endDate);

    const totalIncome =
      reservations.reduce((acc, res) => acc + res.advance, 0) +
      dayPasses.reduce((acc, pass) => acc + pass.total, 0);

    const roomStats = await RoomService.getStats();
    const daysInMonth = endDate.getDate();
    const averageOccupancy = ((reservations.length / roomStats.total) * 100) / daysInMonth;

    return {
      year,
      month,
      totalReservations: reservations.length,
      totalDayPasses: dayPasses.length,
      totalIncome,
      averageOccupancy,
    };
  }

  static async exportReservationsToExcel(startDate: Date, endDate: Date): Promise<Buffer> {
    const reservations = await Database.reservations.findByDateRange(startDate, endDate);

    const data = reservations.map((r) => ({
      'ID': r.id,
      'Huésped': r.guestName,
      'Documento': r.guestDocument,
      'Teléfono': r.guestPhone,
      'Habitación': r.roomId,
      'Entrada': new Date(r.checkInDate).toLocaleDateString(),
      'Salida': new Date(r.checkOutDate).toLocaleDateString(),
      'Personas': r.guestCount,
      'Anticipo': formatCurrency(r.advance),
      'Estado': r.status,
      'Observaciones': r.observations || '',
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Reservas');

    return Buffer.from(XLSX.write(wb, { bookType: 'xlsx', type: 'array' }));
  }

  static async exportDayPassesToExcel(startDate: Date, endDate: Date): Promise<Buffer> {
    const dayPasses = await Database.dayPasses.findByDateRange(startDate, endDate);

    const data = dayPasses.map((p) => ({
      'ID': p.id,
      'Huésped': p.guestName,
      'Teléfono': p.guestPhone,
      'Fecha': new Date(p.date).toLocaleDateString(),
      'Personas': p.guestCount,
      'Precio Unitario': formatCurrency(p.unitPrice),
      'Total': formatCurrency(p.total),
      'Observaciones': p.observations || '',
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Pasadías');

    return Buffer.from(XLSX.write(wb, { bookType: 'xlsx', type: 'array' }));
  }
}

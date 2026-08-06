import { format, parse, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

export const DATE_FORMAT = 'yyyy-MM-dd';
export const DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";
export const DISPLAY_DATE_FORMAT = 'dd/MM/yyyy';
export const DISPLAY_DATETIME_FORMAT = 'dd/MM/yyyy HH:mm';

export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    return format(new Date(date), DISPLAY_DATE_FORMAT, { locale: es });
  }
  return format(date, DISPLAY_DATE_FORMAT, { locale: es });
}

export function formatDateTime(date: Date | string): string {
  if (typeof date === 'string') {
    return format(new Date(date), DISPLAY_DATETIME_FORMAT, { locale: es });
  }
  return format(date, DISPLAY_DATETIME_FORMAT, { locale: es });
}

export function formatISO(date: Date | string): string {
  if (typeof date === 'string') {
    return format(new Date(date), DATETIME_FORMAT);
  }
  return format(date, DATETIME_FORMAT);
}

export function parseDate(dateString: string): Date | null {
  const parsed = parse(dateString, DISPLAY_DATE_FORMAT, new Date());
  return isValid(parsed) ? parsed : null;
}

export function getDayName(date: Date | string): string {
  if (typeof date === 'string') {
    return format(new Date(date), 'EEEE', { locale: es });
  }
  return format(date, 'EEEE', { locale: es });
}

export function getMonthName(date: Date | string): string {
  if (typeof date === 'string') {
    return format(new Date(date), 'MMMM', { locale: es });
  }
  return format(date, 'MMMM', { locale: es });
}

export function getDatesInRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  let current = new Date(startDate);

  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

export function getNights(checkIn: Date, checkOut: Date): number {
  const time = checkOut.getTime() - checkIn.getTime();
  return Math.ceil(time / (1000 * 3600 * 24));
}

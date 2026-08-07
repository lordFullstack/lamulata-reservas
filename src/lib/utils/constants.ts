export const APP_NAME = 'HotelFlow';
export const APP_VERSION = '0.1.0';

export const AUTH_COOKIE_NAME = 'hotelflow_auth';
export const AUTH_COOKIE_EXPIRES = 7 * 24 * 60 * 60 * 1000; // 7 días

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ROOMS: '/habitaciones',
  CALENDAR: '/calendario',
  RESERVATIONS: '/reservas',
  DAY_PASSES: '/pasadias',
  REPORTS: '/informes',
  LOGOUT: '/logout',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface CreateRoomRequest {
  number: string;
  floor: number;
  type: string;
  capacity: number;
}

export interface CreateReservationRequest {
  roomId: string;
  guestName: string;
  guestDocument: string;
  guestPhone: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  advance: number;
  observations?: string;
}

export interface CreateDayPassRequest {
  guestName: string;
  guestPhone: string;
  date: string;
  guestCount: number;
  observations?: string;
}

export interface UpdateReservationStatusRequest {
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
}

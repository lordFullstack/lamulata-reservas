export enum RoomStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  OCCUPIED = 'occupied',
}

export enum RoomType {
  DOUBLE = 'double',
  TRIPLE = 'triple',
  QUADRUPLE = 'quadruple',
  QUINTUPLE = 'quintuple',
  SEXTUPLE = 'sextuple',
  SEVEN_PERSON = 'seven_person',
  CABIN_A = 'cabin_a',
  CABIN_B = 'cabin_b',
}

export enum Floor {
  FIRST = 1,
  SECOND = 2,
  THIRD = 3,
  CABIN = 0,
}

export const ROOM_CAPACITIES: Record<RoomType, number> = {
  [RoomType.DOUBLE]: 2,
  [RoomType.TRIPLE]: 3,
  [RoomType.QUADRUPLE]: 4,
  [RoomType.QUINTUPLE]: 5,
  [RoomType.SEXTUPLE]: 6,
  [RoomType.SEVEN_PERSON]: 7,
  [RoomType.CABIN_A]: 16,
  [RoomType.CABIN_B]: 9,
};

export const ROOM_INVENTORY = {
  [Floor.FIRST]: {
    [RoomType.DOUBLE]: { count: 9, numbers: Array.from({ length: 9 }, (_, i) => `101${i + 1}`) },
    [RoomType.TRIPLE]: { count: 7, numbers: Array.from({ length: 7 }, (_, i) => `110${i + 1}`) },
    [RoomType.QUINTUPLE]: { count: 3, numbers: Array.from({ length: 3 }, (_, i) => `120${i + 1}`) },
    [RoomType.SEXTUPLE]: { count: 1, numbers: ['1301'] },
  },
  [Floor.SECOND]: {
    [RoomType.TRIPLE]: { count: 3, numbers: Array.from({ length: 3 }, (_, i) => `201${i + 1}`) },
    [RoomType.QUADRUPLE]: { count: 8, numbers: Array.from({ length: 8 }, (_, i) => `210${i + 1}`) },
    [RoomType.SEXTUPLE]: { count: 1, numbers: ['2301'] },
    [RoomType.SEVEN_PERSON]: { count: 1, numbers: ['2401'] },
  },
  [Floor.THIRD]: {
    [RoomType.TRIPLE]: { count: 3, numbers: Array.from({ length: 3 }, (_, i) => `301${i + 1}`) },
    [RoomType.QUADRUPLE]: { count: 8, numbers: Array.from({ length: 8 }, (_, i) => `310${i + 1}`) },
    [RoomType.SEXTUPLE]: { count: 1, numbers: ['3301'] },
    [RoomType.SEVEN_PERSON]: { count: 1, numbers: ['3401'] },
  },
  [Floor.CABIN]: {
    [RoomType.CABIN_A]: { count: 1, numbers: ['CA001'] },
    [RoomType.CABIN_B]: { count: 1, numbers: ['CB001'] },
  },
} as const;

export const DAY_PASS_UNIT_PRICE = 75000; // COP

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  [RoomType.DOUBLE]: 'Doble',
  [RoomType.TRIPLE]: 'Triple',
  [RoomType.QUADRUPLE]: 'Cuádruple',
  [RoomType.QUINTUPLE]: 'Quíntuple',
  [RoomType.SEXTUPLE]: 'Séxtuple',
  [RoomType.SEVEN_PERSON]: '7 Personas',
  [RoomType.CABIN_A]: 'Cabaña A',
  [RoomType.CABIN_B]: 'Cabaña B',
};

export const FLOOR_LABELS: Record<Floor, string> = {
  [Floor.CABIN]: 'Cabañas',
  [Floor.FIRST]: 'Piso 1',
  [Floor.SECOND]: 'Piso 2',
  [Floor.THIRD]: 'Piso 3',
};

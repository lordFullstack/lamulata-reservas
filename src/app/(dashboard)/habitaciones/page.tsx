'use client';

import { useRooms } from '@/lib/hooks/useResources';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { Card } from '@/components/ui/card';
import { RoomStatus, ROOM_TYPE_LABELS, FLOOR_LABELS } from '@/types/enums';
import { DoorOpen } from 'lucide-react';

const statusColors = {
  available: 'bg-green-100 text-green-800',
  reserved: 'bg-blue-100 text-blue-800',
  occupied: 'bg-red-100 text-red-800',
};

const statusLabels = {
  available: 'Disponible',
  reserved: 'Reservada',
  occupied: 'Ocupada',
};

export default function RoomsPage() {
  const { data: rooms, isLoading } = useRooms();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!rooms || rooms.length === 0) {
    return (
      <div className="p-8">
        <EmptyState title="Sin habitaciones" description="No hay habitaciones registradas" />
      </div>
    );
  }

  const groupedByFloor = rooms.reduce(
    (acc, room) => {
      const floor = room.floor;
      if (!acc[floor]) acc[floor] = [];
      acc[floor].push(room);
      return acc;
    },
    {} as Record<number, typeof rooms>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Habitaciones</h1>
        <p className="text-gray-600">Total: {rooms.length} habitaciones</p>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedByFloor)
          .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
          .map(([floor, floorRooms]) => (
            <div key={floor}>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {FLOOR_LABELS[parseInt(floor) as never]}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {floorRooms.map((room) => (
                  <Card key={room.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <DoorOpen size={20} className="text-gray-600" />
                          <h3 className="text-lg font-semibold text-gray-800">
                            {room.number}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {ROOM_TYPE_LABELS[room.type]} - {room.capacity} personas
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          statusColors[room.status]
                        }`}
                      >
                        {statusLabels[room.status]}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

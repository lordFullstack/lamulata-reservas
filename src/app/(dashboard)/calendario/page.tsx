'use client';

import { useRooms, useReservations } from '@/lib/hooks/useResources';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, getDaysInMonth, startOfMonth, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

export default function CalendarPage() {
  const { data: rooms, isLoading: roomsLoading } = useRooms();
  const { data: reservations, isLoading: reservationsLoading } = useReservations();
  const [currentDate, setCurrentDate] = useState(new Date());

  if (roomsLoading || reservationsLoading) {
    return <LoadingSpinner />;
  }

  if (!rooms) {
    return <div>Error cargando habitaciones</div>;
  }

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthName = format(currentDate, 'MMMM yyyy', { locale: es });

  const getStatusForRoom = (roomId: string, day: number): string => {
    if (!reservations) return 'available';

    const dateToCheck = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    const reservation = reservations.find((res) => {
      const checkIn = new Date(res.checkInDate);
      const checkOut = new Date(res.checkOutDate);
      return (
        res.roomId === roomId &&
        res.status !== 'cancelled' &&
        dateToCheck >= checkIn &&
        dateToCheck < checkOut
      );
    });

    if (!reservation) return 'available';

    const checkIn = new Date(reservation.checkInDate);
    if (dateToCheck.getTime() === checkIn.getTime()) {
      return 'reserved';
    }

    return 'occupied';
  };

  const statusColors: Record<string, string> = {
    available: 'bg-green-100 hover:bg-green-200',
    reserved: 'bg-blue-100 hover:bg-blue-200',
    occupied: 'bg-red-100 hover:bg-red-200',
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Calendario de Disponibilidad</h1>
        <p className="text-gray-600">Vista mensual de reservas y disponibilidad</p>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 capitalize">{monthName}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="p-2 hover:bg-gray-200 rounded-lg"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="p-2 hover:bg-gray-200 rounded-lg"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-100 rounded" />
              <span>Disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded" />
              <span>Check-in</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-100 rounded" />
              <span>Ocupada</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold min-w-32">Habitación</th>
                {Array.from({ length: daysInMonth }).map((_, i) => (
                  <th key={i} className="text-center p-1 font-semibold w-8 text-xs">
                    {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-medium text-gray-800 min-w-32">{room.number}</td>
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const status = getStatusForRoom(room.id, i + 1);
                    return (
                      <td key={i} className="p-1 text-center">
                        <div
                          className={`text-xs py-1 rounded cursor-pointer transition ${
                            statusColors[status]
                          }`}
                        >
                          {i + 1}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

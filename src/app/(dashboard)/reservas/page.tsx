'use client';

import { useReservations, useCreateReservation, useRooms } from '@/lib/hooks/useResources';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Reservation } from '@/types/models';

export default function ReservationsPage() {
  const { data: reservations, isLoading: loadingRes } = useReservations();
  const { data: rooms, isLoading: loadingRooms } = useRooms();
  const { mutate: createReservation, isPending } = useCreateReservation();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    roomId: '',
    guestName: '',
    guestDocument: '',
    guestPhone: '',
    checkInDate: '',
    checkOutDate: '',
    guestCount: 1,
    advance: 0,
    observations: '',
  });

  if (loadingRes || loadingRooms) {
    return <LoadingSpinner />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createReservation(
      {
        ...formData,
        guestCount: parseInt(formData.guestCount.toString()),
        advance: parseFloat(formData.advance.toString()),
      },
      {
        onSuccess: () => {
          setShowForm(false);
          setFormData({
            roomId: '',
            guestName: '',
            guestDocument: '',
            guestPhone: '',
            checkInDate: '',
            checkOutDate: '',
            guestCount: 1,
            advance: 0,
            observations: '',
          });
        },
      }
    );
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Reservas</h1>
          <p className="text-gray-600">Total: {reservations?.length || 0} reservas</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : 'Nueva Reserva'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Crear Reserva</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre del Huésped"
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                required
              />
              <Input
                label="Documento"
                value={formData.guestDocument}
                onChange={(e) => setFormData({ ...formData, guestDocument: e.target.value })}
                required
              />
              <Input
                label="Teléfono"
                type="tel"
                value={formData.guestPhone}
                onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Habitación
                </label>
                <select
                  value={formData.roomId}
                  onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar habitación</option>
                  {rooms?.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.number}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Entrada"
                type="datetime-local"
                value={formData.checkInDate}
                onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                required
              />
              <Input
                label="Salida"
                type="datetime-local"
                value={formData.checkOutDate}
                onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                required
              />
              <Input
                label="Cantidad de Personas"
                type="number"
                min="1"
                value={formData.guestCount}
                onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) })}
                required
              />
              <Input
                label="Anticipo"
                type="number"
                min="0"
                value={formData.advance}
                onChange={(e) => setFormData({ ...formData, advance: parseFloat(e.target.value) })}
              />
            </div>
            <Input
              label="Observaciones"
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              as="textarea"
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Guardando...' : 'Guardar Reserva'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {!reservations || reservations.length === 0 ? (
        <EmptyState title="Sin reservas" description="No hay reservas registradas" />
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation: Reservation) => (
            <Card key={reservation.id} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Huésped</p>
                  <p className="font-semibold text-gray-800">{reservation.guestName}</p>
                  <p className="text-xs text-gray-500">{reservation.guestDocument}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fechas</p>
                  <p className="font-semibold text-gray-800">
                    {formatDate(reservation.checkInDate)} - {formatDate(reservation.checkOutDate)}
                  </p>
                  <p className="text-xs text-gray-500">{reservation.guestCount} personas</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Anticipo</p>
                  <p className="font-semibold text-gray-800">
                    {formatCurrency(reservation.advance)}
                  </p>
                  <p className="text-xs text-gray-500">Estado: {reservation.status}</p>
                </div>
                <div className="flex items-end">
                  <Button size="sm" variant="outline">
                    Ver Detalles
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

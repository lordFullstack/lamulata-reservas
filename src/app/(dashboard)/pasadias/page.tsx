'use client';

import { useDayPasses, useCreateDayPass } from '@/lib/hooks/useResources';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { formatDate, formatCurrency, DAY_PASS_UNIT_PRICE } from '@/lib/utils';
import { DayPass } from '@/types/models';

export default function DayPassesPage() {
  const { data: dayPasses, isLoading } = useDayPasses();
  const { mutate: createDayPass, isPending } = useCreateDayPass();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    guestName: '',
    guestPhone: '',
    date: '',
    guestCount: 1,
    observations: '',
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createDayPass(
      {
        ...formData,
        guestCount: parseInt(formData.guestCount.toString()),
      },
      {
        onSuccess: () => {
          setShowForm(false);
          setFormData({
            guestName: '',
            guestPhone: '',
            date: '',
            guestCount: 1,
            observations: '',
          });
        },
      }
    );
  };

  const stats = dayPasses
    ? {
        count: dayPasses.length,
        totalGuests: dayPasses.reduce((acc, p) => acc + p.guestCount, 0),
        totalIncome: dayPasses.reduce((acc, p) => acc + p.total, 0),
      }
    : { count: 0, totalGuests: 0, totalIncome: 0 };

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Pasadías</h1>
          <p className="text-gray-600">Total: {stats.count} pasadías vendidos</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : 'Nuevo Pasadía'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6">
          <p className="text-sm text-gray-600">Pasadías Vendidos</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.count}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Total de Personas</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalGuests}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Ingresos</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {formatCurrency(stats.totalIncome)}
          </p>
        </Card>
      </div>

      {showForm && (
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Crear Pasadía</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre del Huésped"
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                required
              />
              <Input
                label="Teléfono"
                type="tel"
                value={formData.guestPhone}
                onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                required
              />
              <Input
                label="Fecha"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
            </div>
            <Input
              label="Observaciones"
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
            />
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Precio por persona: {formatCurrency(DAY_PASS_UNIT_PRICE)}
              </p>
              <p className="text-lg font-semibold text-gray-800 mt-2">
                Total: {formatCurrency(DAY_PASS_UNIT_PRICE * formData.guestCount)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Guardando...' : 'Guardar Pasadía'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {!dayPasses || dayPasses.length === 0 ? (
        <EmptyState title="Sin pasadías" description="No hay pasadías registrados" />
      ) : (
        <div className="space-y-4">
          {dayPasses.map((dayPass: DayPass) => (
            <Card key={dayPass.id} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Huésped</p>
                  <p className="font-semibold text-gray-800">{dayPass.guestName}</p>
                  <p className="text-xs text-gray-500">{dayPass.guestPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha</p>
                  <p className="font-semibold text-gray-800">{formatDate(dayPass.date)}</p>
                  <p className="text-xs text-gray-500">{dayPass.guestCount} personas</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Monto</p>
                  <p className="font-semibold text-gray-800">{formatCurrency(dayPass.total)}</p>
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

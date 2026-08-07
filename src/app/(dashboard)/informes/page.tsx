'use client';

import { useReservations, useDayPasses } from '@/lib/hooks/useResources';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Download } from 'lucide-react';
import { env } from '@/env';

export default function ReportsPage() {
  const { data: reservations, isLoading: loadingRes } = useReservations();
  const { data: dayPasses, isLoading: loadingPasses } = useDayPasses();
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] ?? '',
    endDate: new Date().toISOString().split('T')[0] ?? '',
  });

  if (loadingRes || loadingPasses) {
    return <LoadingSpinner />;
  }

  const filteredReservations = reservations?.filter((res) => {
    const checkIn = new Date(res.checkInDate).toISOString().split('T')[0] ?? '';
    return checkIn >= dateRange.startDate && checkIn <= dateRange.endDate;
  }) || [];

  const filteredDayPasses = dayPasses?.filter((pass) => {
    const date = new Date(pass.date).toISOString().split('T')[0] ?? '';
    return date >= dateRange.startDate && date <= dateRange.endDate;
  }) || [];

  const totalReservationIncome = filteredReservations.reduce((acc, res) => acc + res.advance, 0);
  const totalDayPassIncome = filteredDayPasses.reduce((acc, pass) => acc + pass.total, 0);
  const totalIncome = totalReservationIncome + totalDayPassIncome;

  const handleExportReservations = async () => {
    const response = await fetch(
      `${env.API_URL}/api/reports/export/reservations?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
    );
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reservas-${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleExportDayPasses = async () => {
    const response = await fetch(
      `${env.API_URL}/api/reports/export/day-passes?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
    );
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pasadias-${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Informes</h1>
        <p className="text-gray-600">Reportes y análisis del hotel</p>
      </div>

      <Card className="p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Filtrar por Fechas</h2>
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <p className="text-sm text-gray-600">Reservas</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{filteredReservations.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Pasadías</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{filteredDayPasses.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Ingresos Reservas</p>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {formatCurrency(totalReservationIncome)}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Ingresos Total</p>
          <p className="text-2xl font-bold text-green-600 mt-2">{formatCurrency(totalIncome)}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Reservas</h2>
            <Button size="sm" onClick={handleExportReservations} className="flex items-center gap-2">
              <Download size={16} />
              Exportar
            </Button>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredReservations.length === 0 ? (
              <p className="text-gray-500">No hay reservas en este período</p>
            ) : (
              filteredReservations.map((res) => (
                <div key={res.id} className="border-b pb-3">
                  <p className="font-medium text-gray-800">{res.guestName}</p>
                  <p className="text-xs text-gray-600">
                    {formatDate(res.checkInDate)} - {formatDate(res.checkOutDate)}
                  </p>
                  <p className="text-sm font-semibold text-gray-700">
                    {formatCurrency(res.advance)}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Pasadías</h2>
            <Button size="sm" onClick={handleExportDayPasses} className="flex items-center gap-2">
              <Download size={16} />
              Exportar
            </Button>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredDayPasses.length === 0 ? (
              <p className="text-gray-500">No hay pasadías en este período</p>
            ) : (
              filteredDayPasses.map((pass) => (
                <div key={pass.id} className="border-b pb-3">
                  <p className="font-medium text-gray-800">{pass.guestName}</p>
                  <p className="text-xs text-gray-600">{formatDate(pass.date)}</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {pass.guestCount} personas - {formatCurrency(pass.total)}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

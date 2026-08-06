'use client';

import { useDashboardStats } from '@/lib/hooks/useResources';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { ROUTES } from '@/lib/utils/constants';

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Resumen general del hotel</p>
        </div>
        <div className="flex gap-3">
          <Link href={ROUTES.RESERVATIONS}>
            <Button className="flex items-center gap-2">
              <Plus size={20} />
              Nueva Reserva
            </Button>
          </Link>
          <Link href={ROUTES.DAY_PASSES}>
            <Button variant="outline" className="flex items-center gap-2">
              <Plus size={20} />
              Nuevo Pasadía
            </Button>
          </Link>
        </div>
      </div>

      {stats && (
        <div className="space-y-8">
          <StatsGrid stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h3>
              <div className="space-y-2">
                <Link href={ROUTES.CALENDAR}>
                  <Button className="w-full" variant="outline">
                    Ver Calendario
                  </Button>
                </Link>
                <Link href={ROUTES.ROOMS}>
                  <Button className="w-full" variant="outline">
                    Administrar Habitaciones
                  </Button>
                </Link>
                <Link href={ROUTES.REPORTS}>
                  <Button className="w-full" variant="outline">
                    Ver Informes
                  </Button>
                </Link>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Estado Actual</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ocupación:</span>
                  <span className="font-semibold">
                    {stats.occupiedRooms} de {stats.availableRooms + stats.occupiedRooms}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${
                        ((stats.occupiedRooms) / (stats.availableRooms + stats.occupiedRooms)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

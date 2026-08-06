'use client';

import { DashboardStats } from '@/types/models';
import { StatCard } from './StatCard';
import { DoorOpen, Users, Calendar, Sun, UtensilsCrossed, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/currency';

interface StatsGridProps {
  stats: DashboardStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard
        title="Habitaciones Disponibles"
        value={stats.availableRooms}
        icon={<DoorOpen />}
        color="green"
      />
      <StatCard
        title="Habitaciones Ocupadas"
        value={stats.occupiedRooms}
        icon={<Users />}
        color="blue"
      />
      <StatCard
        title="Reservas Hoy"
        value={stats.reservationsToday}
        icon={<Calendar />}
        color="yellow"
      />
      <StatCard
        title="Pasadías Vendidos"
        value={stats.dayPassesToday}
        icon={<Sun />}
        color="purple"
      />
      <StatCard
        title="Almuerzos Requeridos"
        value={stats.mealsRequired}
        icon={<UtensilsCrossed />}
        color="red"
      />
      <StatCard
        title="Ingresos Hoy"
        value={formatCurrency(stats.dailyIncome)}
        icon={<TrendingUp />}
        color="green"
      />
    </div>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks';
import {
  LayoutDashboard,
  DoorOpen,
  Calendar,
  BookOpen,
  Sun,
  BarChart3,
  LogOut,
} from 'lucide-react';
import { ROUTES } from '@/lib/utils/constants';
import clsx from 'clsx';

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const isActive = (route: string) => pathname === route || pathname.startsWith(route);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: ROUTES.DASHBOARD },
    { icon: DoorOpen, label: 'Habitaciones', href: ROUTES.ROOMS },
    { icon: Calendar, label: 'Calendario', href: ROUTES.CALENDAR },
    { icon: BookOpen, label: 'Reservas', href: ROUTES.RESERVATIONS },
    { icon: Sun, label: 'Pasadías', href: ROUTES.DAY_PASSES },
    { icon: BarChart3, label: 'Informes', href: ROUTES.REPORTS },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">HotelFlow</h1>
        <p className="text-sm text-gray-400 mt-1">Sistema de Gestión</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              )}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
        >
          <LogOut size={20} />
          <span>Salir</span>
        </button>
      </div>
    </aside>
  );
}

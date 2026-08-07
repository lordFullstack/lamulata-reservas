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
  X,
} from 'lucide-react';
import { ROUTES } from '@/lib/utils/constants';
import clsx from 'clsx';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
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
    <>
      {/* Fondo oscuro detrás del menú en móvil */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          'w-64 bg-gray-900 text-white h-screen flex flex-col fixed md:static top-0 left-0 z-40 transition-transform duration-200',
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">HotelFlow</h1>
            <p className="text-sm text-gray-400 mt-1">Sistema de Gestión</p>
          </div>
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
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
    </>
  );
}

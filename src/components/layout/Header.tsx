'use client';

import { useAuth } from '@/lib/hooks';
import { Clock, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('es-CO'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex justify-between items-center gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            className="md:hidden text-gray-600 hover:text-gray-900 flex-shrink-0"
          >
            <Menu size={24} />
          </button>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">Bienvenido</h2>
            <p className="text-sm text-gray-600 truncate">{user?.name}</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-gray-600 flex-shrink-0">
          <Clock size={20} />
          <span className="font-mono">{time || '00:00:00'}</span>
        </div>
      </div>
    </header>
  );
}

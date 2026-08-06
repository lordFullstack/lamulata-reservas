'use client';

import { useAuth } from '@/lib/hooks';
import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Header() {
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
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Bienvenido</h2>
          <p className="text-sm text-gray-600">{user?.name}</p>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Clock size={20} />
          <span className="font-mono">{time || '00:00:00'}</span>
        </div>
      </div>
    </header>
  );
}

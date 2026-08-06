import type { Metadata } from 'next';
import { QueryClientProvider } from '@tanstack/react-query';
import './globals.css';

export const metadata: Metadata = {
  title: 'HotelFlow - Sistema de Gestión Hotelera',
  description: 'PMV de sistema de gestión hotelera moderno y escalable',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}

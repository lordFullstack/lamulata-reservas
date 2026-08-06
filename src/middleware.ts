import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/AuthService';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Rutas públicas
  if (pathname === '/' || pathname === '/login') {
    return NextResponse.next();
  }

  // Rutas protegidas
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/api')) {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      if (pathname.startsWith('/api')) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const verified = await AuthService.verifyToken(token);
    if (!verified) {
      if (pathname.startsWith('/api')) {
        return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

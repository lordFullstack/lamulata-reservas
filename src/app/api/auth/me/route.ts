import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/db/client';
import { AuthService } from '@/services/AuthService';

export async function GET(request: NextRequest) {
  try {
    await Database.initialize();

    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    const verified = await AuthService.verifyToken(token);
    if (!verified) {
      return NextResponse.json({ success: false, error: 'Token inválido' }, { status: 401 });
    }

    const user = await Database.users.findById(verified.userId);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

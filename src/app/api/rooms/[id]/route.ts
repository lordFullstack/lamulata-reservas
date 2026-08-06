import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/db/client';
import { RoomService } from '@/services/RoomService';
import { AuthService } from '@/services/AuthService';

async function verifyAuth(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  if (!token) {
    return null;
  }
  return AuthService.verifyToken(token);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await Database.initialize();

    const verified = await verifyAuth(request);
    if (!verified) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    const room = await RoomService.getRoomById(params.id);
    if (!room) {
      return NextResponse.json(
        { success: false, error: 'Habitación no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: room }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/db/client';
import { RoomService } from '@/services/RoomService';
import { AuthService } from '@/services/AuthService';
import { createRoomSchema } from '@/lib/utils/validation';
import { ZodError } from 'zod';

async function verifyAuth(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  if (!token) {
    return null;
  }
  return AuthService.verifyToken(token);
}

export async function GET(request: NextRequest) {
  try {
    await Database.initialize();

    const verified = await verifyAuth(request);
    if (!verified) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    const rooms = await RoomService.getAllRooms();
    return NextResponse.json({ success: true, data: rooms }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await Database.initialize();

    const verified = await verifyAuth(request);
    if (!verified) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createRoomSchema.parse(body);

    const room = await RoomService.createRoom(parsed);
    return NextResponse.json({ success: true, data: room }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/db/client';
import { DayPassService } from '@/services/DayPassService';
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await Database.initialize();

    const verified = await verifyAuth(request);
    if (!verified) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    const dayPass = await DayPassService.getDayPassById((await params).id);
    if (!dayPass) {
      return NextResponse.json(
        { success: false, error: 'Pasadía no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: dayPass }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await Database.initialize();

    const verified = await verifyAuth(request);
    if (!verified) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    await DayPassService.deleteDayPass((await params).id);
    return NextResponse.json({ success: true, message: 'Pasadía eliminada' }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

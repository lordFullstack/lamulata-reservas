import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/db/client';
import { ReservationService } from '@/services/ReservationService';
import { AuthService } from '@/services/AuthService';
import { updateReservationStatusSchema } from '@/lib/utils/validation';
import { ZodError } from 'zod';

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

    const reservation = await ReservationService.getReservationById((await params).id);
    if (!reservation) {
      return NextResponse.json(
        { success: false, error: 'Reserva no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: reservation }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await Database.initialize();

    const verified = await verifyAuth(request);
    if (!verified) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = updateReservationStatusSchema.parse(body);

    const reservation = await ReservationService.updateReservationStatus((await params).id, parsed.status);
    return NextResponse.json({ success: true, data: reservation }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }

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

    await ReservationService.deleteReservation((await params).id);
    return NextResponse.json({ success: true, message: 'Reserva eliminada' }, { status: 200 });
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

import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/db/client';
import { ReportService } from '@/services/ReportService';
import { AuthService } from '@/services/AuthService';

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

    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'Fechas requeridas' },
        { status: 400 }
      );
    }

    const buffer = await ReportService.exportReservationsToExcel(
      new Date(startDate),
      new Date(endDate)
    );

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="reservas-${new Date().toISOString().split('T')[0]}.xlsx"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al exportar' },
      { status: 500 }
    );
  }
}

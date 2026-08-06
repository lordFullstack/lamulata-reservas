import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/db/client';
import { AuthService } from '@/services/AuthService';
import { loginSchema } from '@/lib/utils/validation';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  try {
    // Inicializar BD
    await Database.initialize();

    const body = await request.json();

    // Validar datos
    const parsed = loginSchema.parse(body);

    // Hacer login
    const { token, userId } = await AuthService.login(parsed);

    // Obtener usuario
    const user = await Database.users.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Crear respuesta con cookie
    const response = NextResponse.json(
      {
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        },
      },
      { status: 200 }
    );

    // Establecer cookie segura
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 días
    });

    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Datos inválidos',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

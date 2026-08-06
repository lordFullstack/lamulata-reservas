import { Database } from '@/lib/db/client';
import { LoginRequest } from '@/types/api';
import { env } from '@/env';
import * as jose from 'jose';

const ADMIN_EMAIL = 'admin@hotelflow.local';
const ADMIN_PASSWORD = 'admin123'; // Demo password

export class AuthService {
  private static readonly secret = new TextEncoder().encode(
    env.JWT_SECRET || 'your-super-secret-key-min-32-chars'
  );

  static async login(request: LoginRequest): Promise<{ token: string; userId: string }> {
    const user = await Database.users.findByEmail(request.email);

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Simple password check (en producción usar bcrypt)
    const isPasswordValid =
      request.email === ADMIN_EMAIL && request.password === ADMIN_PASSWORD;

    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    const token = await this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { token, userId: user.id };
  }

  static async generateToken(payload: {
    userId: string;
    email: string;
    role: string;
  }): Promise<string> {
    return await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(this.secret);
  }

  static async verifyToken(token: string): Promise<{
    userId: string;
    email: string;
    role: string;
  } | null> {
    try {
      const verified = await jose.jwtVerify(token, this.secret);
      return verified.payload as {
        userId: string;
        email: string;
        role: string;
      };
    } catch {
      return null;
    }
  }
}

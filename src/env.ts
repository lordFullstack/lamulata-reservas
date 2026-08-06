export const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-key-min-32-chars',
  DATABASE_TYPE: (process.env.DATABASE_TYPE || 'mock') as 'mock' | 'sqlite' | 'supabase',
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
} as const;

if (env.JWT_SECRET.length < 32 && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET must be at least 32 characters long');
}

'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { env } from '@/env';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${env.API_URL}/api/auth/me`);
        setUser(response.data.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      const response = await axios.post(`${env.API_URL}/api/auth/login`, {
        email,
        password,
      });

      setUser(response.data.data.user);
      router.push('/dashboard');
      return response.data.data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Error en login';
      setError(message);
      throw new Error(message);
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await axios.post(`${env.API_URL}/api/auth/logout`);
      setUser(null);
      router.push('/login');
    } catch (err: any) {
      const message = err.response?.data?.error || 'Error en logout';
      setError(message);
    }
  }, [router]);

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };
}

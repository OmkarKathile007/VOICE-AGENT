'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi, AuthResponse, getToken } from '@/lib/api';

interface AuthContextType {
  user: AuthResponse | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (email: string, password: string, name: string, role: string) => Promise<AuthResponse>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    authApi.me()
      .then(setUser)
      .catch(() => localStorage.removeItem('krishi_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    const data = await authApi.login(email, password);
    localStorage.setItem('krishi_token', data.token);
    setUser(data);
    return data;
  };

  const register = async (email: string, password: string, name: string, role: string): Promise<AuthResponse> => {
    const data = await authApi.register(email, password, name, role);
    localStorage.setItem('krishi_token', data.token);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('krishi_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

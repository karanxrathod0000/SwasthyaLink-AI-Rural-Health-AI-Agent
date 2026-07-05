import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiFetch } from '../utils/api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'PHC-Staff' | 'ASHA-Worker';
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (name: string, email: string, password: string, role: AuthUser['role']) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, restore session via /api/auth/me using dual auth (cookie + localStorage bearer token)
  useEffect(() => {
    apiFetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || 'Login failed' };
    if (data.token) {
      localStorage.setItem('swasthya_token', data.token);
    }
    setUser(data.user);
    return {};
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: AuthUser['role']
  ): Promise<{ error?: string }> => {
    const res = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || 'Registration failed' };
    if (data.token) {
      localStorage.setItem('swasthya_token', data.token);
    }
    if (data.user) {
      setUser(data.user);
      return {};
    }
    return login(email, password);
  };

  const logout = async () => {
    await apiFetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    localStorage.removeItem('swasthya_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

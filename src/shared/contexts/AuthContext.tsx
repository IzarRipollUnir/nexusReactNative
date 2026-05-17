import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../api/apiClient';

type User = { id: string; email: string } | null;
type AuthContextType = {
  user: User;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          try {
            const profile = await apiClient.get('/me');
            setUser(profile);
          } catch (err) {
            console.warn('Failed to fetch user profile:', err);
            await AsyncStorage.removeItem('token');
          }
        }
      } catch (err) {
        console.warn('AuthContext init error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function signIn(email: string, password: string) {
    const res = await apiClient.post('/auth/login', { email, password });
    await AsyncStorage.setItem('token', res.token);
    setUser(res.user);
  }

  async function signOut() {
    await AsyncStorage.removeItem('token');
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signOut }}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

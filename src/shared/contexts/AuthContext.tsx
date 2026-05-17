import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = { id: string; email: string; username: string } | null;
type AuthContextType = {
  user: User;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_TOKEN_KEY = 'token';
const AUTH_USER_KEY = 'authUser';

function createFakeUser(email: string): Exclude<User, null> {
  const normalizedEmail = email.trim();
  const usernamePart = normalizedEmail.includes('@') ? normalizedEmail.split('@')[0].trim() : normalizedEmail;
  const username = usernamePart || 'usuario';
  const identifierSeed = username.toLowerCase();
  const numericId = Array.from(identifierSeed).reduce((accumulator, character) => {
    return (accumulator * 31 + character.charCodeAt(0)) % 1000000007;
  }, 7);

  return {
    id: String(numericId || 1),
    email: normalizedEmail || `${username}@nexus.local`,
    username,
  };
}

async function persistUser(user: Exclude<User, null>) {
  await AsyncStorage.multiSet([
    [AUTH_TOKEN_KEY, 'fake-token'],
    [AUTH_USER_KEY, JSON.stringify(user)],
  ]);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const storedUser = await AsyncStorage.getItem(AUTH_USER_KEY);

        if (storedUser) {
          setUser(JSON.parse(storedUser) as User);
        } else {
          await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, AUTH_USER_KEY]);
        }
      } catch (err) {
        console.warn('AuthContext init error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function signIn(email: string, password: string) {
    const fakeUser = createFakeUser(email);
    await persistUser(fakeUser);
    setUser(fakeUser);
  }

  async function signOut() {
    await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, AUTH_USER_KEY]);
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signOut }}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Book } from '../types';

type LibraryCartContextValue = {
  items: Book[];
  loading: boolean;
  addItem: (book: Book) => void;
  removeItem: (bookId: number) => void;
  clearCart: () => void;
  hasItem: (bookId: number) => boolean;
};

const CART_STORAGE_KEY = '@nexus/library-cart';

const LibraryCartContext = createContext<LibraryCartContextValue | undefined>(undefined);

export function LibraryCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
          setItems(JSON.parse(stored) as Book[]);
        }
      } catch (error) {
        console.warn('Failed to load library cart:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }

    (async () => {
      try {
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.warn('Failed to persist library cart:', error);
      }
    })();
  }, [items, loading]);

  const value = useMemo<LibraryCartContextValue>(
    () => ({
      items,
      loading,
      addItem: (book) => {
        setItems((current) => (current.some((item) => item.id === book.id) ? current : [...current, book]));
      },
      removeItem: (bookId) => {
        setItems((current) => current.filter((item) => item.id !== bookId));
      },
      clearCart: () => setItems([]),
      hasItem: (bookId) => items.some((item) => item.id === bookId),
    }),
    [items, loading]
  );

  return <LibraryCartContext.Provider value={value}>{children}</LibraryCartContext.Provider>;
}

export function useLibraryCart() {
  const context = useContext(LibraryCartContext);
  if (!context) {
    throw new Error('useLibraryCart must be used within a LibraryCartProvider');
  }

  return context;
}
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';

import type { Movie } from '@/api/tmdb';

const STORAGE_KEY = 'favorites';

type FavoritesValue = {
  favorites: Movie[];
  isFavorite: (id: number) => boolean;
  toggle: (movie: Movie) => void;
};

const FavoritesContext = createContext<FavoritesValue | null>(null);

export function FavoritesProvider({ children }: PropsWithChildren) {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => saved && setFavorites(JSON.parse(saved)));
  }, []);

  const toggle = (movie: Movie) => {
    setFavorites((current) => {
      const next = current.some((m) => m.id === movie.id)
        ? current.filter((m) => m.id !== movie.id)
        : [movie, ...current];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const isFavorite = (id: number) => favorites.some((m) => m.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggle }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const value = useContext(FavoritesContext);
  if (!value) throw new Error('useFavorites must be used inside FavoritesProvider');
  return value;
}

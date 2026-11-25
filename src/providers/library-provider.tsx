import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';

import type { Movie } from '@/api/tmdb';
import {
  entryKey,
  migrateFavorites,
  setRating,
  setStatus,
  type Library,
  type LibraryEntry,
  type WatchStatus,
} from '@/lib/library';

const STORAGE_KEY = 'library';
const LEGACY_KEY = 'favorites';

type LibraryValue = {
  library: Library;
  entry: (movie: Movie) => LibraryEntry | undefined;
  changeStatus: (movie: Movie, status: WatchStatus | null) => void;
  rate: (movie: Movie, stars: number) => void;
};

const LibraryContext = createContext<LibraryValue | null>(null);

export function LibraryProvider({ children }: PropsWithChildren) {
  const [library, setLibrary] = useState<Library>({});

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) return setLibrary(JSON.parse(saved));
      const legacy = await AsyncStorage.getItem(LEGACY_KEY);
      if (legacy) setLibrary(migrateFavorites(JSON.parse(legacy)));
    })();
  }, []);

  const update = (change: (current: Library) => Library) =>
    setLibrary((current) => {
      const next = change(current);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });

  const value: LibraryValue = {
    library,
    entry: (movie) => library[entryKey(movie)],
    changeStatus: (movie, status) => update((current) => setStatus(current, movie, status)),
    rate: (movie, stars) => update((current) => setRating(current, movie, stars)),
  };

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const value = useContext(LibraryContext);
  if (!value) throw new Error('useLibrary must be used inside LibraryProvider');
  return value;
}

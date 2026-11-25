import type { Movie } from '@/api/tmdb';

export type WatchStatus = 'want' | 'watching' | 'watched';
export const WATCH_STATUSES: WatchStatus[] = ['want', 'watching', 'watched'];

export type LibraryEntry = {
  movie: Movie;
  status: WatchStatus;
  /** The user's own score, 1–5 stars. */
  rating: number | null;
  updatedAt: number;
};

export type Library = Record<string, LibraryEntry>;

export const entryKey = (movie: Pick<Movie, 'id' | 'media'>) => `${movie.media ?? 'movie'}-${movie.id}`;

export function setStatus(library: Library, movie: Movie, status: WatchStatus | null, now = Date.now()): Library {
  const key = entryKey(movie);
  const { [key]: current, ...rest } = library;
  if (status === null) return rest;
  return { ...rest, [key]: { movie, status, rating: current?.rating ?? null, updatedAt: now } };
}

/** Rating a title you have not listed marks it as watched. Same star again clears the rating. */
export function setRating(library: Library, movie: Movie, stars: number, now = Date.now()): Library {
  const key = entryKey(movie);
  const current = library[key];
  const rating = current?.rating === stars ? null : Math.max(1, Math.min(5, Math.round(stars)));
  return { ...library, [key]: { movie, status: current?.status ?? 'watched', rating, updatedAt: now } };
}

export function entriesByStatus(library: Library, status: WatchStatus): LibraryEntry[] {
  return Object.values(library)
    .filter((e) => e.status === status)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

/** Old app versions stored a plain array of favorite movies. */
export function migrateFavorites(favorites: Movie[], now = Date.now()): Library {
  return favorites.reduce<Library>(
    (library, movie, i) => ({ ...library, [entryKey(movie)]: { movie, status: 'want', rating: null, updatedAt: now - i } }),
    {},
  );
}

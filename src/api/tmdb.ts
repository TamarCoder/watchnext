const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p';
const TOKEN = process.env.EXPO_PUBLIC_TMDB_TOKEN;

export type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
};

export type MovieDetails = Movie & {
  runtime: number | null;
  tagline: string | null;
  genres: { id: number; name: string }[];
};

export type Page<T> = {
  page: number;
  results: T[];
  total_pages: number;
};

export type TmdbErrorKind = 'missing-token' | 'unauthorized' | 'not-found' | 'network' | 'server';

export class TmdbError extends Error {
  constructor(public kind: TmdbErrorKind, message: string) {
    super(message);
  }
}

async function request<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
  if (!TOKEN) throw new TmdbError('missing-token', 'TMDB token is not set');

  const query = new URLSearchParams({ language: 'en-US', ...params } as Record<string, string>);
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}?${query}`, {
      headers: { Authorization: `Bearer ${TOKEN}`, accept: 'application/json' },
    });
  } catch {
    throw new TmdbError('network', 'No internet connection');
  }

  if (response.status === 401) throw new TmdbError('unauthorized', 'Invalid TMDB token');
  if (response.status === 404) throw new TmdbError('not-found', 'Movie not found');
  if (!response.ok) throw new TmdbError('server', `TMDB error ${response.status}`);
  return response.json() as Promise<T>;
}

export const tmdb = {
  trending: (page: number) => request<Page<Movie>>('/trending/movie/week', { page }),
  search: (text: string, page: number) =>
    request<Page<Movie>>('/search/movie', { query: text, page, include_adult: 'false' }),
  details: (id: number) => request<MovieDetails>(`/movie/${id}`),
};

export function imageUrl(path: string | null, size: 'w342' | 'w780' = 'w342') {
  return path ? `${IMAGE_URL}/${size}${path}` : null;
}

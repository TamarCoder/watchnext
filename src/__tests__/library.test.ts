import { describe, expect, it } from '@jest/globals';
import type { Movie } from '@/api/tmdb';
import { entriesByStatus, entryKey, migrateFavorites, setRating, setStatus, type Library } from '@/lib/library';

const movie = (id: number, media: Movie['media'] = 'movie'): Movie => ({
  id,
  media,
  title: `Title ${id}`,
  overview: '',
  poster_path: null,
  backdrop_path: null,
  release_date: '2026-01-01',
  vote_average: 7,
});

describe('library', () => {
  it('keeps a movie and a show with the same id apart', () => {
    expect(entryKey(movie(1, 'movie'))).not.toBe(entryKey(movie(1, 'tv')));
  });

  it('adds, changes and removes a status', () => {
    let lib: Library = setStatus({}, movie(1), 'want', 1);
    expect(lib['movie-1'].status).toBe('want');

    lib = setStatus(lib, movie(1), 'watched', 2);
    expect(lib['movie-1'].status).toBe('watched');

    lib = setStatus(lib, movie(1), null);
    expect(lib['movie-1']).toBeUndefined();
  });

  it('keeps the rating when the status changes', () => {
    let lib = setRating({}, movie(1), 4, 1);
    lib = setStatus(lib, movie(1), 'watching', 2);
    expect(lib['movie-1'].rating).toBe(4);
  });

  it('marks a rated title as watched and clears the rating on the same star', () => {
    let lib = setRating({}, movie(2), 3, 1);
    expect(lib['movie-2']).toMatchObject({ status: 'watched', rating: 3 });

    lib = setRating(lib, movie(2), 3, 2);
    expect(lib['movie-2'].rating).toBeNull();
  });

  it('clamps ratings to 1–5 stars', () => {
    expect(setRating({}, movie(3), 9)['movie-3'].rating).toBe(5);
    expect(setRating({}, movie(3), 0)['movie-3'].rating).toBe(1);
  });

  it('lists entries of one status, newest first', () => {
    let lib = setStatus({}, movie(1), 'want', 1);
    lib = setStatus(lib, movie(2), 'want', 3);
    lib = setStatus(lib, movie(3), 'watched', 2);
    expect(entriesByStatus(lib, 'want').map((e) => e.movie.id)).toEqual([2, 1]);
  });

  it('moves old favorites into "want to watch"', () => {
    const lib = migrateFavorites([movie(5), movie(6)], 100);
    expect(Object.values(lib).every((e) => e.status === 'want')).toBe(true);
    expect(entriesByStatus(lib, 'want').map((e) => e.movie.id)).toEqual([5, 6]);
  });
});

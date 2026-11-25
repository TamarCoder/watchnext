import { describe, expect, it } from '@jest/globals';
import { imageUrl, titleHref, toTitle } from '@/api/tmdb';

describe('tmdb helpers', () => {
  it('turns a TV show into the shared title shape', () => {
    const show = toTitle({ id: 7, name: 'Show', first_air_date: '2020-05-01', vote_average: 8 }, 'tv');
    expect(show).toMatchObject({ id: 7, media: 'tv', title: 'Show', release_date: '2020-05-01', poster_path: null });
  });

  it('keeps movie fields as they are', () => {
    const film = toTitle({ id: 1, title: 'Film', release_date: '1999-10-15' }, 'movie');
    expect(film).toMatchObject({ title: 'Film', release_date: '1999-10-15', vote_average: 0 });
  });

  it('builds image urls and returns null without a path', () => {
    expect(imageUrl('/a.jpg', 'w185')).toBe('https://image.tmdb.org/t/p/w185/a.jpg');
    expect(imageUrl(null)).toBeNull();
  });

  it('links to the right details screen', () => {
    expect(titleHref(toTitle({ id: 2 }, 'tv')).pathname).toBe('/tv/[id]');
    expect(titleHref(toTitle({ id: 2 }, 'movie')).pathname).toBe('/movie/[id]');
  });
});

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p';
const TOKEN = process.env.EXPO_PUBLIC_TMDB_TOKEN;

export type MediaType = 'movie' | 'tv';

/** A movie or a TV show, normalized to one shape. */
export type Movie = {
  id: number;
  media?: MediaType;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
};

export type Genre = { id: number; name: string };
export type CastMember = { id: number; name: string; character: string; profile_path: string | null };
export type Video = { key: string; site: string; type: string; official: boolean; name: string };
export type Provider = { provider_id: number; provider_name: string; logo_path: string };
export type Review = {
  id: string;
  author: string;
  content: string;
  created_at: string;
  author_details: { rating: number | null; avatar_path: string | null };
};

export type MovieDetails = Movie & {
  runtime: number | null;
  seasons: number | null;
  tagline: string | null;
  genres: Genre[];
  cast: CastMember[];
  director: string | null;
  trailer: Video | null;
  similar: Movie[];
  reviews: Review[];
  providers: Provider[];
};

export type Person = {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
};

export type PersonDetails = Person & {
  biography: string;
  birthday: string | null;
  place_of_birth: string | null;
  credits: Movie[];
};

export type SearchResult = { kind: 'title'; item: Movie } | { kind: 'person'; item: Person };

export type Page<T> = { page: number; results: T[]; total_pages: number };

export type TmdbErrorKind = 'missing-token' | 'unauthorized' | 'not-found' | 'network' | 'server';

export class TmdbError extends Error {
  constructor(public kind: TmdbErrorKind, message: string) {
    super(message);
  }
}

type Params = Record<string, string | number>;

async function request<T>(path: string, params: Params = {}): Promise<T> {
  if (!TOKEN) throw new TmdbError('missing-token', 'TMDB token is not set');

  const query = new URLSearchParams({ language: 'en-US', ...params } as Record<string, string>);
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}?${query}`, {
      headers: { Authorization: `Bearer ${TOKEN.trim()}`, accept: 'application/json' },
    });
  } catch {
    throw new TmdbError('network', 'No internet connection');
  }

  if (response.status === 401) throw new TmdbError('unauthorized', 'Invalid TMDB token');
  if (response.status === 404) throw new TmdbError('not-found', 'Not found');
  if (!response.ok) throw new TmdbError('server', `TMDB error ${response.status}`);
  return response.json() as Promise<T>;
}

/* ---------- normalizing raw TMDB objects ---------- */

type RawTitle = Partial<Movie> & { name?: string; first_air_date?: string; media_type?: string };

function toTitle(raw: RawTitle, media: MediaType): Movie {
  return {
    id: raw.id ?? 0,
    media,
    title: raw.title ?? raw.name ?? 'Untitled',
    overview: raw.overview ?? '',
    poster_path: raw.poster_path ?? null,
    backdrop_path: raw.backdrop_path ?? null,
    release_date: raw.release_date ?? raw.first_air_date ?? '',
    vote_average: raw.vote_average ?? 0,
  };
}

const titlePage = (media: MediaType) => (page: Page<RawTitle>) => ({
  ...page,
  results: page.results.map((raw) => toTitle(raw, media)),
});

/* ---------- lists ---------- */

export type ListKind =
  | 'trending'
  | 'popular'
  | 'top_rated'
  | 'now_playing'
  | 'upcoming'
  | 'on_the_air'
  | 'airing_today';

export const LIST_TITLES: Record<ListKind, string> = {
  trending: 'Trending this week',
  popular: 'Popular',
  top_rated: 'All-time best',
  now_playing: 'Now in cinemas',
  upcoming: 'Coming soon',
  on_the_air: 'On the air',
  airing_today: 'Airing today',
};

function list(media: MediaType, kind: ListKind, page: number) {
  const path = kind === 'trending' ? `/trending/${media}/week` : `/${media}/${kind}`;
  return request<Page<RawTitle>>(path, { page }).then(titlePage(media));
}

function discover(media: MediaType, genreId: number, sort: string, page: number) {
  const params: Params = { with_genres: genreId, sort_by: sort, page };
  if (sort.startsWith('vote_average')) params['vote_count.gte'] = 300;
  return request<Page<RawTitle>>(`/discover/${media}`, params).then(titlePage(media));
}

/* ---------- details ---------- */

type RawDetails = RawTitle & {
  runtime?: number | null;
  episode_run_time?: number[];
  number_of_seasons?: number;
  tagline?: string | null;
  genres: Genre[];
  credits: { cast: CastMember[]; crew: { name: string; job: string }[] };
  videos: { results: Video[] };
  similar: Page<RawTitle>;
  reviews: Page<Review>;
  'watch/providers': { results: Record<string, { flatrate?: Provider[]; rent?: Provider[]; buy?: Provider[] }> };
};

/** Streaming services are listed for the US region; Georgia is not covered by TMDB. */
export const PROVIDER_REGION = 'US';

async function details(media: MediaType, id: number): Promise<MovieDetails> {
  const raw = await request<RawDetails>(`/${media}/${id}`, {
    append_to_response: 'credits,videos,similar,reviews,watch/providers',
  });
  const videos = raw.videos.results.filter((v) => v.site === 'YouTube');
  const region = raw['watch/providers'].results[PROVIDER_REGION];
  const providers = [...(region?.flatrate ?? []), ...(region?.rent ?? []), ...(region?.buy ?? [])];

  return {
    ...toTitle(raw, media),
    runtime: raw.runtime ?? raw.episode_run_time?.[0] ?? null,
    seasons: raw.number_of_seasons ?? null,
    tagline: raw.tagline ?? null,
    genres: raw.genres,
    cast: raw.credits.cast.slice(0, 15),
    director: raw.credits.crew.find((c) => c.job === 'Director')?.name ?? null,
    trailer: videos.find((v) => v.type === 'Trailer' && v.official) ?? videos.find((v) => v.type === 'Trailer') ?? null,
    similar: raw.similar.results.map((r) => toTitle(r, media)).filter((t) => t.poster_path),
    reviews: raw.reviews.results.slice(0, 5),
    providers: providers.filter((p, i) => providers.findIndex((x) => x.provider_id === p.provider_id) === i),
  };
}

type RawPerson = Person & {
  biography: string;
  birthday: string | null;
  place_of_birth: string | null;
  combined_credits: { cast: (RawTitle & { vote_count?: number })[] };
};

async function person(id: number): Promise<PersonDetails> {
  const raw = await request<RawPerson>(`/person/${id}`, { append_to_response: 'combined_credits' });
  const seen = new Set<string>();
  const credits = raw.combined_credits.cast
    .filter((c) => c.poster_path && (c.media_type === 'movie' || c.media_type === 'tv'))
    .sort((a, b) => (b.vote_count ?? 0) - (a.vote_count ?? 0))
    .map((c) => toTitle(c, c.media_type as MediaType))
    .filter((t) => !seen.has(`${t.media}-${t.id}`) && seen.add(`${t.media}-${t.id}`));
  return { ...raw, credits };
}

/* ---------- search ---------- */

async function searchMulti(text: string, page: number): Promise<Page<SearchResult>> {
  const raw = await request<Page<RawTitle & Partial<Person>>>('/search/multi', {
    query: text,
    page,
    include_adult: 'false',
  });
  const results = raw.results.flatMap<SearchResult>((r) => {
    if (r.media_type === 'person') return [{ kind: 'person', item: r as Person }];
    if (r.media_type === 'movie' || r.media_type === 'tv') return [{ kind: 'title', item: toTitle(r, r.media_type) }];
    return [];
  });
  return { ...raw, results };
}

export const tmdb = {
  list,
  discover,
  details,
  person,
  searchMulti,
  genres: (media: MediaType) => request<{ genres: Genre[] }>(`/genre/${media}/list`).then((r) => r.genres),
  popularPeople: () => request<Page<Person>>('/person/popular').then((r) => r.results),
};

type ImageSize = 'w92' | 'w185' | 'w342' | 'w780' | 'w1280';

export function imageUrl(path: string | null | undefined, size: ImageSize = 'w342') {
  return path ? `${IMAGE_URL}/${size}${path}` : null;
}

export const titleHref = (t: Movie) =>
  ({ pathname: t.media === 'tv' ? '/tv/[id]' : '/movie/[id]', params: { id: t.id } }) as const;

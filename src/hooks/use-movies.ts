import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { tmdb, type ListKind, type MediaType } from '@/api/tmdb';

const nextPage = (last: { page: number; total_pages: number }) =>
  last.page < Math.min(last.total_pages, 500) ? last.page + 1 : undefined;

/** First page of a list — used by the horizontal rows on Home. */
export function useTitleList(media: MediaType, kind: ListKind) {
  return useQuery({ queryKey: ['list', media, kind, 1], queryFn: () => tmdb.list(media, kind, 1) });
}

/** Every page of a list — used by the "See all" grid. */
export function useInfiniteList(media: MediaType, kind: ListKind) {
  return useInfiniteQuery({
    queryKey: ['list-all', media, kind],
    queryFn: ({ pageParam }) => tmdb.list(media, kind, pageParam),
    initialPageParam: 1,
    getNextPageParam: nextPage,
  });
}

export function useDiscover(media: MediaType, genreId: number, sort: string) {
  return useInfiniteQuery({
    queryKey: ['discover', media, genreId, sort],
    queryFn: ({ pageParam }) => tmdb.discover(media, genreId, sort, pageParam),
    initialPageParam: 1,
    getNextPageParam: nextPage,
  });
}

export function useGenres(media: MediaType) {
  return useQuery({ queryKey: ['genres', media], queryFn: () => tmdb.genres(media), staleTime: Infinity });
}

export function usePopularPeople() {
  return useQuery({ queryKey: ['people', 'popular'], queryFn: tmdb.popularPeople });
}

export function useTitle(media: MediaType, id: number) {
  return useQuery({ queryKey: ['title', media, id], queryFn: () => tmdb.details(media, id) });
}

export function usePerson(id: number) {
  return useQuery({ queryKey: ['person', id], queryFn: () => tmdb.person(id) });
}

export function useSearch(text: string) {
  return useInfiniteQuery({
    queryKey: ['search', text],
    queryFn: ({ pageParam }) => tmdb.searchMulti(text, pageParam),
    initialPageParam: 1,
    getNextPageParam: nextPage,
    enabled: text.length > 1,
  });
}

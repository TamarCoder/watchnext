import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { tmdb } from '@/api/tmdb';

const nextPage = (last: { page: number; total_pages: number }) =>
  last.page < last.total_pages ? last.page + 1 : undefined;

export function useTrending() {
  return useInfiniteQuery({
    queryKey: ['trending'],
    queryFn: ({ pageParam }) => tmdb.trending(pageParam),
    initialPageParam: 1,
    getNextPageParam: nextPage,
  });
}

export function useMovieSearch(text: string) {
  return useInfiniteQuery({
    queryKey: ['search', text],
    queryFn: ({ pageParam }) => tmdb.search(text, pageParam),
    initialPageParam: 1,
    getNextPageParam: nextPage,
    enabled: text.length > 1,
  });
}

export function useMovie(id: number) {
  return useQuery({ queryKey: ['movie', id], queryFn: () => tmdb.details(id) });
}

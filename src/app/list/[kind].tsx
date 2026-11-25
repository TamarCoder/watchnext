import { Stack, useLocalSearchParams } from 'expo-router';

import { type ListKind, type MediaType } from '@/api/tmdb';
import { MovieGrid } from '@/components/movie-grid';
import { ErrorView, LoadingView } from '@/components/state-view';
import { ThemedView } from '@/components/themed-view';
import { useInfiniteList } from '@/hooks/use-movies';
import { useLanguage } from '@/providers/language-provider';

/** "See all" grid for any Home row. */
export default function ListScreen() {
  const { kind, media } = useLocalSearchParams<{ kind: ListKind; media: MediaType }>();
  const { t } = useLanguage();
  const type: MediaType = media === 'tv' ? 'tv' : 'movie';
  const query = useInfiniteList(type, kind);
  const items = query.data?.pages.flatMap((p) => p.results).filter((m) => m.poster_path) ?? [];

  let content;
  if (query.isPending) content = <LoadingView />;
  else if (query.isError) content = <ErrorView error={query.error} onRetry={() => query.refetch()} />;
  else
    content = (
      <MovieGrid
        movies={items}
        onEndReached={() => query.hasNextPage && !query.isFetchingNextPage && query.fetchNextPage()}
        loadingMore={query.isFetchingNextPage}
        refreshing={query.isRefetching && !query.isFetchingNextPage}
        onRefresh={() => query.refetch()}
      />
    );

  return (
    <ThemedView style={{ flex: 1 }}>
      <Stack.Screen options={{ title: t(`list.${kind}`) }} />
      {content}
    </ThemedView>
  );
}

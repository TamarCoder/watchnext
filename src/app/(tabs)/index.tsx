import { SafeAreaView } from 'react-native-safe-area-context';

import { MovieGrid } from '@/components/movie-grid';
import { ScreenTitle } from '@/components/screen-title';
import { ErrorView, LoadingView } from '@/components/state-view';
import { ThemedView } from '@/components/themed-view';
import { useTrending } from '@/hooks/use-movies';

export default function TrendingScreen() {
  const query = useTrending();
  const movies = query.data?.pages.flatMap((page) => page.results) ?? [];

  let content;
  if (query.isPending) content = <LoadingView />;
  else if (query.isError) content = <ErrorView error={query.error} onRetry={() => query.refetch()} />;
  else
    content = (
      <MovieGrid
        movies={movies}
        header={<ScreenTitle title="Trending" subtitle="Most watched movies this week" />}
        onEndReached={() => query.hasNextPage && !query.isFetchingNextPage && query.fetchNextPage()}
        loadingMore={query.isFetchingNextPage}
        refreshing={query.isRefetching && !query.isFetchingNextPage}
        onRefresh={() => query.refetch()}
      />
    );

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {content}
      </SafeAreaView>
    </ThemedView>
  );
}

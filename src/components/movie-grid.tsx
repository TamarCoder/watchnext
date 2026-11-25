import type { ReactElement } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, useWindowDimensions } from 'react-native';

import type { Movie } from '@/api/tmdb';
import { MovieCard } from '@/components/movie-card';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const MIN_CARD_WIDTH = 150;
const GAP = Spacing.three;

type MovieGridProps = {
  movies: Movie[];
  header?: ReactElement;
  onEndReached?: () => void;
  loadingMore?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
};

// Column count follows screen width: 2 on phones, 3–5 on tablets and web.
export function MovieGrid({ movies, header, onEndReached, loadingMore, refreshing, onRefresh }: MovieGridProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width, MaxContentWidth * 1.5) - GAP * 2;
  const columns = Math.max(2, Math.min(5, Math.floor((contentWidth + GAP) / (MIN_CARD_WIDTH + GAP))));
  const cardWidth = (contentWidth - GAP * (columns - 1)) / columns;

  return (
    <FlatList
      key={columns}
      data={movies}
      numColumns={columns}
      keyExtractor={(movie) => String(movie.id)}
      renderItem={({ item }) => <MovieCard movie={item} width={cardWidth} />}
      ListHeaderComponent={header}
      columnWrapperStyle={{ gap: GAP }}
      contentContainerStyle={{ gap: GAP * 1.5, padding: GAP, alignSelf: 'center', width: contentWidth + GAP * 2 }}
      contentInsetAdjustmentBehavior="automatic"
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loadingMore ? <ActivityIndicator color={theme.accent} /> : undefined}
      refreshControl={
        onRefresh ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={theme.accent} /> : undefined
      }
    />
  );
}

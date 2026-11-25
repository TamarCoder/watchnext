import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import type { MediaType } from '@/api/tmdb';
import { MovieGrid } from '@/components/movie-grid';
import { ErrorView, LoadingView, StateView } from '@/components/state-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import { useDiscover } from '@/hooks/use-movies';
import { useTheme } from '@/hooks/use-theme';

const SORTS = [
  { label: 'Popular', value: 'popularity.desc' },
  { label: 'Top rated', value: 'vote_average.desc' },
  { label: 'Newest', value: 'primary_release_date.desc' },
];

export default function GenreScreen() {
  const { id, name, media } = useLocalSearchParams<{ id: string; name: string; media: MediaType }>();
  const theme = useTheme();
  const [sort, setSort] = useState(SORTS[0].value);
  const type: MediaType = media === 'tv' ? 'tv' : 'movie';
  // TV uses first_air_date instead of primary_release_date.
  const sortValue = type === 'tv' ? sort.replace('primary_release_date', 'first_air_date') : sort;
  const query = useDiscover(type, Number(id), sortValue);
  const items = query.data?.pages.flatMap((p) => p.results).filter((m) => m.poster_path) ?? [];

  const chips = (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
      {SORTS.map((s) => {
        const active = s.value === sort;
        return (
          <Pressable
            key={s.value}
            onPress={() => setSort(s.value)}
            accessibilityState={{ selected: active }}
            style={[styles.chip, { backgroundColor: active ? theme.accent : theme.backgroundElement }]}>
            <ThemedText type="smallBold" style={{ color: active ? theme.onAccent : theme.text }}>
              {s.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </ScrollView>
  );

  let content;
  if (query.isPending) content = <LoadingView />;
  else if (query.isError) content = <ErrorView error={query.error} onRetry={() => query.refetch()} />;
  else if (!items.length)
    content = <StateView icon={{ ios: 'film', android: 'movie', web: 'movie' }} title="Nothing here" message="No titles match this genre yet." />;
  else
    content = (
      <MovieGrid
        movies={items}
        header={chips}
        onEndReached={() => query.hasNextPage && !query.isFetchingNextPage && query.fetchNextPage()}
        loadingMore={query.isFetchingNextPage}
      />
    );

  return (
    <ThemedView style={{ flex: 1 }}>
      <Stack.Screen options={{ title: name ?? 'Genre' }} />
      {content}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  chips: { gap: Spacing.two, paddingBottom: Spacing.two },
  chip: { paddingHorizontal: Spacing.three, paddingVertical: Spacing.two, borderRadius: Radius.full },
});

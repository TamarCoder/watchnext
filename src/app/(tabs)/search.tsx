import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MovieGrid } from '@/components/movie-grid';
import { ErrorView, LoadingView, StateView } from '@/components/state-view';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import { useDebounce } from '@/hooks/use-debounce';
import { useMovieSearch } from '@/hooks/use-movies';
import { useTheme } from '@/hooks/use-theme';

export default function SearchScreen() {
  const theme = useTheme();
  const [text, setText] = useState('');
  const term = useDebounce(text.trim());
  const query = useMovieSearch(term);
  const movies = query.data?.pages.flatMap((page) => page.results) ?? [];

  let content;
  if (term.length < 2)
    content = (
      <StateView
        icon={{ ios: 'popcorn', android: 'movie', web: 'movie' }}
        title="Find a movie"
        message="Type at least two letters to search the TMDB catalog."
      />
    );
  else if (query.isPending) content = <LoadingView />;
  else if (query.isError) content = <ErrorView error={query.error} onRetry={() => query.refetch()} />;
  else if (movies.length === 0)
    content = (
      <StateView
        icon={{ ios: 'magnifyingglass', android: 'search_off', web: 'search_off' }}
        title="No results"
        message={`Nothing matches “${term}”. Try another title.`}
      />
    );
  else
    content = (
      <MovieGrid
        movies={movies}
        onEndReached={() => query.hasNextPage && !query.isFetchingNextPage && query.fetchNextPage()}
        loadingMore={query.isFetchingNextPage}
      />
    );

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={styles.bar}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Search movies"
            placeholderTextColor={theme.textSecondary}
            autoCorrect={false}
            returnKeyType="search"
            clearButtonMode="while-editing"
            accessibilityLabel="Search movies"
            style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }]}
          />
        </View>
        {content}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  bar: { padding: Spacing.three, width: '100%', maxWidth: 800, alignSelf: 'center' },
  input: { fontSize: 16, paddingHorizontal: Spacing.three, paddingVertical: Spacing.three, borderRadius: Radius.md },
});

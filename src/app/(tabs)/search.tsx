import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Movie, Person } from '@/api/tmdb';
import { MovieGrid } from '@/components/movie-grid';
import { PeopleRow } from '@/components/people-row';
import { PersonAvatar } from '@/components/person-avatar';
import { ErrorView, LoadingView, StateView } from '@/components/state-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CardSize, Radius, Spacing } from '@/constants/theme';
import { useDebounce } from '@/hooks/use-debounce';
import { useSearch } from '@/hooks/use-movies';
import { useTheme } from '@/hooks/use-theme';

type Filter = 'all' | 'movie' | 'tv' | 'person';
const FILTERS: { label: string; value: Filter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Movies', value: 'movie' },
  { label: 'TV Shows', value: 'tv' },
  { label: 'People', value: 'person' },
];

export default function SearchScreen() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [text, setText] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const term = useDebounce(text.trim());
  const query = useSearch(term);

  const results = query.data?.pages.flatMap((p) => p.results) ?? [];
  const titles: Movie[] = results.flatMap((r) => (r.kind === 'title' && r.item.poster_path ? [r.item] : []));
  const people: Person[] = results.flatMap((r) => (r.kind === 'person' ? [r.item] : []));
  const shownTitles = filter === 'all' ? titles : titles.filter((t) => t.media === filter);
  const loadMore = () => query.hasNextPage && !query.isFetchingNextPage && query.fetchNextPage();

  let content;
  if (term.length < 2)
    content = (
      <StateView
        icon={{ ios: 'popcorn', android: 'movie', web: 'movie' }}
        title="Search everything"
        message="Movies, TV shows and people — type at least two letters."
      />
    );
  else if (query.isPending) content = <LoadingView />;
  else if (query.isError) content = <ErrorView error={query.error} onRetry={() => query.refetch()} />;
  else if (filter === 'person' ? !people.length : !shownTitles.length && !(filter === 'all' && people.length))
    content = (
      <StateView
        icon={{ ios: 'magnifyingglass', android: 'search_off', web: 'search_off' }}
        title="No results"
        message={`Nothing matches “${term}” here. Try another word or filter.`}
      />
    );
  else if (filter === 'person') {
    const columns = Math.max(3, Math.floor(width / (CardSize.avatar + Spacing.five)));
    content = (
      <FlatList
        key={columns}
        data={people}
        numColumns={columns}
        keyExtractor={(p) => String(p.id)}
        columnWrapperStyle={{ justifyContent: 'space-around' }}
        contentContainerStyle={{ gap: Spacing.four, padding: Spacing.three }}
        onEndReached={loadMore}
        renderItem={({ item }) => (
          <PersonAvatar id={item.id} name={item.name} subtitle={item.known_for_department} photo={item.profile_path} />
        )}
      />
    );
  } else
    content = (
      <MovieGrid
        movies={shownTitles}
        header={filter === 'all' ? <View style={{ marginHorizontal: -Spacing.three }}><PeopleRow title="People" people={people} /></View> : undefined}
        onEndReached={loadMore}
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
            placeholder="Movies, shows, people"
            placeholderTextColor={theme.textSecondary}
            autoCorrect={false}
            returnKeyType="search"
            clearButtonMode="while-editing"
            accessibilityLabel="Search"
            style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }]}
          />
          <View style={styles.filters}>
            {FILTERS.map((f) => {
              const active = f.value === filter;
              return (
                <Pressable
                  key={f.value}
                  onPress={() => setFilter(f.value)}
                  accessibilityState={{ selected: active }}
                  style={[styles.filter, { backgroundColor: active ? theme.accent : theme.backgroundElement }]}>
                  <ThemedText type="smallBold" style={{ color: active ? theme.onAccent : theme.text }}>
                    {f.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>
        {content}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  bar: { padding: Spacing.three, gap: Spacing.three, width: '100%', maxWidth: 800, alignSelf: 'center' },
  input: { fontSize: 16, paddingHorizontal: Spacing.three, paddingVertical: Spacing.three, borderRadius: Radius.md },
  filters: { flexDirection: 'row', gap: Spacing.two, flexWrap: 'wrap' },
  filter: { paddingHorizontal: Spacing.three, paddingVertical: Spacing.two, borderRadius: Radius.full },
});

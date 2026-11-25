import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { imageUrl } from '@/api/tmdb';
import { ErrorView, LoadingView } from '@/components/state-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import { useMovie } from '@/hooks/use-movies';
import { useTheme } from '@/hooks/use-theme';
import { useFavorites } from '@/providers/favorites-provider';

export default function MovieScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const { isFavorite, toggle } = useFavorites();
  const query = useMovie(Number(id));
  const wide = width >= 768;

  if (query.isPending) return <ThemedView style={{ flex: 1 }}><LoadingView /></ThemedView>;
  if (query.isError)
    return <ThemedView style={{ flex: 1 }}><ErrorView error={query.error} onRetry={() => query.refetch()} /></ThemedView>;

  const movie = query.data;
  const saved = isFavorite(movie.id);
  const backdrop = imageUrl(movie.backdrop_path, 'w780');
  const facts = [
    movie.release_date?.slice(0, 4),
    movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null,
    `★ ${movie.vote_average.toFixed(1)}`,
  ].filter(Boolean);

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: Spacing.six }}>
        <View style={[styles.backdrop, { backgroundColor: theme.backgroundElement, aspectRatio: wide ? 21 / 9 : 16 / 10 }]}>
          {backdrop && <Image source={backdrop} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} />}
        </View>

        <View style={[styles.body, { flexDirection: wide ? 'row' : 'column' }]}>
          <Image
            source={imageUrl(movie.poster_path)}
            style={[styles.poster, { width: wide ? 220 : 140, marginTop: wide ? -110 : -90 }]}
            contentFit="cover"
          />
          <View style={{ flex: wide ? 1 : undefined, gap: Spacing.three }}>
            <ThemedText type="subtitle">{movie.title}</ThemedText>
            {movie.tagline ? <ThemedText themeColor="textSecondary" style={{ fontStyle: 'italic' }}>{movie.tagline}</ThemedText> : null}
            <ThemedText themeColor="textSecondary">{facts.join('  ·  ')}</ThemedText>

            <View style={styles.genres}>
              {movie.genres.map((genre) => (
                <View key={genre.id} style={[styles.chip, { borderColor: theme.border }]}>
                  <ThemedText type="small">{genre.name}</ThemedText>
                </View>
              ))}
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() => toggle(movie)}
              style={({ pressed }) => [
                styles.favorite,
                { backgroundColor: saved ? theme.backgroundSelected : theme.accent, opacity: pressed ? 0.8 : 1 },
              ]}>
              <ThemedText style={{ color: saved ? theme.text : theme.onAccent, fontWeight: 700 }}>
                {saved ? '♥  Saved to favorites' : '♡  Add to favorites'}
              </ThemedText>
            </Pressable>

            <ThemedText type="smallBold">Overview</ThemedText>
            <ThemedText>{movie.overview || 'No overview available.'}</ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  backdrop: { width: '100%' },
  body: { padding: Spacing.three, gap: Spacing.four, width: '100%', maxWidth: 1000, alignSelf: 'center' },
  poster: { aspectRatio: 2 / 3, borderRadius: Radius.md },
  genres: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  chip: { borderWidth: 1, borderRadius: Radius.full, paddingHorizontal: Spacing.three, paddingVertical: Spacing.one },
  favorite: { alignItems: 'center', paddingVertical: Spacing.three, borderRadius: Radius.full },
});

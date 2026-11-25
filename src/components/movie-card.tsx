import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { imageUrl, type Movie } from '@/api/tmdb';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function MovieCard({ movie, width }: { movie: Movie; width: number }) {
  const theme = useTheme();
  const poster = imageUrl(movie.poster_path);
  const year = movie.release_date?.slice(0, 4);

  return (
    <Link href={{ pathname: '/movie/[id]', params: { id: movie.id } }} asChild>
      <Pressable style={({ pressed }) => [{ width, opacity: pressed ? 0.85 : 1 }]} accessibilityLabel={movie.title}>
        <View style={[styles.poster, { backgroundColor: theme.backgroundElement }]}>
          {poster ? (
            <Image source={poster} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
          ) : (
            <ThemedText themeColor="textSecondary" style={styles.noPoster}>
              No poster
            </ThemedText>
          )}
          <View style={[styles.badge, { backgroundColor: theme.background }]}>
            <ThemedText type="smallBold" style={{ color: theme.rating }}>
              ★ {movie.vote_average.toFixed(1)}
            </ThemedText>
          </View>
        </View>
        <ThemedText type="smallBold" numberOfLines={1} style={styles.title}>
          {movie.title}
        </ThemedText>
        {year ? (
          <ThemedText type="small" themeColor="textSecondary">
            {year}
          </ThemedText>
        ) : null}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  poster: { aspectRatio: 2 / 3, borderRadius: Radius.md, overflow: 'hidden', justifyContent: 'center' },
  noPoster: { textAlign: 'center' },
  badge: {
    position: 'absolute',
    top: Spacing.two,
    left: Spacing.two,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.sm,
  },
  title: { marginTop: Spacing.two },
});

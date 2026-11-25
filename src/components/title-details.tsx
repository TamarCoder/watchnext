import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Extrapolation,
  FadeInDown,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { imageUrl, type MediaType, type MovieDetails } from '@/api/tmdb';
import { PeopleRow } from '@/components/people-row';
import { ProviderLogos } from '@/components/provider-logos';
import { ReviewCard } from '@/components/review-card';
import { SectionHeader } from '@/components/section-header';
import { ErrorView, LoadingView } from '@/components/state-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TitleRow } from '@/components/title-row';
import { Motion, Overlay, Radius, Spacing } from '@/constants/theme';
import { useTitle } from '@/hooks/use-movies';
import { useTheme } from '@/hooks/use-theme';
import { useFavorites } from '@/providers/favorites-provider';

function facts(t: MovieDetails) {
  const runtime = t.runtime ? `${Math.floor(t.runtime / 60)}h ${t.runtime % 60}m` : null;
  const seasons = t.seasons ? `${t.seasons} season${t.seasons > 1 ? 's' : ''}` : null;
  return [t.release_date?.slice(0, 4), seasons ?? runtime, `★ ${t.vote_average.toFixed(1)}`].filter(Boolean).join('  ·  ');
}

/** Details screen shared by movies and TV shows, with a parallax backdrop. */
export function TitleDetails({ media }: { media: MediaType }) {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const { isFavorite, toggle } = useFavorites();
  const query = useTitle(media, Number(id));
  const scrollY = useSharedValue(0);
  const wide = width >= 768;
  const backdropHeight = Math.min(width * (wide ? 0.42 : 0.62), 520);

  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });
  const parallax = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scrollY.value, [-backdropHeight, 0, backdropHeight], [-backdropHeight / 2, 0, backdropHeight * 0.5], Extrapolation.CLAMP) },
      { scale: interpolate(scrollY.value, [-backdropHeight, 0], [2, 1], Extrapolation.CLAMP) },
    ],
  }));

  if (query.isPending) return <ThemedView style={{ flex: 1 }}><LoadingView /></ThemedView>;
  if (query.isError)
    return <ThemedView style={{ flex: 1 }}><ErrorView error={query.error} onRetry={() => query.refetch()} /></ThemedView>;

  const t = query.data;
  const saved = isFavorite(t.id);
  const trailer = t.trailer;

  return (
    <ThemedView style={{ flex: 1 }}>
      <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ paddingBottom: Spacing.six }}>
        <Animated.View style={[{ height: backdropHeight, backgroundColor: theme.backgroundElement }, parallax]}>
          {t.backdrop_path && (
            <Image source={imageUrl(t.backdrop_path, 'w1280')} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
          )}
          <LinearGradient colors={[Overlay.scrimStart, theme.background]} locations={[0.5, 1]} style={StyleSheet.absoluteFill} />
        </Animated.View>

        <View style={{ backgroundColor: theme.background }}>
          <Animated.View entering={FadeInDown.duration(Motion.enter)} style={[styles.body, { flexDirection: wide ? 'row' : 'column' }]}>
            <Image
              source={imageUrl(t.poster_path)}
              style={[styles.poster, { width: wide ? 220 : 130, marginTop: wide ? -120 : -100, backgroundColor: theme.backgroundElement }]}
              contentFit="cover"
            />
            <View style={{ flex: wide ? 1 : undefined, gap: Spacing.three }}>
              <ThemedText type="subtitle">{t.title}</ThemedText>
              {t.tagline ? <ThemedText themeColor="textSecondary" style={{ fontStyle: 'italic' }}>{t.tagline}</ThemedText> : null}
              <ThemedText themeColor="textSecondary">{facts(t)}</ThemedText>
              {t.director ? <ThemedText type="small">Directed by <ThemedText type="smallBold">{t.director}</ThemedText></ThemedText> : null}

              <View style={styles.genres}>
                {t.genres.map((g) => (
                  <View key={g.id} style={[styles.chip, { borderColor: theme.border }]}>
                    <ThemedText type="small">{g.name}</ThemedText>
                  </View>
                ))}
              </View>

              <View style={styles.actions}>
                {trailer && (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => WebBrowser.openBrowserAsync(`https://www.youtube.com/watch?v=${trailer.key}`)}
                    style={({ pressed }) => [styles.action, { backgroundColor: theme.accent, opacity: pressed ? 0.8 : 1 }]}>
                    <ThemedText style={{ color: theme.onAccent, fontWeight: 700 }}>▶  Trailer</ThemedText>
                  </Pressable>
                )}
                <Pressable
                  accessibilityRole="button"
                  onPress={() => toggle(t)}
                  style={({ pressed }) => [
                    styles.action,
                    { backgroundColor: theme.backgroundSelected, opacity: pressed ? 0.8 : 1 },
                  ]}>
                  <ThemedText style={{ fontWeight: 700 }}>{saved ? '♥  Saved' : '♡  Favorite'}</ThemedText>
                </Pressable>
              </View>

              <ThemedText type="smallBold">Overview</ThemedText>
              <ThemedText>{t.overview || 'No overview available.'}</ThemedText>
            </View>
          </Animated.View>

          <PeopleRow title="Cast" people={t.cast.map((c) => ({ ...c, subtitle: c.character }))} />
          <ProviderLogos providers={t.providers} />

          {t.reviews.length > 0 && (
            <View style={{ marginBottom: Spacing.four }}>
              <SectionHeader title={`Reviews (${t.reviews.length})`} />
              <View style={{ gap: Spacing.three, paddingHorizontal: Spacing.three }}>
                {t.reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
              </View>
            </View>
          )}

          <TitleRow title={media === 'tv' ? 'Similar shows' : 'Similar movies'} items={t.similar} />
        </View>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  body: { padding: Spacing.three, gap: Spacing.four, width: '100%', maxWidth: 1000, alignSelf: 'center' },
  poster: { aspectRatio: 2 / 3, borderRadius: Radius.md },
  genres: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  chip: { borderWidth: 1, borderRadius: Radius.full, paddingHorizontal: Spacing.three, paddingVertical: Spacing.one },
  actions: { flexDirection: 'row', gap: Spacing.two },
  action: { flex: 1, alignItems: 'center', paddingVertical: Spacing.three, borderRadius: Radius.full },
});

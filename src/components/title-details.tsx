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
import { StatusPicker } from '@/components/status-picker';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TitleRow } from '@/components/title-row';
import { Motion, Overlay, Radius, Spacing } from '@/constants/theme';
import { useTitle } from '@/hooks/use-movies';
import { useTheme } from '@/hooks/use-theme';
import type { TranslationKey } from '@/lib/i18n';
import { useLanguage } from '@/providers/language-provider';

type Translate = (key: TranslationKey, vars?: Record<string, string | number>) => string;

function facts(item: MovieDetails, t: Translate) {
  const runtime = item.runtime ? `${Math.floor(item.runtime / 60)}h ${item.runtime % 60}m` : null;
  const seasons = item.seasons ? (item.seasons > 1 ? t('details.seasons', { count: item.seasons }) : t('details.season')) : null;
  return [item.release_date?.slice(0, 4), seasons ?? runtime, `★ ${item.vote_average.toFixed(1)}`]
    .filter(Boolean)
    .join('  ·  ');
}

/** Details screen shared by movies and TV shows, with a parallax backdrop. */
export function TitleDetails({ media }: { media: MediaType }) {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { t } = useLanguage();
  const { width } = useWindowDimensions();
  const query = useTitle(media, Number(id));
  const scrollY = useSharedValue(0);
  const wide = width >= 768;
  const backdropHeight = Math.min(width * (wide ? 0.42 : 0.62), 520);

  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });
  const parallax = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [-backdropHeight, 0, backdropHeight],
          [-backdropHeight / 2, 0, backdropHeight * 0.5],
          Extrapolation.CLAMP,
        ),
      },
      { scale: interpolate(scrollY.value, [-backdropHeight, 0], [2, 1], Extrapolation.CLAMP) },
    ],
  }));

  if (query.isPending)
    return (
      <ThemedView style={{ flex: 1 }}>
        <LoadingView />
      </ThemedView>
    );
  if (query.isError)
    return (
      <ThemedView style={{ flex: 1 }}>
        <ErrorView error={query.error} onRetry={() => query.refetch()} />
      </ThemedView>
    );

  const item = query.data;
  const trailer = item.trailer;

  return (
    <ThemedView style={{ flex: 1 }}>
      <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ paddingBottom: Spacing.six }}>
        <Animated.View style={[{ height: backdropHeight, backgroundColor: theme.backgroundElement }, parallax]}>
          {item.backdrop_path && (
            <Image source={imageUrl(item.backdrop_path, 'w1280')} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
          )}
          <LinearGradient colors={[Overlay.scrimStart, theme.background]} locations={[0.5, 1]} style={StyleSheet.absoluteFill} />
        </Animated.View>

        <View style={{ backgroundColor: theme.background }}>
          <Animated.View
            entering={FadeInDown.duration(Motion.enter)}
            style={[styles.body, { flexDirection: wide ? 'row' : 'column' }]}>
            <Image
              source={imageUrl(item.poster_path)}
              style={[
                styles.poster,
                { width: wide ? 220 : 130, marginTop: wide ? -120 : -100, backgroundColor: theme.backgroundElement },
              ]}
              contentFit="cover"
            />
            <View style={{ flex: wide ? 1 : undefined, gap: Spacing.three }}>
              <ThemedText type="subtitle">{item.title}</ThemedText>
              {item.tagline ? (
                <ThemedText themeColor="textSecondary" style={{ fontStyle: 'italic' }}>
                  {item.tagline}
                </ThemedText>
              ) : null}
              <ThemedText themeColor="textSecondary">{facts(item, t)}</ThemedText>
              {item.director ? (
                <ThemedText type="small">
                  {t('details.directedBy')} <ThemedText type="smallBold">{item.director}</ThemedText>
                </ThemedText>
              ) : null}

              <View style={styles.genres}>
                {item.genres.map((g) => (
                  <View key={g.id} style={[styles.chip, { borderColor: theme.border }]}>
                    <ThemedText type="small">{g.name}</ThemedText>
                  </View>
                ))}
              </View>

              {trailer && (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => WebBrowser.openBrowserAsync(`https://www.youtube.com/watch?v=${trailer.key}`)}
                  style={({ pressed }) => [styles.trailer, { borderColor: theme.accent, opacity: pressed ? 0.8 : 1 }]}>
                  <ThemedText style={{ color: theme.accent, fontWeight: 700 }}>▶  {t('details.trailer')}</ThemedText>
                </Pressable>
              )}

              <StatusPicker movie={item} />

              <ThemedText type="smallBold">{t('details.overview')}</ThemedText>
              <ThemedText>{item.overview || t('details.noOverview')}</ThemedText>
            </View>
          </Animated.View>

          <PeopleRow title={t('details.cast')} people={item.cast.map((c) => ({ ...c, subtitle: c.character }))} />
          <ProviderLogos providers={item.providers} />

          {item.reviews.length > 0 && (
            <View style={{ marginBottom: Spacing.four }}>
              <SectionHeader title={t('details.reviews', { count: item.reviews.length })} />
              <View style={{ gap: Spacing.three, paddingHorizontal: Spacing.three }}>
                {item.reviews.map((r) => (
                  <ReviewCard key={r.id} review={r} />
                ))}
              </View>
            </View>
          )}

          <TitleRow title={t(media === 'tv' ? 'details.similarShows' : 'details.similarMovies')} items={item.similar} />
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
  trailer: { alignItems: 'center', paddingVertical: Spacing.three, borderRadius: Radius.full, borderWidth: 1.5 },
});

import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInRight, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import type { Genre, MediaType } from '@/api/tmdb';
import { SectionHeader } from '@/components/section-header';
import { CardSize, DefaultGenreStyle, GenreStyle, Motion, Overlay, Radius, Spacing } from '@/constants/theme';
import { useLanguage } from '@/providers/language-provider';

function GenreTile({ genre, media, index }: { genre: Genre; media: MediaType; index: number }) {
  const style = GenreStyle[genre.id] ?? DefaultGenreStyle;
  const scale = useSharedValue(1);
  const press = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View entering={FadeInRight.duration(Motion.enter).delay(Math.min(index, 8) * Motion.stagger)}>
      <Link href={{ pathname: '/genre/[id]', params: { id: genre.id, name: genre.name, media } }} asChild>
        <Pressable
          accessibilityLabel={genre.name}
          onPressIn={() => scale.set(withTiming(Motion.pressScale, { duration: Motion.press }))}
          onPressOut={() => scale.set(withTiming(1, { duration: Motion.press }))}>
          <Animated.View style={press}>
            <LinearGradient colors={style.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.tile}>
              <Text style={styles.icon}>{style.icon}</Text>
              <Text style={styles.name} numberOfLines={2}>
                {genre.name}
              </Text>
            </LinearGradient>
          </Animated.View>
        </Pressable>
      </Link>
    </Animated.View>
  );
}

/** Two rows of colourful genre tiles that scroll sideways. */
export function GenreChips({ genres, media }: { genres?: Genre[]; media: MediaType }) {
  const { t } = useLanguage();
  if (!genres?.length) return null;

  const half = Math.ceil(genres.length / 2);
  const rows = [genres.slice(0, half), genres.slice(half)];

  return (
    <View style={{ marginBottom: Spacing.four }}>
      <SectionHeader title={t('home.genres')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>
        <View style={{ gap: Spacing.two }}>
          {rows.map((row, r) => (
            <View key={r} style={styles.row}>
              {row.map((genre, i) => (
                <GenreTile key={genre.id} genre={genre} media={media} index={i + r} />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: Spacing.three },
  row: { flexDirection: 'row', gap: Spacing.two },
  tile: {
    width: CardSize.genre,
    height: 76,
    borderRadius: Radius.md,
    padding: Spacing.two + Spacing.one,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  icon: { fontSize: 24, position: 'absolute', right: Spacing.two, top: Spacing.two, opacity: 0.9 },
  name: { color: Overlay.onImage, fontSize: 15, fontWeight: 800, marginTop: 'auto', paddingRight: Spacing.five },
});

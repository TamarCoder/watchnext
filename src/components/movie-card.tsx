import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { imageUrl, titleHref, type Movie } from '@/api/tmdb';
import { ThemedText } from '@/components/themed-text';
import { Motion, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type MovieCardProps = { movie: Movie; width: number; index: number };

export function MovieCard({ movie, width, index }: MovieCardProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const poster = imageUrl(movie.poster_path);
  const year = movie.release_date?.slice(0, 4);
  const delay = Math.min(index, Motion.maxStaggerItems) * Motion.stagger;

  // Width lives on this wrapper: Link asChild replaces the child's style prop.
  return (
    <Animated.View entering={FadeInDown.duration(Motion.enter).delay(delay)} style={{ width }}>
      <Link href={titleHref(movie)} asChild>
        <Pressable
          accessibilityLabel={movie.title}
          onPressIn={() => scale.set(withTiming(Motion.pressScale, { duration: Motion.press }))}
          onPressOut={() => scale.set(withTiming(1, { duration: Motion.press }))}>
          <Animated.View style={pressStyle}>
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
            <ThemedText type="small" themeColor="textSecondary">
              {year || '—'}
            </ThemedText>
          </Animated.View>
        </Pressable>
      </Link>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  poster: { width: '100%', aspectRatio: 2 / 3, borderRadius: Radius.md, overflow: 'hidden', justifyContent: 'center' },
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

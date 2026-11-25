import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import { imageUrl, titleHref, type Movie } from '@/api/tmdb';
import { Skeleton } from '@/components/skeleton';
import { ThemedText } from '@/components/themed-text';
import { Motion, Overlay, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const MAX_HEIGHT = 520;

/** Full-width backdrops that page automatically every few seconds. */
export function HeroCarousel({ items, loading }: { items?: Movie[]; loading?: boolean }) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const height = Math.min(width * 0.62, MAX_HEIGHT);
  const list = useRef<FlatList<Movie>>(null);
  const [active, setActive] = useState(0);
  const slides = (items ?? []).filter((m) => m.backdrop_path).slice(0, 6);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      const next = (active + 1) % slides.length;
      list.current?.scrollToIndex({ index: next, animated: true });
    }, Motion.heroInterval);
    return () => clearInterval(timer);
  }, [active, slides.length]);

  if (loading) return <Skeleton width="100%" height={height} radius={0} style={{ marginBottom: Spacing.four }} />;
  if (!slides.length) return null;

  return (
    <View style={{ marginBottom: Spacing.four }}>
      <FlatList
        ref={list}
        horizontal
        pagingEnabled
        data={slides}
        keyExtractor={(m) => `${m.media}-${m.id}`}
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        onMomentumScrollEnd={(e) => setActive(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(titleHref(item))} accessibilityLabel={item.title}>
            <View style={{ width, height }}>
              <Image source={imageUrl(item.backdrop_path, 'w1280')} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
              <LinearGradient colors={[Overlay.scrimStart, Overlay.scrimEnd]} style={StyleSheet.absoluteFill} />
              <View style={styles.caption}>
                <ThemedText style={[styles.title, { color: Overlay.onImage }]} numberOfLines={2}>
                  {item.title}
                </ThemedText>
                <ThemedText type="small" style={{ color: Overlay.onImageMuted }}>
                  {[item.release_date?.slice(0, 4), `★ ${item.vote_average.toFixed(1)}`].filter(Boolean).join('  ·  ')}
                </ThemedText>
                <View style={[styles.button, { backgroundColor: theme.accent }]}>
                  <ThemedText type="smallBold" style={{ color: theme.onAccent }}>
                    More info
                  </ThemedText>
                </View>
              </View>
            </View>
          </Pressable>
        )}
      />
      <View style={styles.dots}>
        {slides.map((m, i) => (
          <View
            key={m.id}
            style={[styles.dot, { backgroundColor: i === active ? Overlay.onImage : Overlay.dot, width: i === active ? 18 : 6 }]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  caption: { position: 'absolute', left: Spacing.three, right: Spacing.three, bottom: Spacing.five, gap: Spacing.one },
  title: { fontSize: 28, lineHeight: 34, fontWeight: 800 },
  button: {
    alignSelf: 'flex-start',
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.full,
  },
  dots: { position: 'absolute', bottom: Spacing.three, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: Spacing.one },
  dot: { height: 6, borderRadius: Radius.full },
});

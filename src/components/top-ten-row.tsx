import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

import { imageUrl, titleHref, type Movie } from '@/api/tmdb';
import { SectionHeader } from '@/components/section-header';
import { ThemedText } from '@/components/themed-text';
import { CardSize, Motion, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Netflix-style "Top 10" row: a large outlined rank number beside each poster. */
export function TopTenRow({ title, items }: { title: string; items?: Movie[] }) {
  const theme = useTheme();
  if (!items?.length) return null;

  return (
    <View style={{ marginBottom: Spacing.four }}>
      <SectionHeader title={title} />
      <FlatList
        horizontal
        data={items.slice(0, 10)}
        keyExtractor={(item) => `${item.media}-${item.id}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: Spacing.two, paddingHorizontal: Spacing.three }}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInRight.duration(Motion.enter).delay(Math.min(index, 6) * Motion.stagger)}>
            <Link href={titleHref(item)} asChild>
              <Pressable accessibilityLabel={`Number ${index + 1}: ${item.title}`} style={styles.item}>
                <ThemedText style={[styles.rank, { color: theme.background, textShadowColor: theme.textSecondary }]}>
                  {index + 1}
                </ThemedText>
                <Image
                  source={imageUrl(item.poster_path)}
                  style={[styles.poster, { backgroundColor: theme.backgroundElement }]}
                  contentFit="cover"
                  transition={200}
                />
              </Pressable>
            </Link>
          </Animated.View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: 'row', alignItems: 'flex-end' },
  rank: {
    fontSize: 96,
    lineHeight: 100,
    fontWeight: 900,
    marginRight: -Spacing.three,
    textShadowRadius: 2,
    textShadowOffset: { width: 0, height: 0 },
    zIndex: 0,
  },
  poster: { width: CardSize.topTen * 0.8, aspectRatio: 2 / 3, borderRadius: Radius.md },
});

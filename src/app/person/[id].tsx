import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { LayoutAnimation, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { imageUrl } from '@/api/tmdb';
import { MovieGrid } from '@/components/movie-grid';
import { ErrorView, LoadingView } from '@/components/state-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Motion, Radius, Spacing } from '@/constants/theme';
import { usePerson } from '@/hooks/use-movies';
import { useTheme } from '@/hooks/use-theme';

function formatDate(date: string | null) {
  return date ? new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : null;
}

export default function PersonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const query = usePerson(Number(id));
  const [bioOpen, setBioOpen] = useState(false);

  if (query.isPending) return <ThemedView style={{ flex: 1 }}><LoadingView /></ThemedView>;
  if (query.isError)
    return <ThemedView style={{ flex: 1 }}><ErrorView error={query.error} onRetry={() => query.refetch()} /></ThemedView>;

  const p = query.data;
  const born = [formatDate(p.birthday), p.place_of_birth].filter(Boolean).join(' · ');

  const header = (
    <Animated.View entering={FadeInDown.duration(Motion.enter)} style={styles.header}>
      <View style={styles.top}>
        <View style={[styles.photo, { backgroundColor: theme.backgroundElement }]}>
          {p.profile_path && <Image source={imageUrl(p.profile_path, 'w342')} style={StyleSheet.absoluteFill} contentFit="cover" />}
        </View>
        <View style={{ flex: 1, gap: Spacing.one }}>
          <ThemedText type="subtitle" style={{ fontSize: 26, lineHeight: 32 }}>{p.name}</ThemedText>
          <ThemedText type="smallBold" style={{ color: theme.accent }}>{p.known_for_department}</ThemedText>
          {born ? <ThemedText type="small" themeColor="textSecondary">Born {born}</ThemedText> : null}
        </View>
      </View>
      {p.biography ? (
        <Pressable
          onPress={() => {
            LayoutAnimation.easeInEaseOut();
            setBioOpen((v) => !v);
          }}>
          <ThemedText numberOfLines={bioOpen ? undefined : 5}>{p.biography}</ThemedText>
          <ThemedText type="smallBold" style={{ color: theme.accent, marginTop: Spacing.one }}>
            {bioOpen ? 'Show less' : 'Read more'}
          </ThemedText>
        </Pressable>
      ) : null}
      <ThemedText style={{ fontSize: 20, fontWeight: 700 }}>Known for ({p.credits.length})</ThemedText>
    </Animated.View>
  );

  return (
    <ThemedView style={{ flex: 1 }}>
      <Stack.Screen options={{ title: p.name }} />
      <MovieGrid movies={p.credits} header={header} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: { gap: Spacing.three, paddingBottom: Spacing.two },
  top: { flexDirection: 'row', gap: Spacing.three, alignItems: 'center' },
  photo: { width: 120, aspectRatio: 2 / 3, borderRadius: Radius.md, overflow: 'hidden' },
});

import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import type { Genre, MediaType } from '@/api/tmdb';
import { SectionHeader } from '@/components/section-header';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function GenreChips({ genres, media }: { genres?: Genre[]; media: MediaType }) {
  const theme = useTheme();
  if (!genres?.length) return null;

  return (
    <View style={{ marginBottom: Spacing.four }}>
      <SectionHeader title="Browse by genre" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>
        {genres.map((genre) => (
          <Link
            key={genre.id}
            href={{ pathname: '/genre/[id]', params: { id: genre.id, name: genre.name, media } }}
            asChild>
            <Pressable
              style={({ pressed }) => [
                styles.chip,
                { backgroundColor: pressed ? theme.backgroundSelected : theme.backgroundElement, borderColor: theme.border },
              ]}>
              <ThemedText type="smallBold">{genre.name}</ThemedText>
            </Pressable>
          </Link>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.two, paddingHorizontal: Spacing.three },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.full,
    borderWidth: StyleSheet.hairlineWidth,
  },
});

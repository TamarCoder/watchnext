import type { Href } from 'expo-router';
import { FlatList, View } from 'react-native';

import type { Movie } from '@/api/tmdb';
import { MovieCard } from '@/components/movie-card';
import { SectionHeader } from '@/components/section-header';
import { Skeleton } from '@/components/skeleton';
import { CardSize, Spacing } from '@/constants/theme';

type TitleRowProps = { title: string; items?: Movie[]; loading?: boolean; href?: Href };

/** A titled, horizontally scrolling row of posters. */
export function TitleRow({ title, items, loading, href }: TitleRowProps) {
  if (!loading && !items?.length) return null;

  return (
    <View style={{ marginBottom: Spacing.four }}>
      <SectionHeader title={title} href={href} />
      {loading ? (
        <View style={{ flexDirection: 'row', gap: Spacing.three, paddingHorizontal: Spacing.three }}>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} width={CardSize.row} aspectRatio={2 / 3} />
          ))}
        </View>
      ) : (
        <FlatList
          horizontal
          data={items}
          keyExtractor={(item) => `${item.media}-${item.id}`}
          renderItem={({ item, index }) => <MovieCard movie={item} width={CardSize.row} index={index} />}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: Spacing.three, paddingHorizontal: Spacing.three }}
        />
      )}
    </View>
  );
}

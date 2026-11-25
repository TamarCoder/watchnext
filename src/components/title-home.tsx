import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LIST_TITLES, type ListKind, type MediaType } from '@/api/tmdb';
import { GenreChips } from '@/components/genre-chips';
import { HeroCarousel } from '@/components/hero-carousel';
import { PeopleRow } from '@/components/people-row';
import { ScreenTitle } from '@/components/screen-title';
import { ErrorView } from '@/components/state-view';
import { ThemedView } from '@/components/themed-view';
import { TitleRow } from '@/components/title-row';
import { TopTenRow } from '@/components/top-ten-row';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useGenres, usePopularPeople, useTitleList } from '@/hooks/use-movies';
import { useTheme } from '@/hooks/use-theme';

const ROWS: Record<MediaType, ListKind[]> = {
  movie: ['now_playing', 'upcoming', 'top_rated', 'popular'],
  tv: ['airing_today', 'on_the_air', 'top_rated', 'popular'],
};

function ListRow({ media, kind }: { media: MediaType; kind: ListKind }) {
  const query = useTitleList(media, kind);
  return (
    <TitleRow
      title={LIST_TITLES[kind]}
      items={query.data?.results.filter((m) => m.poster_path)}
      loading={query.isPending}
      href={{ pathname: '/list/[kind]', params: { kind, media } }}
    />
  );
}

/** The Home layout shared by the Movies and TV tabs. */
export function TitleHome({ media, title }: { media: MediaType; title: string }) {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const trending = useTitleList(media, 'trending');
  const genres = useGenres(media);
  const people = usePopularPeople();

  const refresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries({ type: 'active' });
    setRefreshing(false);
  };

  if (trending.isError) {
    return (
      <ThemedView style={{ flex: 1 }}>
        <ErrorView error={trending.error} onRetry={() => trending.refetch()} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: Spacing.six }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={theme.accent} />}>
          <View style={{ paddingHorizontal: Spacing.three }}>
            <ScreenTitle title={title} />
          </View>
          <HeroCarousel items={trending.data?.results} loading={trending.isPending} />
          <View style={{ width: '100%', maxWidth: MaxContentWidth * 1.6, alignSelf: 'center' }}>
            <TopTenRow title="Top 10 this week" items={trending.data?.results.filter((m) => m.poster_path)} />
            <GenreChips genres={genres.data} media={media} />
            <ListRow media={media} kind={ROWS[media][0]} />
            <ListRow media={media} kind={ROWS[media][1]} />
            <PeopleRow
              title="Popular people"
              people={people.data?.map((p) => ({ ...p, subtitle: p.known_for_department }))}
            />
            <ListRow media={media} kind={ROWS[media][2]} />
            <ListRow media={media} kind={ROWS[media][3]} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

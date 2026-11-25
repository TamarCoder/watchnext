import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MovieGrid } from '@/components/movie-grid';
import { ScreenTitle } from '@/components/screen-title';
import { StateView } from '@/components/state-view';
import { ThemedView } from '@/components/themed-view';
import { useFavorites } from '@/providers/favorites-provider';

export default function FavoritesScreen() {
  const { favorites } = useFavorites();

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {favorites.length === 0 ? (
          <StateView
            icon={{ ios: 'heart', android: 'favorite_border', web: 'favorite_border' }}
            title="No favorites yet"
            message="Tap the heart on any movie to save it here."
            actionLabel="Browse trending"
            onAction={() => router.navigate('/')}
          />
        ) : (
          <MovieGrid movies={favorites} header={<ScreenTitle title="Favorites" subtitle={`${favorites.length} saved`} />} />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

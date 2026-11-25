import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { TmdbError } from '@/api/tmdb';
import { FavoritesProvider } from '@/providers/favorites-provider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      // Retrying a bad token or a missing movie will not help.
      retry: (count, error) => !(error instanceof TmdbError && error.kind !== 'network') && count < 2,
    },
  },
});

export default function RootLayout() {
  const scheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <FavoritesProvider>
        <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
          <StatusBar style="auto" />
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="movie/[id]" options={{ title: '', headerTransparent: true, headerBackTitle: 'Back' }} />
          </Stack>
        </ThemeProvider>
      </FavoritesProvider>
    </QueryClientProvider>
  );
}

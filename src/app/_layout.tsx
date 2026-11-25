import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { TmdbError } from '@/api/tmdb';
import { LanguageProvider } from '@/providers/language-provider';
import { LibraryProvider } from '@/providers/library-provider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      // Retrying a bad token or a missing title will not help.
      retry: (count, error) => !(error instanceof TmdbError && error.kind !== 'network') && count < 2,
    },
  },
});

const detailOptions = { title: '', headerTransparent: true, headerBackTitle: 'Back' } as const;

export default function RootLayout() {
  const scheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <LibraryProvider>
          <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
            <StatusBar style="auto" />
            <Stack screenOptions={{ animation: 'slide_from_right', headerBackTitle: 'Back' }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="movie/[id]" options={detailOptions} />
              <Stack.Screen name="tv/[id]" options={detailOptions} />
              <Stack.Screen name="person/[id]" options={{ title: '' }} />
              <Stack.Screen name="genre/[id]" options={{ title: '' }} />
              <Stack.Screen name="list/[kind]" options={{ title: '' }} />
            </Stack>
          </ThemeProvider>
        </LibraryProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

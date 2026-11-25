import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { TmdbError } from '@/api/tmdb';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type IconName = SymbolViewProps['name'];

type StateViewProps = {
  icon: IconName;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: 'neutral' | 'danger';
};

export function StateView({ icon, title, message, actionLabel, onAction, tone = 'neutral' }: StateViewProps) {
  const theme = useTheme();
  const iconColor = tone === 'danger' ? theme.danger : theme.textSecondary;

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: theme.backgroundElement }]}>
        <SymbolView name={icon} size={40} tintColor={iconColor} fallback={<ThemedText>!</ThemedText>} />
      </View>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.message}>
        {message}
      </ThemedText>
      {actionLabel && onAction && (
        <Pressable
          accessibilityRole="button"
          onPress={onAction}
          style={({ pressed }) => [styles.button, { backgroundColor: theme.accent, opacity: pressed ? 0.8 : 1 }]}>
          <ThemedText style={{ color: theme.onAccent, fontWeight: 700 }}>{actionLabel}</ThemedText>
        </Pressable>
      )}
    </View>
  );
}

const ERROR_COPY: Record<TmdbError['kind'], { icon: IconName; title: string; message: string }> = {
  'missing-token': {
    icon: { ios: 'key.slash', android: 'key_off', web: 'key_off' },
    title: 'API token missing',
    message: 'Add EXPO_PUBLIC_TMDB_TOKEN to your .env file and restart the app.',
  },
  unauthorized: {
    icon: { ios: 'lock.slash', android: 'lock', web: 'lock' },
    title: 'Access denied',
    message: 'Your TMDB token is not valid. Check it and try again.',
  },
  'not-found': {
    icon: { ios: 'film', android: 'movie', web: 'movie' },
    title: 'Movie not found',
    message: 'This movie may have been removed from TMDB.',
  },
  network: {
    icon: { ios: 'wifi.slash', android: 'wifi_off', web: 'wifi_off' },
    title: 'You are offline',
    message: 'Check your internet connection and try again.',
  },
  server: {
    icon: { ios: 'exclamationmark.triangle', android: 'warning', web: 'warning' },
    title: 'Something went wrong',
    message: 'TMDB is not responding right now. Please try again soon.',
  },
};

export function ErrorView({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  const kind = error instanceof TmdbError ? error.kind : 'server';
  const canRetry = kind === 'network' || kind === 'server';
  return <StateView {...ERROR_COPY[kind]} tone="danger" actionLabel={canRetry ? 'Try again' : undefined} onAction={onRetry} />;
}

export function LoadingView() {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.five, gap: Spacing.three },
  iconCircle: { width: 96, height: 96, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 700, textAlign: 'center' },
  message: { textAlign: 'center', maxWidth: 320 },
  button: { marginTop: Spacing.two, paddingHorizontal: Spacing.four, paddingVertical: Spacing.three, borderRadius: Radius.full },
});

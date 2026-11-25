import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { TmdbError } from '@/api/tmdb';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useLanguage } from '@/providers/language-provider';

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

const ERROR_ICONS: Record<TmdbError['kind'], IconName> = {
  'missing-token': { ios: 'key.slash', android: 'key_off', web: 'key_off' },
  unauthorized: { ios: 'lock.slash', android: 'lock', web: 'lock' },
  'not-found': { ios: 'film', android: 'movie', web: 'movie' },
  network: { ios: 'wifi.slash', android: 'wifi_off', web: 'wifi_off' },
  server: { ios: 'exclamationmark.triangle', android: 'warning', web: 'warning' },
};

export function ErrorView({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  const kind = error instanceof TmdbError ? error.kind : 'server';
  const { t } = useLanguage();
  const canRetry = kind === 'network' || kind === 'server';
  return (
    <StateView
      icon={ERROR_ICONS[kind]}
      title={t(`error.${kind}.title`)}
      message={t(`error.${kind}.message`)}
      tone="danger"
      actionLabel={canRetry ? t('common.tryAgain') : undefined}
      onAction={onRetry}
    />
  );
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

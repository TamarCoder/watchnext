import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';

import type { Movie } from '@/api/tmdb';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { WATCH_STATUSES } from '@/lib/library';
import { useLanguage } from '@/providers/language-provider';
import { useLibrary } from '@/providers/library-provider';

const ICONS = { want: '🔖', watching: '▶︎', watched: '✓' } as const;

/** Watch status buttons plus a 5-star personal rating. */
export function StatusPicker({ movie }: { movie: Movie }) {
  const theme = useTheme();
  const { t } = useLanguage();
  const { entry, changeStatus, rate } = useLibrary();
  const current = entry(movie);

  const pick = (status: (typeof WATCH_STATUSES)[number]) => {
    Haptics.selectionAsync();
    changeStatus(movie, current?.status === status ? null : status);
  };

  const star = (value: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    rate(movie, value);
  };

  return (
    <View style={{ gap: Spacing.three }}>
      <View style={styles.row}>
        {WATCH_STATUSES.map((status) => {
          const active = current?.status === status;
          return (
            <Pressable
              key={status}
              onPress={() => pick(status)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={({ pressed }) => [
                styles.status,
                { backgroundColor: active ? theme.accent : theme.backgroundElement, opacity: pressed ? 0.8 : 1 },
              ]}>
              <ThemedText type="smallBold" style={{ color: active ? theme.onAccent : theme.text }} numberOfLines={1}>
                {ICONS[status]} {t(`status.${status}`)}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.ratingRow}>
        <ThemedText type="smallBold">{t('details.myRating')}</ThemedText>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((value) => {
            const filled = (current?.rating ?? 0) >= value;
            return (
              <Pressable key={value} onPress={() => star(value)} hitSlop={6} accessibilityLabel={`${value} / 5`}>
                <ThemedText style={{ fontSize: 28, color: filled ? theme.rating : theme.border }}>★</ThemedText>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.two },
  status: { flex: 1, alignItems: 'center', paddingVertical: Spacing.three, borderRadius: Radius.full },
  ratingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stars: { flexDirection: 'row', gap: Spacing.one },
});

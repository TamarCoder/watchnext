import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MovieGrid } from '@/components/movie-grid';
import { ScreenTitle } from '@/components/screen-title';
import { StateView } from '@/components/state-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { entriesByStatus, WATCH_STATUSES, type WatchStatus } from '@/lib/library';
import { useLanguage } from '@/providers/language-provider';
import { useLibrary } from '@/providers/library-provider';

export default function LibraryScreen() {
  const theme = useTheme();
  const { t } = useLanguage();
  const { library } = useLibrary();
  const [status, setStatus] = useState<WatchStatus>('want');
  const entries = entriesByStatus(library, status);

  const header = (
    <View style={{ gap: Spacing.three, paddingBottom: Spacing.two }}>
      <ScreenTitle title={t('library.title')} subtitle={t('library.count', { count: entries.length })} />
      <View style={styles.tabs}>
        {WATCH_STATUSES.map((s) => {
          const active = s === status;
          const count = entriesByStatus(library, s).length;
          return (
            <Pressable
              key={s}
              onPress={() => setStatus(s)}
              accessibilityState={{ selected: active }}
              style={[styles.tab, { backgroundColor: active ? theme.accent : theme.backgroundElement }]}>
              <ThemedText type="smallBold" numberOfLines={1} style={{ color: active ? theme.onAccent : theme.text }}>
                {t(`status.${s}`)} · {count}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {entries.length === 0 ? (
          <View style={{ flex: 1, padding: Spacing.three }}>
            {header}
            <StateView
              icon={{ ios: 'bookmark', android: 'bookmark_border', web: 'bookmark_border' }}
              title={t('library.emptyTitle')}
              message={t('library.emptyMessage')}
              actionLabel={t('library.browse')}
              onAction={() => router.navigate('/')}
            />
          </View>
        ) : (
          <MovieGrid movies={entries.map((e) => e.movie)} header={header} />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', gap: Spacing.two },
  tab: { flex: 1, alignItems: 'center', paddingVertical: Spacing.two, borderRadius: Radius.full },
});

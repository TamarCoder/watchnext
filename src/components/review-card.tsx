import { useState } from 'react';
import { LayoutAnimation, Pressable, StyleSheet, View } from 'react-native';

import type { Review } from '@/api/tmdb';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useLanguage } from '@/providers/language-provider';

export function ReviewCard({ review }: { review: Review }) {
  const theme = useTheme();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const rating = review.author_details.rating;

  const toggle = () => {
    LayoutAnimation.easeInEaseOut();
    setOpen((value) => !value);
  };

  return (
    <Pressable
      onPress={toggle}
      accessibilityHint={open ? 'Collapse review' : 'Expand review'}
      style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
      <View style={styles.header}>
        <ThemedText type="smallBold" numberOfLines={1} style={{ flex: 1 }}>
          {review.author}
        </ThemedText>
        {rating ? (
          <ThemedText type="smallBold" style={{ color: theme.rating }}>
            ★ {rating}/10
          </ThemedText>
        ) : null}
      </View>
      <ThemedText type="small" themeColor="textSecondary">
        {new Date(review.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
      </ThemedText>
      <ThemedText numberOfLines={open ? undefined : 4} style={{ marginTop: Spacing.two }}>
        {review.content}
      </ThemedText>
      <ThemedText type="smallBold" style={{ color: theme.accent, marginTop: Spacing.one }}>
        {open ? t('common.showLess') : t('common.readMore')}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { padding: Spacing.three, borderRadius: Radius.md, gap: Spacing.half },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
});

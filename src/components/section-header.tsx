import { Link, type Href } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function SectionHeader({ title, href }: { title: string; href?: Href }) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      {href ? (
        <Link href={href} asChild>
          <Pressable hitSlop={12} accessibilityRole="link">
            <ThemedText type="smallBold" style={{ color: theme.accent }}>
              See all
            </ThemedText>
          </Pressable>
        </Link>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.two,
  },
  title: { fontSize: 20, fontWeight: 700 },
});

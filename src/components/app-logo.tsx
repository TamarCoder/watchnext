import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const MARK_RATIO = 634 / 390;

/** Logo mark + "watchnext" wordmark; "watch" follows the theme, "next" stays red. */
export function AppLogo({ size = 28 }: { size?: number }) {
  const theme = useTheme();

  return (
    <View style={styles.row} accessibilityRole="header" accessibilityLabel="Watchnext">
      <Image source={require('@/assets/images/logo-mark.png')} style={{ height: size, width: size * MARK_RATIO }} />
      <Text style={[styles.word, { fontSize: size * 0.95 }]}>
        <Text style={{ color: theme.text }}>watch</Text>
        <Text style={{ color: theme.accent }}>next</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, paddingVertical: Spacing.two },
  word: { fontWeight: 800, letterSpacing: -0.8 },
});

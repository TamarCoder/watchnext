import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export function ScreenTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={{ paddingVertical: Spacing.two }}>
      <ThemedText type="subtitle">{title}</ThemedText>
      {subtitle ? <ThemedText themeColor="textSecondary">{subtitle}</ThemedText> : null}
    </View>
  );
}

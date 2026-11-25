import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { LANGUAGES, type Language } from '@/lib/i18n';
import { useLanguage } from '@/providers/language-provider';

const LABELS: Record<Language, string> = { en: 'EN', ka: 'ქარ' };

/** Two-option pill that switches the UI and TMDB content language. */
export function LanguageToggle() {
  const theme = useTheme();
  const { lang, setLang } = useLanguage();

  return (
    <View style={[styles.pill, { backgroundColor: theme.backgroundElement }]} accessibilityRole="radiogroup">
      {LANGUAGES.map((option) => {
        const active = option === lang;
        return (
          <Pressable
            key={option}
            onPress={() => setLang(option)}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            style={[styles.option, active && { backgroundColor: theme.accent }]}>
            <ThemedText type="smallBold" style={{ color: active ? theme.onAccent : theme.textSecondary }}>
              {LABELS[option]}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { flexDirection: 'row', borderRadius: Radius.full, padding: Spacing.half },
  option: { paddingHorizontal: Spacing.three, paddingVertical: Spacing.one, borderRadius: Radius.full },
});

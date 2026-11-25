import { NativeTabs } from 'expo-router/native-tabs';

import { useTheme } from '@/hooks/use-theme';
import { useLanguage } from '@/providers/language-provider';

export default function TabsLayout() {
  const theme = useTheme();
  const { t } = useLanguage();

  return (
    <NativeTabs
      backgroundColor={theme.background}
      indicatorColor={theme.backgroundElement}
      labelStyle={{ selected: { color: theme.accent } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>{t('tab.movies')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="film.fill" md="movie" selectedColor={theme.accent} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="tv">
        <NativeTabs.Trigger.Label>{t('tab.tv')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="tv.fill" md="tv" selectedColor={theme.accent} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search">
        <NativeTabs.Trigger.Label>{t('tab.search')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="magnifyingglass" md="search" selectedColor={theme.accent} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="library">
        <NativeTabs.Trigger.Label>{t('tab.library')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="bookmark.fill" md="bookmark" selectedColor={theme.accent} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

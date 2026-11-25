import { NativeTabs } from 'expo-router/native-tabs';

import { useTheme } from '@/hooks/use-theme';

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <NativeTabs
      backgroundColor={theme.background}
      indicatorColor={theme.backgroundElement}
      labelStyle={{ selected: { color: theme.accent } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Movies</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="film.fill" md="movie" selectedColor={theme.accent} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="tv">
        <NativeTabs.Trigger.Label>TV Shows</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="tv.fill" md="tv" selectedColor={theme.accent} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search">
        <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="magnifyingglass" md="search" selectedColor={theme.accent} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="favorites">
        <NativeTabs.Trigger.Label>Favorites</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="heart.fill" md="favorite" selectedColor={theme.accent} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { imageUrl } from '@/api/tmdb';
import { ThemedText } from '@/components/themed-text';
import { CardSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type PersonAvatarProps = { id: number; name: string; subtitle?: string; photo: string | null; size?: number };

export function PersonAvatar({ id, name, subtitle, photo, size = CardSize.avatar }: PersonAvatarProps) {
  const theme = useTheme();
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');

  return (
    <Link href={{ pathname: '/person/[id]', params: { id } }} asChild>
      <Pressable style={{ width: size + Spacing.three }} accessibilityLabel={name}>
        <View style={[styles.photo, { width: size, height: size, backgroundColor: theme.backgroundElement }]}>
          {photo ? (
            <Image source={imageUrl(photo, 'w185')} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
          ) : (
            <ThemedText style={{ fontSize: size / 3, fontWeight: 700 }} themeColor="textSecondary">
              {initials}
            </ThemedText>
          )}
        </View>
        <ThemedText type="smallBold" numberOfLines={2} style={styles.center}>
          {name}
        </ThemedText>
        {subtitle ? (
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={1} style={styles.center}>
            {subtitle}
          </ThemedText>
        ) : null}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  photo: {
    alignSelf: 'center',
    borderRadius: Radius.full,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  center: { textAlign: 'center' },
});

import { Image } from 'expo-image';
import { ScrollView, StyleSheet, View } from 'react-native';

import { imageUrl, PROVIDER_REGION, type Provider } from '@/api/tmdb';
import { SectionHeader } from '@/components/section-header';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';

export function ProviderLogos({ providers }: { providers: Provider[] }) {
  if (!providers.length) return null;

  return (
    <View style={{ marginBottom: Spacing.four }}>
      <SectionHeader title={`Where to watch (${PROVIDER_REGION})`} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>
        {providers.map((p) => (
          <View key={p.provider_id} style={styles.item}>
            <Image source={imageUrl(p.logo_path, 'w92')} style={styles.logo} accessibilityLabel={p.provider_name} />
            <ThemedText type="small" themeColor="textSecondary" numberOfLines={1} style={styles.name}>
              {p.provider_name}
            </ThemedText>
          </View>
        ))}
      </ScrollView>
      <ThemedText type="small" themeColor="textSecondary" style={styles.credit}>
        Streaming data by JustWatch
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.three, paddingHorizontal: Spacing.three },
  item: { width: 64, alignItems: 'center', gap: Spacing.one },
  logo: { width: 52, height: 52, borderRadius: Radius.md },
  name: { textAlign: 'center', fontSize: 11 },
  credit: { paddingHorizontal: Spacing.three, marginTop: Spacing.two, fontSize: 11 },
});

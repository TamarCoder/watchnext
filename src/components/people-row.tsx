import { FlatList, View } from 'react-native';

import { PersonAvatar } from '@/components/person-avatar';
import { SectionHeader } from '@/components/section-header';
import { Spacing } from '@/constants/theme';

type PersonItem = { id: number; name: string; profile_path: string | null; subtitle?: string };

export function PeopleRow({ title, people }: { title: string; people?: PersonItem[] }) {
  if (!people?.length) return null;

  return (
    <View style={{ marginBottom: Spacing.four }}>
      <SectionHeader title={title} />
      <FlatList
        horizontal
        data={people}
        keyExtractor={(p) => String(p.id)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: Spacing.two, paddingHorizontal: Spacing.three }}
        renderItem={({ item }) => (
          <PersonAvatar id={item.id} name={item.name} subtitle={item.subtitle} photo={item.profile_path} />
        )}
      />
    </View>
  );
}

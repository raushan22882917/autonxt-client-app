import React, { useState } from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { PlantFilter } from '@/components/PlantFilter';
import { TractorCard } from '@/components/TractorCard';
import { Tractor } from '@/lib/appsync';

export default function TractorsScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { filteredTractors, isLoading, refresh } = useApp();
  const [search, setSearch] = useState('');

  const topPad = Platform.OS === 'web' ? 67 : 0;

  // Only show commissioned tractors (those with a commissioning date set).
  const commissioned = filteredTractors.filter(t => !!t.commissionDate);

  const displayed = search.trim()
    ? commissioned.filter(
        t =>
          t.model.toLowerCase().includes(search.toLowerCase()) ||
          t.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
          (t.plantName || '').toLowerCase().includes(search.toLowerCase())
      )
    : commissioned;

  const renderTractor = ({ item }: { item: Tractor }) => (
    <TractorCard
      tractor={item}
      onPress={() => router.push(`/tractor/${encodeURIComponent(item.tractorID)}`)}
    />
  );

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      {/* Search bar */}
      <View style={[styles.searchWrap, { paddingTop: topPad + 12 }]}>
        <View style={[styles.searchBox, { backgroundColor: c.card, borderColor: c.border }]}>
          <Feather name="search" size={16} color={c.mutedForeground} style={{ marginRight: 8 }} />
          <TextInput
            style={[styles.searchInput, { color: c.foreground }]}
            placeholder="Search tractors..."
            placeholderTextColor={c.mutedForeground}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} activeOpacity={0.7}>
              <Feather name="x" size={16} color={c.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <PlantFilter />

      <FlatList
        data={displayed}
        keyExtractor={t => t.tractorID}
        renderItem={renderTractor}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor={c.primary} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="truck" size={36} color={c.border} />
            <Text style={[styles.emptyText, { color: c.mutedForeground }]}>No tractors found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  searchWrap: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 46,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 12,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});

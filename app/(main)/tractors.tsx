import React, { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';
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
import { TractorCard } from '@/components/TractorCard';
import { Tractor } from '@/lib/appsync';

type StatusFilter = 'ALL' | 'ACTIVE' | 'MAINTENANCE' | 'IDLE' | 'OFFLINE';

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'ACTIVE', label: 'Active' },
  { key: 'MAINTENANCE', label: 'Maint.' },
  { key: 'IDLE', label: 'Idle' },
  { key: 'OFFLINE', label: 'Offline' },
];

export default function TractorsScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { filteredTractors, isLoading, isLoadingMorePlants, refreshLiveTelemetry } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refreshLiveTelemetry();
      const timer = setInterval(() => refreshLiveTelemetry(), 120_000);
      return () => clearInterval(timer);
    }, [refreshLiveTelemetry])
  );

  const onPullRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshLiveTelemetry();
    } finally {
      setRefreshing(false);
    }
  };

  const topPad = Platform.OS === 'web' ? 67 : 0;

  const displayed = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = filteredTractors;

    if (statusFilter !== 'ALL') {
      list = list.filter(t => t.status === statusFilter);
    }

    if (q) {
      list = list.filter(
        t =>
          t.displayName.toLowerCase().includes(q) ||
          t.model.toLowerCase().includes(q) ||
          t.tractorID.toLowerCase().includes(q) ||
          t.serialNumber.toLowerCase().includes(q) ||
          (t.registerNumber || '').toLowerCase().includes(q) ||
          (t.plantName || '').toLowerCase().includes(q) ||
          (t.liveLocation || '').toLowerCase().includes(q)
      );
    }

    return list;
  }, [filteredTractors, search, statusFilter]);

  // Count per status
  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const t of filteredTractors) {
      map[t.status] = (map[t.status] ?? 0) + 1;
    }
    map['ALL'] = filteredTractors.length;
    return map;
  }, [filteredTractors]);

  const openDetail = (tractorID: string) =>
    router.push(`/tractor/${encodeURIComponent(tractorID)}`);

  const renderTractor = ({ item }: { item: Tractor }) => (
    <TractorCard tractor={item} onOpenDetail={() => openDetail(item.tractorID)} />
  );

  const ListHeader = (
    <View style={[styles.listHeader, { paddingTop: topPad + 14 }]}>
      {/* Search bar */}
      <View style={[styles.searchBox, { backgroundColor: c.card, borderColor: c.border, shadowColor: c.shadow }]}>
        <Feather name="search" size={17} color={c.mutedForeground} />
        <TextInput
          style={[styles.searchInput, { color: c.foreground }]}
          placeholder="Search by ID, model, location…"
          placeholderTextColor={c.mutedForeground + '99'}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearch('')}
            hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          >
            <View style={[styles.clearBtn, { backgroundColor: c.border }]}>
              <Feather name="x" size={12} color={c.mutedForeground} />
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Status filter chips */}
      <View style={styles.filterChips}>
        {STATUS_FILTERS.map(f => {
          const active = statusFilter === f.key;
          const count = counts[f.key] ?? 0;
          return (
            <TouchableOpacity
              key={f.key}
              style={[
                styles.filterChip,
                {
                  backgroundColor: active ? c.primary : c.card,
                  borderColor: active ? c.primary : c.border,
                  shadowColor: active ? c.primary : 'transparent',
                },
              ]}
              onPress={() => setStatusFilter(f.key)}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.filterChipLabel,
                  { color: active ? c.primaryForeground : c.foreground },
                ]}
              >
                {f.label}
              </Text>
              {f.key !== 'ALL' && (
                <View
                  style={[
                    styles.filterChipCount,
                    { backgroundColor: active ? c.primaryForeground + '25' : c.muted },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipCountText,
                      { color: active ? c.primaryForeground : c.mutedForeground },
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Results info */}
      <View style={styles.resultsRow}>
        <Text style={[styles.resultsText, { color: c.mutedForeground }]}>
          {displayed.length} tractor{displayed.length !== 1 ? 's' : ''}
          {statusFilter !== 'ALL' ? ` · ${statusFilter.toLowerCase()}` : ''}
        </Text>
        {isLoadingMorePlants && (
          <Text style={[styles.syncingText, { color: c.primary }]}>Syncing…</Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <FlatList
        data={displayed}
        keyExtractor={t => t.tractorID}
        renderItem={renderTractor}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isLoadingMorePlants}
            onRefresh={onPullRefresh}
            tintColor={c.primary}
          />
        }
        ListEmptyComponent={
          <View style={[styles.empty, { backgroundColor: c.card, borderColor: c.border }]}>
            <View style={[styles.emptyIconWrap, { backgroundColor: c.surfaceAlt }]}>
              <Feather name="truck" size={32} color={c.mutedForeground} />
            </View>
            <Text style={[styles.emptyTitle, { color: c.foreground }]}>
              {search ? 'No Results' : 'No Tractors'}
            </Text>
            <Text style={[styles.emptyText, { color: c.mutedForeground }]}>
              {search
                ? `No tractors match "${search}"`
                : 'No tractors found for the selected plant'}
            </Text>
            {search ? (
              <TouchableOpacity
                style={[styles.clearSearchBtn, { borderColor: c.border }]}
                onPress={() => setSearch('')}
              >
                <Text style={[styles.clearSearchText, { color: c.primary }]}>Clear search</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  listHeader: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    paddingVertical: 0,
  },
  clearBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChips: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 24,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  filterChipLabel: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  filterChipCount: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  filterChipCountText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  resultsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultsText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  syncingText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  separator: {
    height: 12,
  },
  empty: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 8,
    gap: 10,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.3,
  },
  emptyText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  clearSearchBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
  },
  clearSearchText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
});

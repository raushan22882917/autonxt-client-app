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
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { TractorCard } from '@/components/TractorCard';
import { Tractor } from '@/lib/appsync';

type StatusFilter = 'ALL' | 'ACTIVE' | 'MAINTENANCE' | 'IDLE' | 'OFFLINE';

const STATUS_FILTERS: {
  key: StatusFilter;
  label: string;
  icon: string;
  activeColor: string;
  activeBg: string;
}[] = [
  { key: 'ALL',         label: 'All',    icon: 'layers',    activeColor: '#FFFFFF', activeBg: '#D73220' },
  { key: 'ACTIVE',      label: 'Active', icon: 'zap',       activeColor: '#FFFFFF', activeBg: '#10B981' },
  { key: 'MAINTENANCE', label: 'Maint.', icon: 'tool',      activeColor: '#FFFFFF', activeBg: '#0B78B3' },
  { key: 'IDLE',        label: 'Idle',   icon: 'clock',     activeColor: '#FFFFFF', activeBg: '#F59E0B' },
  { key: 'OFFLINE',     label: 'Offline',icon: 'wifi-off',  activeColor: '#FFFFFF', activeBg: '#94A3B8' },
];

// ── Inline count label colors per status ────────────────────────────────────
const STATUS_PILL_CONFIG: Record<StatusFilter, { bg: string; text: string }> = {
  ALL:         { bg: '#FDE8E5', text: '#D73220' },
  ACTIVE:      { bg: '#D1FAE5', text: '#065F46' },
  MAINTENANCE: { bg: '#DBEAFE', text: '#1E40AF' },
  IDLE:        { bg: '#FEF3C7', text: '#92400E' },
  OFFLINE:     { bg: '#F1F5F9', text: '#475569' },
};

export default function TractorsScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { filteredTractors, isLoading, isLoadingMorePlants, refreshLiveTelemetry } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [refreshing, setRefreshing] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

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
    <View style={[styles.header, { paddingTop: topPad + 16 }]}>
      {/* ── Fleet Management Hero Strip ── */}
      <View style={[styles.heroStrip, { shadowColor: c.primary }]}>
        <LinearGradient
          colors={[c.gradientStart, c.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.heroGradient}
        >
          {/* Geometric decoration */}
          <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
            <View style={styles.heroDotTR} />
            <View style={styles.heroGridH} />
          </View>

          <View style={styles.heroLeft}>
            <Text style={styles.heroSuper}>FLEET MANAGEMENT</Text>
            <Text style={styles.heroTitle}>All Tractors</Text>
          </View>

          <View style={styles.heroRight}>
            <View style={styles.heroBadge}>
              <Feather name="truck" size={14} color="#FFFFFF" />
              <Text style={styles.heroBadgeNum}>{filteredTractors.length}</Text>
            </View>
            {isLoadingMorePlants && (
              <View style={styles.syncIndicator}>
                <Text style={styles.syncLabel}>Syncing</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </View>

      {/* ── Search + Filter area ── */}
      <View style={styles.controlBar}>
        {/* Search bar */}
        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: c.card,
              borderColor: searchFocused ? c.blue : c.border,
              shadowColor: searchFocused ? c.blue : c.shadow,
              shadowOpacity: searchFocused ? 0.12 : 0.04,
            },
          ]}
        >
          <Feather name="search" size={17} color={searchFocused ? c.blue : c.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: c.foreground }]}
            placeholder="Search by ID, model, location…"
            placeholderTextColor={c.mutedForeground + '99'}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
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
            const pill = STATUS_PILL_CONFIG[f.key];
            return (
              <TouchableOpacity
                key={f.key}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: active ? f.activeBg : c.card,
                    borderColor: active ? f.activeBg : c.border,
                    shadowColor: active ? f.activeBg : 'transparent',
                    shadowOpacity: active ? 0.3 : 0,
                    shadowOffset: { width: 0, height: 3 },
                    shadowRadius: 8,
                    elevation: active ? 4 : 1,
                  },
                ]}
                onPress={() => setStatusFilter(f.key)}
                activeOpacity={0.75}
              >
                <Feather
                  name={f.icon as any}
                  size={12}
                  color={active ? f.activeColor : c.mutedForeground}
                />
                <Text
                  style={[
                    styles.filterChipLabel,
                    { color: active ? f.activeColor : c.foreground },
                  ]}
                >
                  {f.label}
                </Text>
                {/* Count pill */}
                <View
                  style={[
                    styles.filterChipCount,
                    {
                      backgroundColor: active ? 'rgba(255,255,255,0.25)' : pill.bg,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipCountText,
                      { color: active ? '#FFFFFF' : pill.text },
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Results info */}
        <View style={styles.resultsRow}>
          <View style={[styles.sectionAccent, { backgroundColor: c.primary }]} />
          <Text style={[styles.resultsText, { color: c.foreground }]}>
            <Text style={[styles.resultsBold, { color: c.foreground }]}>{displayed.length}</Text>
            {' '}tractor{displayed.length !== 1 ? 's' : ''}
            {statusFilter !== 'ALL' ? (
              <Text style={[{ color: c.mutedForeground }]}> · {statusFilter.toLowerCase()}</Text>
            ) : null}
          </Text>
          {isLoadingMorePlants && (
            <View style={[styles.livePill, { backgroundColor: c.blue + '18', borderColor: c.blue + '35' }]}>
              <Text style={[styles.livePillText, { color: c.blue }]}>Syncing…</Text>
            </View>
          )}
        </View>
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
                style={[styles.clearSearchBtn, { borderColor: c.border, backgroundColor: c.surfaceAlt }]}
                onPress={() => setSearch('')}
              >
                <Feather name="x" size={14} color={c.primary} />
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

  header: {
    gap: 14,
    paddingBottom: 4,
    paddingHorizontal: 0,
  },

  // ── Hero strip ──
  heroStrip: {
    borderRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 7,
  },
  heroGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
    overflow: 'hidden',
    borderRadius: 22,
  },
  heroDotTR: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    top: -30,
    right: -20,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  heroGridH: {
    position: 'absolute',
    left: '40%',
    right: 0,
    top: '60%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  heroLeft: { flex: 1, gap: 2 },
  heroSuper: {
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 1.6,
  },
  heroTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  heroRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  heroBadgeNum: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  syncIndicator: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  syncLabel: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 0.3,
  },

  // ── Control bar ──
  controlBar: {
    paddingHorizontal: 0,
    paddingBottom: 12,
    gap: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1.5,
  },
  filterChipLabel: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.1,
  },
  filterChipCount: {
    minWidth: 20,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  filterChipCountText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  resultsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionAccent: {
    width: 4,
    height: 16,
    borderRadius: 2,
  },
  resultsText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    flex: 1,
  },
  resultsBold: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
  },
  livePill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  livePillText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },

  // ── List ──
  list: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  separator: { height: 12 },

  // ── Empty ──
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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

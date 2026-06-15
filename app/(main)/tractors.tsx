import React, { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  BackHandler,
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
import { useRouter, useLocalSearchParams } from 'expo-router';
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
  { key: 'ALL',         label: 'All',    icon: 'layers',    activeColor: '#FFFFFF', activeBg: '#7E152F' },
  { key: 'ACTIVE',      label: 'Active', icon: 'zap',       activeColor: '#FFFFFF', activeBg: '#7E152F' },
  { key: 'MAINTENANCE', label: 'Maint.', icon: 'tool',      activeColor: '#FFFFFF', activeBg: '#7E152F' },
  { key: 'IDLE',        label: 'Idle',   icon: 'clock',     activeColor: '#FFFFFF', activeBg: '#7E152F' },
  { key: 'OFFLINE',     label: 'Offline',icon: 'wifi-off',  activeColor: '#FFFFFF', activeBg: '#7E152F' },
];

// ── Inline count label colors per status ────────────────────────────────────
const STATUS_PILL_CONFIG: Record<StatusFilter, { bg: string; text: string }> = {
  ALL:         { bg: '#FDF2F4', text: '#7E152F' },
  ACTIVE:      { bg: '#E6F4EA', text: '#137333' },
  MAINTENANCE: { bg: '#E8F0FE', text: '#1A73E8' },
  IDLE:        { bg: '#FEF7E0', text: '#B06000' },
  OFFLINE:     { bg: '#F1F3F4', text: '#5F6368' },
};

export default function TractorsScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    filteredTractors,
    isLoading,
    isLoadingMorePlants,
    refreshLiveTelemetry,
    tractorSearch,
    setTractorSearch,
  } = useApp();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const { from } = useLocalSearchParams<{ from?: string }>();
  const fromProfile = from === 'profile';

  useFocusEffect(
    useCallback(() => {
      refreshLiveTelemetry();
      const timer = setInterval(() => refreshLiveTelemetry(), 120_000);
      return () => clearInterval(timer);
    }, [refreshLiveTelemetry])
  );

  // Intercept Android hardware back → return to Profile when navigated from there
  useFocusEffect(
    useCallback(() => {
      if (!fromProfile) return;
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        router.replace('/(main)/profile');
        return true;
      });
      return () => sub.remove();
    }, [fromProfile, router])
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
    const q = tractorSearch.trim().toLowerCase();
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
  }, [filteredTractors, tractorSearch, statusFilter]);

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
    <View style={[styles.header, { paddingTop: topPad + 32 }]}>
      {/* Back to Profile button */}
      {fromProfile && (
        <TouchableOpacity
          style={styles.backToProfile}
          onPress={() => router.replace('/(main)/profile')}
          activeOpacity={0.75}
        >
          <Feather name="chevron-left" size={16} color="#7E152F" />
          <Text style={styles.backToProfileText}>Back to Account</Text>
        </TouchableOpacity>
      )}

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
                    backgroundColor: active ? f.activeBg : '#FFFFFF',
                    borderColor: active ? f.activeBg : '#E2E8F0',
                  },
                ]}
                onPress={() => setStatusFilter(f.key)}
                activeOpacity={0.75}
              >
                <Feather
                  name={f.icon as any}
                  size={12}
                  color={active ? f.activeColor : '#94A3B8'}
                />
                <Text
                  style={[
                    styles.filterChipLabel,
                    { color: active ? f.activeColor : '#0F172A' },
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
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
            <View style={[styles.sectionAccent, { backgroundColor: '#7E152F' }]} />
            <Text style={[styles.resultsText, { color: '#0F172A' }]}>
              <Text style={[styles.resultsBold, { color: '#0F172A' }]}>{displayed.length}</Text>
              {' '}Tractor{displayed.length !== 1 ? 's' : ''}
            </Text>
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
              {tractorSearch ? 'No Results' : 'No Tractors'}
            </Text>
            <Text style={[styles.emptyText, { color: c.mutedForeground }]}>
              {tractorSearch
                ? `No tractors match "${tractorSearch}"`
                : 'No tractors found for the selected plant'}
            </Text>
            {tractorSearch ? (
              <TouchableOpacity
                style={[styles.clearSearchBtn, { borderColor: c.border, backgroundColor: c.surfaceAlt }]}
                onPress={() => setTractorSearch('')}
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
  backToProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    marginBottom: -4,
  },
  backToProfileText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#7E152F',
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 17,
    height: 34,
    paddingHorizontal: 12,
  },
  filterCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F8D7DA',
    backgroundColor: '#FDF2F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
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
    marginTop: 6,
    marginBottom: 6,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  filterChipLabel: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.1,
  },
  filterChipCount: {
    minWidth: 20,
    height: 18,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    marginLeft: 2,
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(8, 16, 43, 0.5)',
    justifyContent: 'flex-end',
  },
  menu: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    maxHeight: '50%',
    overflow: 'hidden',
    shadowColor: '#120E10',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
    paddingBottom: 20,
  },
  sheetHandleWrap: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 4,
    width: '100%',
  },
  sheetHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
  },
  menuScroll: {
    paddingVertical: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 12,
    marginBottom: 8,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  optionBody: { flex: 1, gap: 2 },
  optionLabel: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.1,
  },
  optionSub: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
});

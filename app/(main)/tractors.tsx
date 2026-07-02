import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  BackHandler,
  FlatList,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
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
    tractors,
    filteredTractors,
    isLoading,
    isLoadingMorePlants,
    refreshLiveTelemetry,
    tractorSearch,
    setTractorSearch,
    plants,
    selectedPlantID,
    setSelectedPlantID,
  } = useApp();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [refreshing, setRefreshing] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownQuery, setDropdownQuery] = useState('');

  const openDropdown = () => {
    setDropdownQuery('');
    setDropdownOpen(true);
  };

  useEffect(() => {
    setSelectedPlantID(null);
  }, [setSelectedPlantID]);

  const countFor = useCallback((plantID: string) => {
    return tractors.filter(t => t.plantID === plantID).length;
  }, [tractors]);

  const filteredPlantsForDropdown = useMemo(() => {
    const q = dropdownQuery.trim().toLowerCase();
    if (!q) return plants;
    return plants.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.location || '').toLowerCase().includes(q)
    );
  }, [plants, dropdownQuery]);

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



        {/* Results info */}
        <View style={styles.resultsRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
            <View style={[styles.sectionAccent, { backgroundColor: '#7E152F' }]} />
            <Text style={[styles.resultsText, { color: '#0F172A' }]}>
              <Text style={[styles.resultsBold, { color: '#0F172A' }]}>{displayed.length}</Text>
              {' '}Tractor{displayed.length !== 1 ? 's' : ''}
            </Text>
          </View>
          {plants.length > 0 && (
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={openDropdown}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownButtonText} numberOfLines={1}>
                {plants.find(p => p.plantID === selectedPlantID)?.name || 'All Plants'}
              </Text>
              <Feather name="chevron-down" size={14} color="#64748B" />
            </TouchableOpacity>
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
              <MaterialCommunityIcons name="tractor" size={36} color={c.mutedForeground} />
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

      {/* Plant Selection Modal Dropdown */}
      <Modal
        visible={dropdownOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setDropdownOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setDropdownOpen(false)}
        >
          <Pressable
            style={[
              styles.dropdownMenu,
              {
                backgroundColor: c.card,
                borderColor: c.border,
                marginTop: Platform.OS === 'web' ? 110 : 140,
                paddingBottom: insets.bottom + 16,
              },
            ]}
            onPress={e => e.stopPropagation()}
          >
            {/* Sheet Handle */}
            <View style={styles.sheetHandleWrap}>
              <View style={[styles.sheetHandle, { backgroundColor: c.border }]} />
            </View>

            {/* Header */}
            <View style={[styles.dropdownHeader, { borderBottomColor: c.hairline }]}>
              <View style={[styles.headerIconWrap, { backgroundColor: c.primary + '12' }]}>
                <Image source={require('@/assets/images/LogoLocation.png')} style={{ width: 24, height: 24 }} resizeMode="contain" />
              </View>
              <View style={styles.headerTextWrap}>
                <Text style={[styles.dropdownHeaderTitle, { color: c.foreground }]}>Select Plant</Text>
                <Text style={[styles.dropdownHeaderSub, { color: c.mutedForeground }]}>
                  Filter tractors by operating plant location
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setDropdownOpen(false)}
                style={[styles.closeBtn, { backgroundColor: c.surfaceAlt }]}
                hitSlop={8}
              >
                <Feather name="x" size={18} color={c.foreground} />
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View
              style={[styles.menuSearch, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}
            >
              <Feather name="search" size={17} color={c.mutedForeground} />
              <TextInput
                style={[styles.menuSearchInput, { color: c.foreground }]}
                placeholder="Search plants…"
                placeholderTextColor={c.mutedForeground + '88'}
                value={dropdownQuery}
                onChangeText={setDropdownQuery}
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
              />
              {dropdownQuery.length > 0 ? (
                <TouchableOpacity onPress={() => setDropdownQuery('')} hitSlop={8}>
                  <Feather name="x" size={17} color={c.mutedForeground} />
                </TouchableOpacity>
              ) : null}
            </View>

            <ScrollView
              style={styles.dropdownScroll}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {!dropdownQuery.trim() ? (
                <TouchableOpacity
                  style={[
                    styles.dropdownItem,
                    {
                      backgroundColor: !selectedPlantID ? c.primary + '0E' : 'transparent',
                      borderColor: !selectedPlantID ? c.primary + '35' : c.border,
                    },
                  ]}
                  onPress={() => {
                    setSelectedPlantID(null);
                    setDropdownOpen(false);
                  }}
                  activeOpacity={0.75}
                >
                  <View style={[styles.dropdownItemIcon, { backgroundColor: !selectedPlantID ? c.primary : c.surfaceAlt }]}>
                    <Feather
                      name={!selectedPlantID ? 'check' : 'layers'}
                      size={15}
                      color={!selectedPlantID ? c.primaryForeground : c.mutedForeground}
                    />
                  </View>
                  <View style={styles.dropdownItemBody}>
                    <Text style={[styles.dropdownItemLabel, { color: c.foreground }]} numberOfLines={1}>
                      All Plants
                    </Text>
                    <Text style={[styles.dropdownItemSub, { color: c.mutedForeground }]} numberOfLines={1}>
                      {plants.length} plant{plants.length !== 1 ? 's' : ''} · entire fleet
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.dropdownItemCount,
                      { backgroundColor: !selectedPlantID ? c.primary + '18' : c.muted },
                    ]}
                  >
                    <Text style={[styles.dropdownItemCountText, { color: !selectedPlantID ? c.primary : c.mutedForeground }]}>
                      {tractors.length}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : null}

              {filteredPlantsForDropdown.map(p => {
                const isSelected = p.plantID === selectedPlantID;
                const count = countFor(p.plantID);
                return (
                  <TouchableOpacity
                    key={p.plantID}
                    style={[
                      styles.dropdownItem,
                      {
                        backgroundColor: isSelected ? c.primary + '0E' : 'transparent',
                        borderColor: isSelected ? c.primary + '35' : c.border,
                      },
                    ]}
                    onPress={() => {
                      setSelectedPlantID(p.plantID);
                      setDropdownOpen(false);
                    }}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.dropdownItemIcon, { backgroundColor: isSelected ? c.primary : c.surfaceAlt }]}>
                      {isSelected ? (
                        <Feather name="check" size={15} color={c.primaryForeground} />
                      ) : p.plantType === 'HUB_WAREHOUSE' ? (
                        <Feather name="home" size={15} color={c.mutedForeground} />
                      ) : (
                        <Image source={require('@/assets/images/LogoLocation.png')} style={{ width: 18, height: 18 }} resizeMode="contain" />
                      )}
                    </View>
                    <View style={styles.dropdownItemBody}>
                      <Text style={[styles.dropdownItemLabel, { color: c.foreground }]} numberOfLines={1}>
                        {p.name}
                      </Text>
                      <Text style={[styles.dropdownItemSub, { color: c.mutedForeground }]} numberOfLines={1}>
                        {p.location || (p.plantType === 'HUB_WAREHOUSE' ? 'Hub warehouse' : 'Site')}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.dropdownItemCount,
                        { backgroundColor: isSelected ? c.primary + '18' : c.muted },
                      ]}
                    >
                      <Text style={[styles.dropdownItemCountText, { color: isSelected ? c.primary : c.mutedForeground }]}>
                        {count}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}

              {dropdownQuery.trim() && filteredPlantsForDropdown.length === 0 ? (
                <Text style={[styles.dropdownEmptySearch, { color: c.mutedForeground }]}>
                  No plants match your search
                </Text>
              ) : null}
              <View style={{ height: 16 }} />
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
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
    height: 22,
    borderRadius: 2,
  },
  resultsText: {
    fontSize: 18,
    fontFamily: 'Inter_500Medium',
    flex: 1,
  },
  resultsBold: {
    fontFamily: 'Inter_700Bold',
    fontSize: 19,
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
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
    maxWidth: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  dropdownButtonText: {
    fontSize: 12.5,
    fontFamily: 'Inter_700Bold',
    color: '#334155',
    flexShrink: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(8, 16, 43, 0.55)',
    justifyContent: 'flex-end',
  },
  dropdownMenu: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    shadowColor: '#120E10',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
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
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrap: {
    flex: 1,
    gap: 2,
  },
  dropdownHeaderTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.3,
  },
  dropdownHeaderSub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    margin: 14,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 1,
  },
  menuSearchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    paddingVertical: 0,
  },
  dropdownScroll: {
    flex: 1,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 12,
    marginBottom: 8,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  dropdownItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dropdownItemBody: {
    flex: 1,
    gap: 2,
  },
  dropdownItemLabel: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.1,
  },
  dropdownItemSub: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  dropdownItemCount: {
    minWidth: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 7,
  },
  dropdownItemCountText: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
  },
  dropdownEmptySearch: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    padding: 24,
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

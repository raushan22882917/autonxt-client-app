import React, { useCallback, useMemo, useState } from 'react';
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
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { PlantAnalysisCard } from '@/components/PlantAnalysisCard';
import { buildPlantSummaries } from '@/lib/plantAnalysis';

export default function PlantAnalysisScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    plants,
    tractors,
    complaints,
    runtimeRecords,
    isLoading,
    refresh,
    selectedPlantID,
    setSelectedPlantID,
  } = useApp();

  const [plantOpen, setPlantOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownSearch, setDropdownSearch] = useState('');

  const { from } = useLocalSearchParams<{ from?: string }>();
  const fromProfile = from === 'profile';

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

  const filteredPlantsForDropdown = useMemo(() => {
    const q = dropdownSearch.toLowerCase().trim();
    if (!q) return plants;
    return plants.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q)
    );
  }, [plants, dropdownSearch]);

  const topPad = Platform.OS === 'web' ? 67 : 0;

  const selectedLabel = useMemo(() => {
    if (!selectedPlantID) return 'All Plants';
    return plants.find(p => p.plantID === selectedPlantID)?.name ?? 'All Plants';
  }, [plants, selectedPlantID]);

  const summaries = useMemo(
    () => buildPlantSummaries(plants, tractors, complaints, runtimeRecords),
    [plants, tractors, complaints, runtimeRecords]
  );

  const displayedSummaries = useMemo(() => {
    let list = summaries;
    if (selectedPlantID) {
      list = list.filter(s => s.plant.plantID === selectedPlantID);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        s =>
          s.plant.name.toLowerCase().includes(q) ||
          s.plant.location?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [summaries, selectedPlantID, searchQuery]);

  const openPlant = (plantID: string) =>
    router.push(`/plant/${encodeURIComponent(plantID)}`);

  const ListHeader = (
    <View style={[styles.header, { paddingTop: topPad + 28 }]}>
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
      <View style={styles.headerTitleContainer}>
        <Text style={styles.mainTitleText}>All Plants</Text>
        <Text style={styles.subtitleText}>
          Manage and monitor all your plants in one place
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <FlatList
        data={displayedSummaries}
        keyExtractor={s => s.plant.plantID}
        renderItem={({ item }) => (
          <PlantAnalysisCard summary={item} onPress={() => openPlant(item.plant.plantID)} />
        )}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor={c.primary} />
        }
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={
          <View style={[styles.empty, { backgroundColor: c.card, borderColor: c.border }]}>
            <View style={[styles.emptyIconWrap, { backgroundColor: c.surfaceAlt }]}>
              <Feather name="home" size={32} color={c.mutedForeground} />
            </View>
            <Text style={[styles.emptyTitle, { color: c.foreground }]}>No Plants Found</Text>
            <Text style={[styles.emptyText, { color: c.mutedForeground }]}>
              {isLoading ? 'Loading plant data…' : 'No plants found matching your filters'}
            </Text>
          </View>
        }
      />

      {/* Dropdown Menu Modal */}
      <Modal
        visible={plantOpen}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setPlantOpen(false);
          setDropdownSearch('');
        }}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => {
            setPlantOpen(false);
            setDropdownSearch('');
          }}
        >
          <Pressable
            style={[styles.menu, { backgroundColor: c.card, borderColor: c.border }]}
            onPress={e => e.stopPropagation()}
          >
            {/* Inner Dropdown Search */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: c.surfaceAlt,
                borderColor: c.border,
                borderWidth: 1.5,
                borderRadius: 12,
                margin: 14,
                marginBottom: 10,
                paddingHorizontal: 12,
                height: 40,
              }}
            >
              <Feather name="search" size={15} color={c.mutedForeground} style={{ marginRight: 6 }} />
              <TextInput
                style={{
                  color: c.foreground,
                  fontSize: 14,
                  fontFamily: 'Inter_500Medium',
                  flex: 1,
                  paddingVertical: 0,
                  height: '100%',
                }}
                placeholder="Search plants…"
                placeholderTextColor={c.mutedForeground + '88'}
                value={dropdownSearch}
                onChangeText={setDropdownSearch}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {dropdownSearch.length > 0 && (
                <TouchableOpacity onPress={() => setDropdownSearch('')} hitSlop={8}>
                  <Feather name="x" size={15} color={c.mutedForeground} />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={styles.menuScroll} showsVerticalScrollIndicator={false}>
              {!dropdownSearch.trim() && (
                <TouchableOpacity
                  style={[
                    styles.option,
                    {
                      backgroundColor: !selectedPlantID ? c.primary + '0E' : 'transparent',
                      borderColor: !selectedPlantID ? c.primary + '35' : c.border,
                    },
                  ]}
                  onPress={() => {
                    setSelectedPlantID(null);
                    setPlantOpen(false);
                    setDropdownSearch('');
                  }}
                >
                  <View style={[styles.optionIcon, { backgroundColor: !selectedPlantID ? c.primary : c.surfaceAlt }]}>
                    <Feather name={!selectedPlantID ? 'check' : 'layers'} size={14} color={!selectedPlantID ? c.primaryForeground : c.mutedForeground} />
                  </View>
                  <View style={styles.optionBody}>
                    <Text style={[styles.optionLabel, { color: c.foreground }]}>All Plants</Text>
                    <Text style={[styles.optionSub, { color: c.mutedForeground }]}>Show summaries for all locations</Text>
                  </View>
                </TouchableOpacity>
              )}

              {filteredPlantsForDropdown.map(p => {
                const active = selectedPlantID === p.plantID;
                const tractorCount = tractors.filter(t => t.plantID === p.plantID).length;
                return (
                  <TouchableOpacity
                    key={p.plantID}
                    style={[
                      styles.option,
                      {
                        backgroundColor: active ? c.primary + '0E' : 'transparent',
                        borderColor: active ? c.primary + '35' : c.border,
                      },
                    ]}
                    onPress={() => {
                      setSelectedPlantID(p.plantID);
                      setPlantOpen(false);
                      setDropdownSearch('');
                    }}
                  >
                    <View style={[styles.optionIcon, { backgroundColor: active ? c.primary : c.surfaceAlt }]}>
                      {active ? (
                        <Feather name="check" size={14} color={c.primaryForeground} />
                      ) : (
                        <Image source={require('@/assets/images/LogoLocation.png')} style={{ width: 18, height: 18 }} resizeMode="contain" />
                      )}
                    </View>
                    <View style={styles.optionBody}>
                      <Text style={[styles.optionLabel, { color: c.foreground }]} numberOfLines={1}>{p.name}</Text>
                      <Text style={[styles.optionSub, { color: c.mutedForeground }]} numberOfLines={1}>
                        {p.location || 'Site'} · {tractorCount} tractor{tractorCount !== 1 ? 's' : ''}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  list: { paddingHorizontal: 16 },
  header: {
    gap: 12,
    paddingBottom: 16,
    paddingHorizontal: 0,
  },
  backToProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    marginBottom: 4,
  },
  backToProfileText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#7E152F',
  },
  headerTitleContainer: {
    flexDirection: 'column',
    gap: 2,
    marginBottom: 0,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  mainTitleText: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subtitleText: {
    fontSize: 11.5,
    fontFamily: 'Inter_400Regular',
    color: '#64748B',
    lineHeight: 15,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    marginBottom: 10,
  },
  searchBarContainer: {
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
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F8D7DA',
    alignItems: 'center',
    justifyContent: 'center',
  },

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
  },
  emptyText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 14, 16, 0.52)',
    justifyContent: 'flex-end',
  },
  menu: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    maxHeight: '82%',
    overflow: 'hidden',
    shadowColor: '#120E10',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 24,
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
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  optionIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  optionBody: { flex: 1, gap: 1 },
  optionLabel: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.1,
  },
  optionSub: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
  },
});

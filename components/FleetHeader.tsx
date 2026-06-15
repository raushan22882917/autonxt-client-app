import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, usePathname, useGlobalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { useDrawer } from '@/context/DrawerContext';
import { countActiveComplaintFilters } from '@/lib/complaintFilters';
import { LinearGradient } from 'expo-linear-gradient';

export function FleetHeader() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const { from } = useGlobalSearchParams<{ from?: string }>();
  const { user } = useAuth();
  const { toggleDrawer } = useDrawer();
  const {
    plants,
    tractors,
    selectedPlantID,
    setSelectedPlantID,
    loadedPlantIDs,
    organization,
    tractorSearch,
    setTractorSearch,
    complaintSearch,
    setComplaintSearch,
    complaintFilters,
    setComplaintFilterOpen,
  } = useApp();

  const activeFilterCount = useMemo(() => {
    return countActiveComplaintFilters(complaintFilters);
  }, [complaintFilters]);

  const [plantOpen, setPlantOpen] = useState(false);
  const [plantQuery, setPlantQuery] = useState('');
  const [headerHeight, setHeaderHeight] = useState(0);

  // ── Entry & Breathing Animations ──
  const entryOpacity = useRef(new Animated.Value(0)).current;
  const entryTranslateY = useRef(new Animated.Value(4)).current;
  const entryScale = useRef(new Animated.Value(0.97)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Snappy entrance fade-in and scale-in
    Animated.parallel([
      Animated.timing(entryOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(entryTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(entryScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Continuous breathing loop - slow (10s total cycle) so it is obvious but not frequent/frantic
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 5000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 5000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, [entryOpacity, entryTranslateY, entryScale, pulseAnim]);

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1.04],
  });

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.90, 1],
  });

  const combinedScale = Animated.multiply(entryScale, pulseScale);
  const combinedOpacity = Animated.multiply(entryOpacity, pulseOpacity);

  const selectedLabel = useMemo(() => {
    if (!selectedPlantID) return 'All Plants';
    return plants.find(p => p.plantID === selectedPlantID)?.name ?? 'All Plants';
  }, [plants, selectedPlantID]);

  const filteredPlants = useMemo(() => {
    const q = plantQuery.trim().toLowerCase();
    if (!q) return plants;
    return plants.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q) ||
        p.plantID.toLowerCase().includes(q)
    );
  }, [plants, plantQuery]);

  const countFor = (plantID: string | null) =>
    plantID ? tractors.filter(t => t.plantID === plantID).length : tractors.length;

  const selectPlant = (plantID: string | null) => {
    setSelectedPlantID(plantID);
    setPlantOpen(false);
    setPlantQuery('');
  };

  const topPad = Platform.OS === 'web' ? 6 : Math.max(0, insets.top + 3);

  return (
    <>
      <StatusBar style="light" />
      
      {/* ── Burgundy Header Bar ── */}
      <View
        onLayout={e => setHeaderHeight(e.nativeEvent.layout.height)}
        style={[
          styles.headerBar,
          {
            paddingTop: topPad,
            paddingBottom: (pathname.includes('dashboard') || pathname.includes('runtime') || pathname.includes('tractors') || pathname.includes('complaints')) ? 0 : 16,
          },
        ]}
      >
        <View style={styles.headerTopRow}>
          {/* Left Side: Back button on Plants/Tractors, placeholder elsewhere */}
          {(pathname.includes('runtime') || pathname.includes('tractors')) ? (
            <TouchableOpacity
              style={styles.headerCircleBtn}
              onPress={() => {
                if (from === 'profile') {
                  router.replace('/(main)/profile');
                } else if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace('/(main)/dashboard');
                }
              }}
              activeOpacity={0.75}
              accessibilityLabel="Go back"
            >
              <Feather name="chevron-left" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 36 }} />
          )}

          {/* Center: Animated Brand Logo */}
          <Animated.View style={[styles.logoContainer, { transform: [{ scale: combinedScale }, { translateY: entryTranslateY }], opacity: combinedOpacity }]}>
            <Text style={styles.brandLogo}>Auto</Text>
            <Text style={[styles.brandLogo, { color: '#E2A93E' }]}>Nxt</Text>
            <Text style={styles.brandSub}>FLEET</Text>
          </Animated.View>

          {/* Right Side: Profile Button */}
          <TouchableOpacity
            style={styles.headerCircleBtn}
            onPress={toggleDrawer}
            activeOpacity={0.75}
            accessibilityLabel="Profile"
          >
            <Feather name="user" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* ── Plant Picker inside Header (Only on Fleet Page & Plants Page) ── */}
        {(pathname.includes('dashboard') || pathname.includes('runtime')) && (
          <TouchableOpacity
            style={styles.headerPlantDropdown}
            onPress={() => setPlantOpen(true)}
            activeOpacity={0.8}
            disabled={plants.length === 0}
          >
            <LinearGradient
              colors={['#FFFFFF', '#FAF8F5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.headerDropdownLeft}>
              <View style={styles.headerDropdownIconWrap}>
                <Feather name="layers" size={11} color="#7E152F" />
              </View>
              <Text style={styles.headerDropdownValue} numberOfLines={1}>
                {selectedLabel}
              </Text>
            </View>

            <View style={styles.headerDropdownRight}>
              <View style={styles.headerTractorBadge}>
                <Text style={styles.headerTractorBadgeText}>
                  {countFor(selectedPlantID)}
                </Text>
              </View>
              <Feather name="chevron-down" size={13} color="#7E152F" />
            </View>
          </TouchableOpacity>
        )}

        {/* ── Search Bar inside Header (Only on Tractors Page) ── */}
        {pathname.includes('tractors') && (
          <View style={styles.headerPlantDropdown}>
            <LinearGradient
              colors={['#FFFFFF', '#FAF8F5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.headerDropdownLeft}>
              <View style={styles.headerDropdownIconWrap}>
                <Feather name="search" size={11} color="#7E152F" />
              </View>
              <TextInput
                style={{
                  fontSize: 13,
                  fontFamily: 'Inter_600SemiBold',
                  color: '#1E293B',
                  flex: 1,
                  paddingVertical: 0,
                  height: '100%',
                }}
                placeholder="Search by ID, model, location..."
                placeholderTextColor="#94A3B8"
                value={tractorSearch}
                onChangeText={setTractorSearch}
                returnKeyType="search"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {tractorSearch.length > 0 && (
                <TouchableOpacity onPress={() => setTractorSearch('')} hitSlop={8}>
                  <Feather name="x" size={14} color="#94A3B8" style={{ paddingHorizontal: 4 }} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* ── Search & Filter Bar inside Header (Only on Complaints Page) ── */}
        {pathname.includes('complaints') && (
          <View style={[styles.headerPlantDropdown, { paddingRight: 0 }]}>
            <LinearGradient
              colors={['#FFFFFF', '#FAF8F5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={[styles.headerDropdownLeft, { paddingLeft: 0 }]}>
              <View style={styles.headerDropdownIconWrap}>
                <Feather name="search" size={11} color="#7E152F" />
              </View>
              <TextInput
                style={{
                  fontSize: 13,
                  fontFamily: 'Inter_600SemiBold',
                  color: '#1E293B',
                  flex: 1,
                  paddingVertical: 0,
                  height: '100%',
                }}
                placeholder="Search complaints..."
                placeholderTextColor="#94A3B8"
                value={complaintSearch}
                onChangeText={setComplaintSearch}
                returnKeyType="search"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {complaintSearch.length > 0 && (
                <TouchableOpacity onPress={() => setComplaintSearch('')} hitSlop={8}>
                  <Feather name="x" size={14} color="#94A3B8" style={{ paddingHorizontal: 4 }} />
                </TouchableOpacity>
              )}
            </View>

            {/* Divider between search area and filter button */}
            <View style={{ width: 1, height: '60%', backgroundColor: 'rgba(0,0,0,0.08)', marginHorizontal: 4 }} />

            {/* Filter button inside the container, attached to the right side */}
            <TouchableOpacity
              onPress={() => setComplaintFilterOpen(true)}
              style={{
                width: 48, // Match height for perfect square
                height: '100%',
                backgroundColor: 'transparent', // Transparent background
                borderTopRightRadius: 11, // Match container corner minus border width
                borderBottomRightRadius: 11,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              activeOpacity={0.8}
            >
              <Feather name="sliders" size={15} color="#7E152F" />
              {activeFilterCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    backgroundColor: '#E2A93E', // Gold badge
                    borderRadius: 7,
                    minWidth: 14,
                    height: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 1,
                  }}
                >
                  <Text style={{ fontSize: 8, fontFamily: 'Inter_700Bold', color: '#7E152F' }}>
                    {activeFilterCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Plant picker modal */}
      <Modal
        visible={plantOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setPlantOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setPlantOpen(false)}>
          <Pressable
            style={[
              styles.menu,
              {
                backgroundColor: c.background,
                borderColor: c.border,
                marginTop: headerHeight || (Platform.OS === 'web' ? 120 : 150),
              },
            ]}
            onPress={e => e.stopPropagation()}
          >
            {/* Sheet Handle */}
            <View style={styles.sheetHandleWrap}>
              <View style={[styles.sheetHandle, { backgroundColor: c.border }]} />
            </View>
            {/* Search */}
            <View
              style={[styles.menuSearch, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}
            >
              <Feather name="search" size={17} color={c.mutedForeground} />
              <TextInput
                style={[styles.menuSearchInput, { color: c.foreground }]}
                placeholder="Search plants…"
                placeholderTextColor={c.mutedForeground + '88'}
                value={plantQuery}
                onChangeText={setPlantQuery}
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
              />
              {plantQuery.length > 0 ? (
                <TouchableOpacity onPress={() => setPlantQuery('')} hitSlop={8}>
                  <Feather name="x" size={17} color={c.mutedForeground} />
                </TouchableOpacity>
              ) : null}
            </View>

            <ScrollView
              style={styles.menuScroll}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {!plantQuery.trim() ? (
                <PlantOption
                  label="All Plants"
                  sublabel={`${plants.length} plant${plants.length !== 1 ? 's' : ''} · entire fleet`}
                  count={tractors.length}
                  active={!selectedPlantID}
                  onPress={() => selectPlant(null)}
                  c={c}
                />
              ) : null}
              {filteredPlants.map(p => {
                const loaded = loadedPlantIDs.includes(p.plantID);
                return (
                  <PlantOption
                    key={p.plantID}
                    label={p.name}
                    sublabel={
                      loaded
                        ? p.location || (p.plantType === 'HUB_WAREHOUSE' ? 'Hub warehouse' : 'Site')
                        : 'Loading…'
                    }
                    count={loaded ? countFor(p.plantID) : null}
                    active={selectedPlantID === p.plantID}
                    hub={p.plantType === 'HUB_WAREHOUSE'}
                    onPress={() => selectPlant(p.plantID)}
                    c={c}
                  />
                );
              })}
              {plantQuery.trim() && filteredPlants.length === 0 ? (
                <Text style={[styles.emptySearch, { color: c.mutedForeground }]}>
                  No plants match your search
                </Text>
              ) : null}
              <View style={{ height: 8 }} />
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function PlantOption({
  label,
  sublabel,
  count,
  active,
  hub,
  onPress,
  c,
}: {
  label: string;
  sublabel?: string;
  count: number | null;
  active: boolean;
  hub?: boolean;
  onPress: () => void;
  c: ReturnType<typeof useColors>;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.option,
        {
          backgroundColor: active ? c.primary + '0E' : 'transparent',
          borderColor: active ? c.primary + '35' : c.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.optionIcon, { backgroundColor: active ? c.primary : c.surfaceAlt }]}>
        <Feather
          name={hub ? 'home' : active ? 'check' : 'map-pin'}
          size={15}
          color={active ? c.primaryForeground : c.mutedForeground}
        />
      </View>
      <View style={styles.optionBody}>
        <Text style={[styles.optionLabel, { color: c.foreground }]} numberOfLines={1}>
          {label}
        </Text>
        {sublabel ? (
          <Text style={[styles.optionSub, { color: c.mutedForeground }]} numberOfLines={1}>
            {sublabel}
          </Text>
        ) : null}
      </View>
      {count !== null ? (
        <View
          style={[
            styles.optionCount,
            { backgroundColor: active ? c.primary + '18' : c.muted },
          ]}
        >
          <Text style={[styles.optionCountText, { color: active ? c.primary : c.mutedForeground }]}>
            {count}
          </Text>
        </View>
      ) : (
        <Text style={[styles.optionCountText, { color: c.mutedForeground }]}>…</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    backgroundColor: '#7E152F', // Burgundy header
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#7E152F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 5,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 6,
  },
  headerCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.12)', // translucent circular background
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)', // thin premium outline
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -3,
  },
  brandLogo: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    letterSpacing: -0.6,
  },
  brandSub: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: '#E2A93E', // gold active accent
    letterSpacing: 2.5,
    marginLeft: 8,
  },
  headerPlantDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginTop: 6,
    marginBottom: -24, // floating overlap bottom edge
    shadowColor: '#120E10',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 10,
    overflow: 'hidden',
  },
  headerDropdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  headerDropdownIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#FDF2F4', // soft burgundy wash
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerDropdownValue: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#1E293B', // Dark slate text
    flex: 1,
  },
  headerDropdownRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTractorBadge: {
    height: 18,
    borderRadius: 6,
    backgroundColor: '#FDF2F4', // soft burgundy wash
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  headerTractorBadgeText: {
    fontSize: 10.5,
    fontFamily: 'Inter_700Bold',
    color: '#7E152F', // burgundy text
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
    flex: 1,
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
  menuScroll: {
    flex: 1,
  },
  emptySearch: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    padding: 24,
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
  optionCount: {
    minWidth: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 7,
  },
  optionCountText: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
  },
});

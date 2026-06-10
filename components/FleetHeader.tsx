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
import { useRouter, usePathname } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { useDrawer } from '@/context/DrawerContext';

export function FleetHeader() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { toggleDrawer } = useDrawer();
  const {
    plants,
    tractors,
    selectedPlantID,
    setSelectedPlantID,
    loadedPlantIDs,
    organization,
  } = useApp();

  const [plantOpen, setPlantOpen] = useState(false);
  const [plantQuery, setPlantQuery] = useState('');

  // ── Breathing Loop Animation ──
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const scale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.98, 1.02],
  });

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1],
  });

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

  const topPad = Platform.OS === 'web' ? 12 : insets.top;

  return (
    <>
      <StatusBar style="light" />
      
      {/* ── Burgundy Header Bar ── */}
      <View style={[styles.headerBar, { paddingTop: topPad + 6 }]}>
        {/* Left Side Placeholder (to keep brand logo centered) */}
        <View style={{ width: 36 }} />

        {/* Center: Animated Brand Logo */}
        <Animated.View style={[styles.logoContainer, { transform: [{ scale }], opacity }]}>
          <Text style={styles.brandLogo}>Auto</Text>
          <Text style={[styles.brandLogo, { color: '#E2A93E' }]}>Nxt</Text>
          <Text style={styles.brandSub}>FLEET</Text>
        </Animated.View>

        {/* Right Side: Profile Button */}
        <TouchableOpacity
          style={styles.headerSquareBtn}
          onPress={toggleDrawer}
          activeOpacity={0.75}
          accessibilityLabel="Profile"
        >
          <Feather name="user" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* ── Plants Dropdown Card (Below Header, Only on Fleet Page) ── */}
      {pathname.includes('dashboard') && (
        <View style={styles.dropdownSection}>
          <TouchableOpacity
            style={styles.plantDropdownCard}
            onPress={() => setPlantOpen(true)}
            activeOpacity={0.8}
            disabled={plants.length === 0}
          >
            <View style={styles.dropdownLeft}>
              <View style={styles.dropdownIconWrap}>
                <Feather name={selectedPlantID ? 'map-pin' : 'layers'} size={14} color="#7E152F" />
              </View>
              <Text style={styles.dropdownValue} numberOfLines={1}>
                {selectedLabel}
              </Text>
            </View>

            <View style={styles.dropdownRight}>
              <View style={styles.tractorBadge}>
                <Text style={styles.tractorBadgeText}>
                  {countFor(selectedPlantID)}
                </Text>
              </View>
              <Feather name="chevron-down" size={16} color="#94A3B8" />
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Plant picker modal */}
      <Modal
        visible={plantOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setPlantOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setPlantOpen(false)}>
          <Pressable
            style={[styles.menu, { backgroundColor: c.card, borderColor: c.border }]}
            onPress={e => e.stopPropagation()}
          >
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#7E152F', // Burgundy header
    paddingHorizontal: 16,
    paddingBottom: 16, // more vertical breathing room
  },
  headerSquareBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // translucent square background
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLogo: {
    fontSize: 20, // comfortable size that fits mobile screens without horizontal squeezing
    fontFamily: 'IBMPlexSans_700Bold',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  brandSub: {
    fontSize: 10, // subtext contrast
    fontFamily: 'IBMPlexSans_700Bold',
    color: '#E2A93E', // gold active accent
    letterSpacing: 1.2,
    marginLeft: 6, // clear separation from AutoNxt
  },
  dropdownSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: 'transparent',
  },
  plantDropdownCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', // white card background
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 48,
    shadowColor: '#120E10',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  dropdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  dropdownIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FDF2F4', // soft burgundy wash
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownValue: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#120E10',
    flex: 1,
  },
  dropdownRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tractorBadge: {
    minWidth: 26,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FDF2F4', // soft burgundy wash
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 7,
  },
  tractorBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#7E152F', // burgundy text
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(8, 16, 43, 0.5)',
    justifyContent: 'flex-start',
    paddingTop: 90,
    paddingHorizontal: 16,
  },
  menu: {
    borderRadius: 20,
    borderWidth: 1,
    maxHeight: 440,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 32,
    elevation: 12,
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
    maxHeight: 340,
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

import React, { useMemo, useState } from 'react';
import {
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';

export function FleetHeader() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
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

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  return (
    <>
      <View
        style={[
          styles.bar,
          {
            paddingTop: topPad + 8,
            backgroundColor: c.card,
            borderBottomColor: c.border,
          },
        ]}
      >
        {/* Plant picker button */}
        <TouchableOpacity
          style={[
            styles.plantPicker,
            {
              backgroundColor: selectedPlantID ? c.primary + '0E' : c.surfaceAlt,
              borderColor: selectedPlantID ? c.primary + '35' : c.border,
            },
          ]}
          onPress={() => setPlantOpen(true)}
          activeOpacity={0.8}
          disabled={plants.length === 0}
        >
          <View style={[styles.plantPickerIcon, { backgroundColor: selectedPlantID ? c.primary : c.muted }]}>
            <Feather
              name={selectedPlantID ? 'map-pin' : 'layers'}
              size={14}
              color={selectedPlantID ? c.primaryForeground : c.mutedForeground}
            />
          </View>
          <View style={styles.plantPickerText}>
            <Text style={[styles.plantPickerLabel, { color: c.mutedForeground }]}>
              {organization?.name ?? 'Fleet'}
            </Text>
            <Text style={[styles.plantPickerValue, { color: c.foreground }]} numberOfLines={1}>
              {selectedLabel}
            </Text>
          </View>
          <View style={[styles.tractorBadge, { backgroundColor: c.primary + '14' }]}>
            <Text style={[styles.tractorBadgeText, { color: c.primary }]}>
              {countFor(selectedPlantID)}
            </Text>
          </View>
          <Feather name="chevron-down" size={16} color={c.mutedForeground} />
        </TouchableOpacity>

        {/* Profile button */}
        <TouchableOpacity
          style={[styles.avatarBtn, { backgroundColor: c.primary }]}
          onPress={() => router.push('/(main)/profile')}
          activeOpacity={0.75}
          accessibilityLabel="Profile"
        >
          <Text style={[styles.avatarText, { color: c.primaryForeground }]}>{initials}</Text>
        </TouchableOpacity>
      </View>

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
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
    borderBottomWidth: 1,
  },
  plantPicker: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 48,
  },
  plantPickerIcon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  plantPickerText: { flex: 1, gap: 1 },
  plantPickerLabel: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  plantPickerValue: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.2,
  },
  tractorBadge: {
    minWidth: 26,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 7,
  },
  tractorBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
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

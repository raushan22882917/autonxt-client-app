import React, { useMemo, useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';

const companyLogo = require('../assets/images/small-logo-black.png');

export function FleetHeader() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const {
    organization,
    plants,
    tractors,
    selectedPlantID,
    setSelectedPlantID,
    isLoadingMorePlants,
    loadedPlantIDs,
  } = useApp();
  const [open, setOpen] = useState(false);

  const selectedLabel = useMemo(() => {
    if (!selectedPlantID) return 'All Plants';
    return plants.find(p => p.plantID === selectedPlantID)?.name ?? 'All Plants';
  }, [plants, selectedPlantID]);

  const countFor = (plantID: string | null) =>
    plantID ? tractors.filter(t => t.plantID === plantID).length : tractors.length;

  const selectPlant = (plantID: string | null) => {
    setSelectedPlantID(plantID);
    setOpen(false);
  };

  const topPad = Platform.OS === 'web' ? 12 : insets.top;

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
        <Image source={companyLogo} style={styles.logo} resizeMode="contain" />

        <View style={styles.center}>
          <Text style={[styles.orgName, { color: c.foreground }]} numberOfLines={1}>
            {organization?.name || 'AutoNXT Fleet'}
          </Text>

          <TouchableOpacity
            style={[styles.dropdown, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}
            onPress={() => setOpen(true)}
            activeOpacity={0.8}
            disabled={plants.length === 0}
          >
            <Feather name="map-pin" size={14} color={c.primary} />
            <Text style={[styles.dropdownText, { color: c.foreground }]} numberOfLines={1}>
              {selectedLabel}
            </Text>
            <View style={[styles.countBadge, { backgroundColor: c.primary + '18' }]}>
              <Text style={[styles.countText, { color: c.primary }]}>{countFor(selectedPlantID)}</Text>
            </View>
            <Feather name="chevron-down" size={16} color={c.mutedForeground} />
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable
            style={[styles.menu, { backgroundColor: c.card, borderColor: c.border }]}
            onPress={e => e.stopPropagation()}
          >
            <Text style={[styles.menuTitle, { color: c.mutedForeground }]}>Select plant</Text>
            <ScrollView style={styles.menuScroll} keyboardShouldPersistTaps="handled">
              <PlantOption
                label="All Plants"
                sublabel="Show entire fleet"
                count={tractors.length}
                active={!selectedPlantID}
                onPress={() => selectPlant(null)}
                c={c}
              />
              {plants.map(p => {
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
                    count={loaded ? countFor(p.plantID) : '…'}
                    active={selectedPlantID === p.plantID}
                    hub={p.plantType === 'HUB_WAREHOUSE'}
                    onPress={() => selectPlant(p.plantID)}
                    c={c}
                  />
                );
              })}
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
  count: number | string;
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
          backgroundColor: active ? c.primary + '12' : 'transparent',
          borderColor: active ? c.primary + '40' : c.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.optionIcon, { backgroundColor: active ? c.primary : c.surfaceAlt }]}>
        <Feather
          name={hub ? 'home' : 'map-pin'}
          size={16}
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
      <Text style={[styles.optionCount, { color: active ? c.primary : c.mutedForeground }]}>{count}</Text>
      {active ? <Feather name="check" size={18} color={c.primary} /> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
    borderBottomWidth: 1,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  center: {
    flex: 1,
    gap: 6,
  },
  orgName: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.2,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
  },
  dropdownText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  countBadge: {
    minWidth: 26,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  countText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 18, 32, 0.45)',
    justifyContent: 'flex-start',
    paddingTop: 100,
    paddingHorizontal: 16,
  },
  menu: {
    borderRadius: 16,
    borderWidth: 1,
    maxHeight: 360,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  menuTitle: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  menuScroll: {
    maxHeight: 300,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 10,
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionBody: {
    flex: 1,
    gap: 2,
  },
  optionLabel: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  optionSub: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  optionCount: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    marginRight: 4,
  },
});

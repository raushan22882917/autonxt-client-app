import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { isCommissionedTractor } from '@/lib/appsync';

export function PlantFilter() {
  const c = useColors();
  const { plants, tractors, selectedPlantID, setSelectedPlantID } = useApp();

  if (plants.length === 0) return null;

  const commissioned = tractors.filter(isCommissionedTractor);
  const countFor = (plantID: string) =>
    commissioned.filter(t => t.plantID === plantID).length;

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        <View style={styles.leadIcon}>
          <Feather name="filter" size={14} color={c.mutedForeground} />
        </View>

        <Chip
          active={!selectedPlantID}
          label="All Plants"
          count={commissioned.length}
          onPress={() => setSelectedPlantID(null)}
          c={c}
        />

        {plants.map(p => {
          const active = selectedPlantID === p.plantID;
          return (
            <Chip
              key={p.plantID}
              active={active}
              label={p.name}
              count={countFor(p.plantID)}
              hub={p.plantType === 'HUB_WAREHOUSE'}
              onPress={() => setSelectedPlantID(active ? null : p.plantID)}
              c={c}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

function Chip({
  active,
  label,
  count,
  hub,
  onPress,
  c,
}: {
  active: boolean;
  label: string;
  count: number;
  hub?: boolean;
  onPress: () => void;
  c: ReturnType<typeof useColors>;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        {
          backgroundColor: active ? c.primary : c.card,
          borderColor: active ? c.primary : c.border,
          shadowColor: active ? c.primary : c.shadow,
          shadowOpacity: active ? 0.22 : 0,
          elevation: active ? 3 : 0,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {hub && (
        <Feather
          name="home"
          size={11}
          color={active ? c.primaryForeground : c.mutedForeground}
        />
      )}
      <Text
        style={[styles.chipText, { color: active ? c.primaryForeground : c.foreground }]}
        numberOfLines={1}
      >
        {label}
      </Text>
      <View
        style={[
          styles.countPill,
          { backgroundColor: active ? 'rgba(255,255,255,0.22)' : c.surfaceAlt },
        ]}
      >
        <Text style={[styles.countText, { color: active ? c.primaryForeground : c.mutedForeground }]}>
          {count}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 8,
  },
  row: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leadIcon: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip: {
    paddingLeft: 14,
    paddingRight: 8,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 0,
  },
  chipText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    maxWidth: 130,
  },
  countPill: {
    minWidth: 22,
    paddingHorizontal: 6,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
});

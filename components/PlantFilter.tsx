import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
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
    <View style={[styles.wrapper, { borderBottomColor: c.hairline }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {/* "All" chip */}
        <FilterChip
          active={!selectedPlantID}
          label="All Plants"
          count={commissioned.length}
          icon="layers"
          onPress={() => setSelectedPlantID(null)}
          c={c}
        />

        {plants.map(p => {
          const active = selectedPlantID === p.plantID;
          return (
            <FilterChip
              key={p.plantID}
              active={active}
              label={p.name}
              count={countFor(p.plantID)}
              icon={p.plantType === 'HUB_WAREHOUSE' ? 'home' : 'map-pin'}
              onPress={() => setSelectedPlantID(active ? null : p.plantID)}
              c={c}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

function FilterChip({
  active,
  label,
  count,
  icon,
  onPress,
  c,
}: {
  active: boolean;
  label: string;
  count: number;
  icon: keyof typeof Feather.glyphMap;
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
          shadowColor: active ? c.primary : 'transparent',
        },
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View
        style={[
          styles.chipIconWrap,
          { backgroundColor: active ? c.primaryForeground + '20' : c.surfaceAlt },
        ]}
      >
        {icon === 'map-pin' ? (
          <Image
            source={require('@/assets/images/LogoLocation.png')}
            style={{ width: 15, height: 15 }}
            resizeMode="contain"
          />
        ) : (
          <Feather
            name={icon}
            size={11}
            color={active ? c.primaryForeground : c.mutedForeground}
          />
        )}
      </View>
      <Text
        style={[
          styles.chipText,
          { color: active ? c.primaryForeground : c.foreground },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
      <View
        style={[
          styles.chipCount,
          { backgroundColor: active ? c.primaryForeground + '22' : c.muted },
        ]}
      >
        <Text
          style={[
            styles.chipCountText,
            { color: active ? c.primaryForeground : c.mutedForeground },
          ]}
        >
          {count}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  row: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingLeft: 8,
    paddingRight: 6,
    paddingVertical: 7,
    borderRadius: 24,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 2,
  },
  chipIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    maxWidth: 120,
    letterSpacing: -0.1,
  },
  chipCount: {
    minWidth: 22,
    paddingHorizontal: 6,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipCountText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
});

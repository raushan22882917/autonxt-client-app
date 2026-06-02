import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';

export function PlantFilter() {
  const colors = useColors();
  const { plants, selectedPlantID, setSelectedPlantID } = useApp();

  if (plants.length === 0) return null;

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        <TouchableOpacity
          style={[
            styles.chip,
            {
              backgroundColor: !selectedPlantID ? colors.primary : colors.card,
              borderColor: !selectedPlantID ? colors.primary : colors.border,
            },
          ]}
          onPress={() => setSelectedPlantID(null)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.chipText,
              { color: !selectedPlantID ? colors.primaryForeground : colors.mutedForeground },
            ]}
          >
            All Plants
          </Text>
        </TouchableOpacity>

        {plants.map(p => {
          const isSelected = selectedPlantID === p.plantID;
          return (
            <TouchableOpacity
              key={p.plantID}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? colors.primary : colors.card,
                  borderColor: isSelected ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setSelectedPlantID(isSelected ? null : p.plantID)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: isSelected ? colors.primaryForeground : colors.foreground },
                ]}
                numberOfLines={1}
              >
                {p.name}
              </Text>
              {p.plantType === 'HUB_WAREHOUSE' && (
                <Text style={[styles.badge, { color: isSelected ? colors.primaryForeground : colors.mutedForeground }]}>
                  {' '}HUB
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
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
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    maxWidth: 120,
  },
  badge: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
});

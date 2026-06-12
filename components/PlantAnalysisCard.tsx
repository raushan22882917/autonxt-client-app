import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import type { PlantSummary } from '@/lib/plantAnalysis';

type Props = {
  summary: PlantSummary;
  onPress: () => void;
};

export function PlantAnalysisCard({ summary, onPress }: Props) {
  const c = useColors();
  const { plant, theme, tractorCount } = summary;

  const accentColor = theme.accent;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          borderColor: c.border,
          shadowColor: c.shadowStrong,
          backgroundColor: c.card,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.82}
    >
      {/* Left side: Solid circular badge containing total tractors count */}
      <View style={[styles.leftBadgeWrap, { backgroundColor: accentColor }]}>
        <Text style={styles.leftBadgeText}>{tractorCount}</Text>
      </View>

      {/* Middle section: Plant name and coordinate/location */}
      <View style={styles.middleSection}>
        <Text style={[styles.plantName, { color: c.foreground }]} numberOfLines={1}>
          {plant.name}
        </Text>
        {plant.location ? (
          <Text style={[styles.coordinateText, { color: c.mutedForeground }]} numberOfLines={2}>
            {plant.location}
          </Text>
        ) : (
          <Text style={[styles.coordinateText, { color: c.mutedForeground }]} numberOfLines={1}>
            No location set
          </Text>
        )}
      </View>

      {/* Vertical divider line */}
      <View style={[styles.verticalDivider, { backgroundColor: c.border }]} />

      {/* Right section: Theme icon and plant type label */}
      <View style={styles.rightSection}>
        <Feather name={theme.icon} size={18} color={accentColor} />
        <Text style={[styles.plantTypeLabel, { color: c.mutedForeground }]} numberOfLines={1}>
          {plant.plantType === 'HUB_WAREHOUSE' ? 'Hub' : 'Site'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  leftBadgeWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  leftBadgeText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
    gap: 3,
    paddingRight: 8,
  },
  plantName: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.3,
  },
  coordinateText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    lineHeight: 16,
  },
  verticalDivider: {
    width: 1.5,
    height: '100%',
    minHeight: 32,
    marginHorizontal: 12,
    alignSelf: 'stretch',
  },
  rightSection: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  plantTypeLabel: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
  },
});

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import type { PlantSummary } from '@/lib/plantAnalysis';

const PlantLogo = require('@/assets/images/PlantLogo.png');

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
          borderColor: 'rgba(0, 0, 0, 0.05)',
          shadowColor: '#0F172A',
          backgroundColor: '#FFFFFF',
        },
      ]}
      onPress={onPress}
      activeOpacity={0.82}
    >
      {/* Left side: Plant logo image */}
      <Image
        source={PlantLogo}
        style={styles.logoImage}
        resizeMode="contain"
      />

      {/* Vertical divider line between logo and name */}
      <View style={[styles.verticalDivider, { backgroundColor: '#E2E8F0' }]} />

      {/* Middle section: Plant name */}
      <View style={styles.middleSection}>
        <Text style={[styles.plantName, { color: '#0F172A' }]} numberOfLines={1}>
          {plant.name}
        </Text>
      </View>

      {/* Vertical divider line */}
      <View style={[styles.verticalDivider, { backgroundColor: '#E2E8F0' }]} />

      {/* Right section: Theme icon, plant type label, and chevron arrow (horizontal layout) */}
      <View style={styles.rightSection}>
        <Feather name={theme.icon} size={15} color={accentColor} style={{ marginRight: 6 }} />
        <Text style={[styles.plantTypeLabel, { color: c.mutedForeground }]} numberOfLines={1}>
          {plant.plantType === 'HUB_WAREHOUSE' ? 'Hub' : 'Site'}
        </Text>
        <Feather name="chevron-right" size={14} color="#94A3B8" style={{ marginLeft: 6 }} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  logoImage: {
    width: 26,
    height: 26,
    marginRight: 0,
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
    paddingRight: 8,
  },
  plantName: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  coordinateText: {
    fontSize: 11.5,
    fontFamily: 'Inter_400Regular',
    flex: 1,
  },
  verticalDivider: {
    width: 1,
    height: 24,
    marginHorizontal: 12,
    alignSelf: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 4,
  },
  plantTypeLabel: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
});

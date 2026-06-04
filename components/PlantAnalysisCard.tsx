import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import type { PlantSummary } from '@/lib/plantAnalysis';
import { formatPct } from '@/lib/plantAnalysis';

type Props = {
  summary: PlantSummary;
  onPress: () => void;
};

export function PlantAnalysisCard({ summary, onPress }: Props) {
  const c = useColors();
  const { plant, theme, tractorCount, maintenance, inOperation, openTickets, uptimePct, downtimePct, repairDays } =
    summary;

  const uptimeGood = uptimePct >= 75;
  const uptimeColor = uptimePct >= 75 ? c.success : uptimePct >= 50 ? c.warning : c.red;

  return (
    <TouchableOpacity
      style={[styles.card, { borderColor: theme.border, shadowColor: c.shadowStrong }]}
      onPress={onPress}
      activeOpacity={0.82}
    >
      {/* Gradient header zone */}
      <View
        style={[
          styles.cardHeader,
          { backgroundColor: theme.accent + '0E' },
        ]}
      >
        <View style={styles.headerLeft}>
          <View style={[styles.iconWrap, { backgroundColor: theme.accent + '1C' }]}>
            <Feather name={theme.icon} size={22} color={theme.accent} />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.plantName, { color: c.foreground }]} numberOfLines={2}>
              {plant.name}
            </Text>
            {plant.location ? (
              <View style={styles.locationRow}>
                <Feather name="map-pin" size={11} color={c.mutedForeground} />
                <Text style={[styles.location, { color: c.mutedForeground }]} numberOfLines={1}>
                  {plant.location}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
        <View style={[styles.arrowBadge, { backgroundColor: theme.accent + '1A' }]}>
          <Feather name="chevron-right" size={18} color={theme.accent} />
        </View>
      </View>

      {/* Stats grid */}
      <View style={styles.statsGrid}>
        <StatCell label="Tractors" value={tractorCount} color={theme.accent} />
        <StatCell label="In Operation" value={inOperation} color={c.success} />
        <StatCell label="Maintenance" value={maintenance} color={c.warning} />
        <StatCell label="Open Tickets" value={openTickets} color={c.red} />
      </View>

      {/* Metrics bar */}
      <View style={[styles.metricsBar, { backgroundColor: c.surfaceAlt, borderColor: c.hairline }]}>
        <MetricItem label="Uptime" value={formatPct(uptimePct)} color={uptimeColor} />
        <View style={[styles.metricDivider, { backgroundColor: c.border }]} />
        <MetricItem label="Downtime" value={formatPct(downtimePct)} color={c.warning} />
        <View style={[styles.metricDivider, { backgroundColor: c.border }]} />
        <MetricItem label="Repair" value={`${repairDays}d`} color={c.red} />
      </View>

      {/* Uptime bar */}
      <View style={styles.uptimeBarWrap}>
        <View style={[styles.uptimeTrack, { backgroundColor: c.track }]}>
          <View
            style={[
              styles.uptimeFill,
              {
                width: `${Math.min(100, uptimePct)}%`,
                backgroundColor: uptimeColor,
              },
            ]}
          />
        </View>
        <Text style={[styles.uptimeLabel, { color: uptimeColor }]}>
          {formatPct(uptimePct)} uptime
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function StatCell({ label, value, color }: { label: string; value: number; color: string }) {
  const c = useColors();
  return (
    <View style={[statStyles.cell, { backgroundColor: color + '0C', borderColor: color + '25' }]}>
      <Text style={[statStyles.value, { color }]}>{value}</Text>
      <Text style={[statStyles.label, { color: c.mutedForeground }]}>{label}</Text>
    </View>
  );
}

function MetricItem({ label, value, color }: { label: string; value: string; color: string }) {
  const c = useColors();
  return (
    <View style={metricStyles.item}>
      <Text style={[metricStyles.value, { color }]}>{value}</Text>
      <Text style={[metricStyles.label, { color: c.mutedForeground }]}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  cell: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderWidth: 1,
  },
  value: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },
});

const metricStyles = StyleSheet.create({
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  value: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.3,
  },
  label: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
  },
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  plantName: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    flex: 1,
  },
  arrowBadge: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  metricsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 14,
    marginBottom: 12,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
  },
  metricDivider: {
    width: 1,
    height: 30,
  },
  uptimeBarWrap: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 6,
  },
  uptimeTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  uptimeFill: {
    height: '100%',
    borderRadius: 3,
  },
  uptimeLabel: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
});

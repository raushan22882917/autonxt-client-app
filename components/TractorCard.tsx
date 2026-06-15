import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { Tractor } from '@/lib/appsync';
import { getImplementFeetLabel } from '@/lib/tractorImages';
import { fmtMetric } from '@/lib/tractorMetrics';
import { isTelemetryDisconnected } from '@/lib/telemetry';
import { TractorImage } from './TractorImage';

interface Props {
  tractor: Tractor;
  onOpenDetail?: () => void;
  /** Detail screen: same card, no info/chevron actions */
  hideActions?: boolean;
}

export function TractorCard({ tractor: t, onOpenDetail, hideActions }: Props) {
  const c = useColors();
  const inMaintenance = t.status === 'MAINTENANCE';
  const live = !isTelemetryDisconnected(t.telemetryAt);
  const headlineId = t.registerNumber || t.serialNumber;
  const systemId = t.loggerID || t.registerNumber || t.serialNumber;
  const location = t.liveLocation || t.plantName || 'Vadodara';
  const implementLabel = t.currentImplement
    ? getImplementFeetLabel(t.currentImplement) || t.currentImplement
    : 'Normal Tractor';

  const cardBg = '#FFFFFF';
  const cardBorder = 'rgba(0, 0, 0, 0.05)';
  const accentColor = '#7E152F'; // Brand burgundy

  const renderStatusPill = () => {
    let pillBg = '#F1F3F4';
    let dotColor = '#5F6368';
    let textColor = '#5F6368';
    let label = 'Off';

    if (t.status === 'ACTIVE') {
      pillBg = '#E6F4EA';
      dotColor = '#137333';
      textColor = '#137333';
      label = 'Active';
    } else if (t.status === 'MAINTENANCE') {
      pillBg = '#E8F0FE';
      dotColor = '#1A73E8';
      textColor = '#1A73E8';
      label = 'Maint.';
    } else if (t.status === 'IDLE') {
      pillBg = '#FEF7E0';
      dotColor = '#B06000';
      textColor = '#B06000';
      label = 'Idle';
    } else if (t.status === 'OFFLINE') {
      pillBg = '#F1F3F4';
      dotColor = '#5F6368';
      textColor = '#5F6368';
      label = 'Offline';
    }

    return (
      <View style={[styles.statusPill, { backgroundColor: pillBg }]}>
        <View style={[styles.statusDot, { backgroundColor: dotColor }]} />
        <Text style={[styles.statusText, { color: textColor }]}>{label}</Text>
      </View>
    );
  };

  const chips: { key: string; icon: React.ReactNode; label: string }[] = [
    {
      key: 'soc',
      icon: <Feather name="battery" size={12} color="#16A34A" />,
      label: `${fmtMetric(t.soc)}%`,
    },
    {
      key: 'temp',
      icon: <Feather name="thermometer" size={12} color="#D97706" />,
      label: `${fmtMetric(t.temp, 1)}°C`,
    },
    {
      key: 'rpm',
      icon: <MaterialCommunityIcons name="speedometer" size={12} color="#1A73E8" />,
      label: `${fmtMetric(t.rpm)} rpm`,
    },
    {
      key: 'volt',
      icon: <MaterialCommunityIcons name="battery-outline" size={12} color="#0E7490" />,
      label: `${fmtMetric(t.voltage, 1)}V`,
    },
    {
      key: 'amp',
      icon: <Feather name="activity" size={12} color="#C1121F" />,
      label: `${fmtMetric(t.current, 1)}A`,
    },
    {
      key: 'id',
      icon: <Feather name="hash" size={12} color="#64748B" />,
      label: systemId,
    },
    {
      key: 'loc',
      icon: <Feather name="map-pin" size={12} color="#64748B" />,
      label: location,
    },
  ];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: cardBg,
          borderColor: cardBorder,
          shadowColor: '#0F172A',
        },
      ]}
    >
      {/* Top Header Row */}
      {onOpenDetail && !hideActions ? (
        <TouchableOpacity
          style={styles.headerRow}
          onPress={onOpenDetail}
          activeOpacity={0.7}
          accessibilityLabel="Open tractor details"
          accessibilityRole="button"
        >
          <View style={styles.imageBox}>
            <TractorImage tractor={t} resizeMode="contain" colorful={false} />
          </View>
          <View style={styles.headerInfo}>
            <Text
              style={[styles.headlineId, { color: '#0F172A' }]}
              numberOfLines={1}
            >
              {headlineId}
            </Text>
            <Text style={[styles.displayName, { color: '#64748B' }]} numberOfLines={1}>
              {t.displayName || t.tractorID}
            </Text>
          </View>

          <View style={styles.chevronWrap}>
            <Feather name="chevron-right" size={14} color="#64748B" />
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.headerRow}>
          <View style={styles.imageBox}>
            <TractorImage tractor={t} resizeMode="contain" colorful={false} />
          </View>
          <View style={styles.headerInfo}>
            <Text
              style={[styles.headlineId, { color: '#0F172A' }]}
              numberOfLines={1}
            >
              {headlineId}
            </Text>
            <Text style={[styles.displayName, { color: '#64748B' }]} numberOfLines={1}>
              {t.displayName || t.tractorID}
            </Text>
          </View>
        </View>
      )}

      {/* Partitioning Line */}
      <View style={[styles.divider, { backgroundColor: c.border }]} />

      {/* Features & Status Badges */}
      <View style={styles.featuresContainer}>
        {/* Status row: Live status pill, alert mute, model badge */}
        <View style={styles.statusRow}>
          {/* Status pill */}
          {renderStatusPill()}

          {/* Mute button */}
          <View style={styles.muteBtn}>
            <Feather name="volume-x" size={12} color="#64748B" />
          </View>

          {/* Model pill (burgundy badge) */}
          <View style={styles.modelPill}>
            <Feather name="zap" size={10} color="#FFFFFF" />
            <Text style={styles.modelPillText} numberOfLines={1}>
              {t.model}
            </Text>
          </View>
        </View>

        {/* Telemetry Chips Grid */}
        <View style={styles.chipGrid}>
          {chips.map(chip => (
            <View
              key={chip.key}
              style={styles.chip}
            >
              {chip.icon}
              <Text style={styles.chipText} numberOfLines={1}>
                {chip.label}
              </Text>
            </View>
          ))}

          {/* Implement Chip */}
          <View style={styles.implementChip}>
            <Feather name="tool" size={12} color="#7E152F" />
            <Text style={[styles.chipText, { color: '#7E152F' }]} numberOfLines={1}>
              {implementLabel}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
    position: 'relative',
    overflow: 'hidden',
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 1,
  },
  imageBox: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  featuresContainer: {
    gap: 8,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    marginBottom: 4,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    height: 24,
    borderRadius: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  muteBtn: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#7E152F',
  },
  modelPillText: {
    fontSize: 10.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  headlineId: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.3,
  },
  displayName: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    paddingHorizontal: 8,
    height: 24,
    backgroundColor: '#F8FAFC',
  },
  chipText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#475569',
  },
  implementChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    paddingHorizontal: 8,
    height: 24,
    backgroundColor: '#FDF2F4',
  },
  arrowHit: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  chevronWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    width: '100%',
  },
});

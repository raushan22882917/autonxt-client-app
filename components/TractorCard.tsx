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
  const isActive = t.status === 'ACTIVE';
  const live = !isTelemetryDisconnected(t.telemetryAt);
  const headlineId = t.registerNumber || t.serialNumber;
  const systemId = t.loggerID || t.registerNumber || t.serialNumber;
  const location = t.liveLocation || t.plantName || '—';
  const implementLabel = t.currentImplement
    ? getImplementFeetLabel(t.currentImplement) || t.currentImplement
    : 'No implement';

  const cardBg = inMaintenance ? c.warningSoft : c.card;
  const cardBorder = inMaintenance ? c.warningBorder : c.border;
  const accentColor = inMaintenance ? c.warning : c.primary;

  const chips: { key: string; icon: React.ReactNode; label: string }[] = [
    {
      key: 'soc',
      icon: <Feather name="battery" size={12} color={c.success} />,
      label: `${fmtMetric(t.soc)}%`,
    },
    {
      key: 'temp',
      icon: <Feather name="thermometer" size={12} color={c.warning} />,
      label: `${fmtMetric(t.temp, 1)}°C`,
    },
    {
      key: 'rpm',
      icon: <MaterialCommunityIcons name="speedometer" size={13} color={c.primary} />,
      label: `${fmtMetric(t.rpm)} rpm`,
    },
    {
      key: 'volt',
      icon: <MaterialCommunityIcons name="battery-outline" size={13} color={c.info} />,
      label: `${fmtMetric(t.voltage, 1)}V`,
    },
    {
      key: 'amp',
      icon: <Feather name="activity" size={12} color={c.accent} />,
      label: `${fmtMetric(t.current, 1)}A`,
    },
    {
      key: 'id',
      icon: <Feather name="hash" size={12} color={c.mutedForeground} />,
      label: systemId,
    },
    {
      key: 'loc',
      icon: <Feather name="map-pin" size={12} color={c.mutedForeground} />,
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
          shadowColor: c.shadowStrong,
        },
      ]}
    >
      {/* Status banner for maintenance */}
      {inMaintenance && (
        <View style={[styles.statusBanner, { backgroundColor: c.warning + 'EE' }]}>
          <Feather name="tool" size={11} color={c.card} />
          <Text style={[styles.statusBannerText, { color: c.card }]}>In Maintenance</Text>
        </View>
      )}

      {/* Top Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.imageBox}>
          <TractorImage tractor={t} resizeMode="contain" colorful={false} />
        </View>
        <View style={styles.headerInfo}>
          <Text
            style={[styles.headlineId, { color: inMaintenance ? c.warning : c.foreground }]}
            numberOfLines={1}
          >
            {headlineId}
          </Text>
          <Text style={[styles.displayName, { color: c.mutedForeground }]} numberOfLines={1}>
            {t.displayName || t.tractorID}
          </Text>
        </View>

        {/* Chevron right trigger */}
        {onOpenDetail && !hideActions ? (
          <TouchableOpacity
            style={styles.arrowHit}
            onPress={onOpenDetail}
            activeOpacity={0.7}
            accessibilityLabel="Open tractor details"
            accessibilityRole="button"
          >
            <View style={[styles.chevronWrap, { backgroundColor: c.surfaceAlt }]}>
              <Feather name="chevron-right" size={18} color={c.mutedForeground} />
            </View>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Horizontal Divider Line */}
      <View style={[styles.divider, { backgroundColor: c.border }]} />

      {/* Features & Status Badges */}
      <View style={styles.featuresContainer}>
        {/* Status row: Live signal, charging, model pill */}
        <View style={styles.statusRow}>
          {/* Live signal */}
          <View
            style={[
              styles.signalBadge,
              {
                backgroundColor: live ? c.successSoft : c.surfaceAlt,
                borderColor: live ? c.success + '55' : c.border,
              },
            ]}
          >
            <View style={[styles.signalDot, { backgroundColor: live ? c.success : c.mutedForeground }]} />
            <Text style={[styles.signalText, { color: live ? c.success : c.mutedForeground }]}>
              {live ? 'Live' : 'Off'}
            </Text>
          </View>

          {/* Charging */}
          <View
            style={[
              styles.chargeBadge,
              {
                backgroundColor: t.isCharging ? c.blueSoft : c.surfaceAlt,
                borderColor: t.isCharging ? c.blueBorder : c.border,
              },
            ]}
          >
            <MaterialCommunityIcons
              name={t.isCharging ? 'power-plug' : 'power-plug-off-outline'}
              size={13}
              color={t.isCharging ? c.primary : c.mutedForeground}
            />
          </View>

          {/* Model pill */}
          <View style={[styles.modelPill, { backgroundColor: c.accent }]}>
            <Feather name="zap" size={10} color={c.card} />
            <Text style={[styles.modelPillText, { color: c.card }]} numberOfLines={1}>
              {t.model}
            </Text>
          </View>

          {/* In Maintenance Badge */}
          {inMaintenance && (
            <View style={[styles.maintenanceBadge, { backgroundColor: c.warningSoft, borderColor: c.warningBorder }]}>
              <Feather name="tool" size={10} color={c.warning} />
              <Text style={[styles.maintenanceBadgeText, { color: c.warning }]}>Maintenance</Text>
            </View>
          )}
        </View>

        {/* Telemetry Chips Grid */}
        <View style={styles.chipGrid}>
          {chips.map(chip => (
            <View
              key={chip.key}
              style={[styles.chip, { backgroundColor: c.surfaceAlt, borderColor: c.hairline }]}
            >
              {chip.icon}
              <Text style={[styles.chipText, { color: c.foreground }]} numberOfLines={1}>
                {chip.label}
              </Text>
            </View>
          ))}

          {/* Implement Chip */}
          <View
            style={[
              styles.implementChip,
              { backgroundColor: c.chip, borderColor: c.border },
            ]}
          >
            <Feather name="tool" size={12} color={c.primary} />
            <Text style={[styles.chipText, { color: c.foreground }]} numberOfLines={1}>
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
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
    gap: 10,
  },
  statusBanner: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderBottomLeftRadius: 12,
    zIndex: 1,
  },
  statusBannerText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
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
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  featuresContainer: {
    gap: 10,
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
  signalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  signalDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  signalText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  chargeBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  modelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
  },
  modelPillText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.2,
  },
  maintenanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  maintenanceBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.2,
  },
  headlineId: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.4,
  },
  displayName: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 5,
  },
  chipText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    maxWidth: 110,
  },
  implementChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 5,
  },
  arrowHit: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  chevronWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

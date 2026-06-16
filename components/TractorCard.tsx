import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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

  const renderFastChargingBadge = () => {
    if (t.fastCharging !== true) return null;

    return (
      <LinearGradient
        colors={['#00C6FF', '#0072FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.fastChargingBadge}
      >
        <Feather name="zap" size={10} color="#FFFFFF" />
        <Text style={styles.fastChargingText}>Fast</Text>
      </LinearGradient>
    );
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: cardBg,
          borderColor: cardBorder,
          shadowColor: '#7E152F',
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
            <View style={styles.headlineRow}>
              <Text
                style={[styles.headlineId, { color: '#0F172A', flexShrink: 1 }]}
                numberOfLines={1}
              >
                {headlineId}
              </Text>
              {renderFastChargingBadge()}
            </View>
            <Text style={[styles.displayName, { color: '#64748B' }]} numberOfLines={1}>
              {t.displayName || t.tractorID}
            </Text>
            <View style={styles.cardIndicatorRow}>
              {live ? (
                <LinearGradient
                  colors={['#F59E0B', '#D97706']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardLiveBadge}
                >
                  <Feather
                    name="wifi"
                    size={13}
                    color="#FFFFFF"
                  />
                </LinearGradient>
              ) : (
                <Feather
                  name="wifi-off"
                  size={14}
                  color="#94A3B8"
                />
              )}
              {t.isCharging ? (
                <LinearGradient
                  colors={['#3B82F6', '#1A73E8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardPluggedBadge}
                >
                  <MaterialCommunityIcons
                    name="power-plug"
                    size={13}
                    color="#FFFFFF"
                  />
                </LinearGradient>
              ) : (
                <MaterialCommunityIcons
                  name="power-plug-off"
                  size={15}
                  color="#94A3B8"
                />
              )}
              {(t.current != null && t.current > 1) ? (
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.cardModelBadge, styles.cardModelBadgeGlow]}
                >
                  <Feather name="power" size={12} color="#FFFFFF" />
                  <Text style={styles.cardModelBadgeText} numberOfLines={1}>
                    {t.model}
                  </Text>
                </LinearGradient>
              ) : (
                <View style={[styles.cardModelBadge, { backgroundColor: '#7E152F' }]}>
                  <Feather name="power" size={12} color="#FFFFFF" />
                  <Text style={styles.cardModelBadgeText} numberOfLines={1}>
                    {t.model}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.chevronAbsolute}>
            <Feather name="chevron-right" size={16} color="#94A3B8" />
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.headerRow}>
          <View style={styles.imageBox}>
            <TractorImage tractor={t} resizeMode="contain" colorful={false} />
          </View>
          <View style={styles.headerInfo}>
            <View style={styles.headlineRow}>
              <Text
                style={[styles.headlineId, { color: '#0F172A', flexShrink: 1 }]}
                numberOfLines={1}
              >
                {headlineId}
              </Text>
              {renderFastChargingBadge()}
            </View>
            <Text style={[styles.displayName, { color: '#64748B' }]} numberOfLines={1}>
              {t.displayName || t.tractorID}
            </Text>
            <View style={styles.cardIndicatorRow}>
              {live ? (
                <LinearGradient
                  colors={['#F59E0B', '#D97706']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardLiveBadge}
                >
                  <Feather
                    name="wifi"
                    size={13}
                    color="#FFFFFF"
                  />
                </LinearGradient>
              ) : (
                <Feather
                  name="wifi-off"
                  size={14}
                  color="#94A3B8"
                />
              )}
              {t.isCharging ? (
                <LinearGradient
                  colors={['#3B82F6', '#1A73E8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardPluggedBadge}
                >
                  <MaterialCommunityIcons
                    name="power-plug"
                    size={13}
                    color="#FFFFFF"
                  />
                </LinearGradient>
              ) : (
                <MaterialCommunityIcons
                  name="power-plug-off"
                  size={15}
                  color="#94A3B8"
                />
              )}
              {(t.current != null && t.current > 1) ? (
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.cardModelBadge, styles.cardModelBadgeGlow]}
                >
                  <Feather name="power" size={12} color="#FFFFFF" />
                  <Text style={styles.cardModelBadgeText} numberOfLines={1}>
                    {t.model}
                  </Text>
                </LinearGradient>
              ) : (
                <View style={[styles.cardModelBadge, { backgroundColor: '#7E152F' }]}>
                  <Feather name="power" size={12} color="#FFFFFF" />
                  <Text style={styles.cardModelBadgeText} numberOfLines={1}>
                    {t.model}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Partitioning Line */}
      <View style={[styles.divider, { backgroundColor: c.border }]} />

      {/* Features & Status Badges */}
      <View style={styles.featuresContainer}>
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
    position: 'relative',
  },
  chevronAbsolute: {
    position: 'absolute',
    right: 0,
    bottom: 2,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 1,
  },
  imageBox: {
    width: 105,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cardIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 5,
  },
  cardModelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3.5,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
  },
  cardModelBadgeGlow: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  cardModelBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontFamily: 'Inter_700Bold',
  },
  cardPluggedBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3.5,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  cardLiveBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3.5,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  featuresContainer: {
    gap: 8,
  },
  headlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
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
  divider: {
    height: 1,
    width: '100%',
  },
  fastChargingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2.5,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    shadowColor: '#0072FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  fastChargingText: {
    fontSize: 9.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
});

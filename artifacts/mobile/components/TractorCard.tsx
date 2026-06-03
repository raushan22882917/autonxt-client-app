import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { Tractor } from '@/lib/appsync';
import { StatusBadge } from './StatusBadge';

const tractorImg = require('../assets/images/tractor.png');

interface Props {
  tractor: Tractor;
  onPress?: () => void;
}

function fmt(v: number | undefined, digits = 0): string {
  if (v === undefined || v === null || Number.isNaN(v)) return '—';
  return digits > 0 ? v.toFixed(digits) : String(Math.round(v));
}

export function TractorCard({ tractor: t, onPress }: Props) {
  const c = useColors();

  const soc = t.soc;
  const socColor =
    soc === undefined
      ? c.mutedForeground
      : soc <= 20
        ? c.red
        : soc <= 50
          ? c.warning
          : c.success;

  const metrics: {
    icon: keyof typeof Feather.glyphMap;
    label: string;
    value: string;
    tint: string;
  }[] = [
    { icon: 'battery-charging', label: 'Battery', value: soc === undefined ? '—' : `${fmt(soc)}%`, tint: socColor },
    { icon: 'thermometer', label: 'Temp', value: t.temp === undefined ? '—' : `${fmt(t.temp, 1)}°C`, tint: c.red },
    { icon: 'rotate-cw', label: 'RPM', value: fmt(t.rpm), tint: c.blue },
    { icon: 'zap', label: 'Voltage', value: t.voltage === undefined ? '—' : `${fmt(t.voltage, 1)}V`, tint: c.black },
    { icon: 'activity', label: 'Current', value: t.current === undefined ? '—' : `${fmt(t.current, 1)}A`, tint: c.blue },
  ];

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: c.card, borderColor: c.border, shadowColor: c.shadow }]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.85}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.imageWrap, { backgroundColor: c.surfaceAlt }]}>
          <Image source={tractorImg} style={styles.image} resizeMode="contain" />
        </View>

        <View style={styles.headerInfo}>
          <View style={styles.modelRow}>
            <Text style={[styles.model, { color: c.foreground }]} numberOfLines={1}>
              {t.model}
            </Text>
            <View style={[styles.modelBadge, { backgroundColor: c.red }]}>
              <Feather name="zap" size={10} color="#fff" />
              <Text style={styles.modelBadgeText} numberOfLines={1}>
                {t.model}
              </Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Feather name="hash" size={11} color={c.mutedForeground} />
            <Text style={[styles.metaText, { color: c.mutedForeground }]} numberOfLines={1}>
              {t.serialNumber}
            </Text>
          </View>
          {t.plantName ? (
            <View style={styles.metaRow}>
              <Feather name="map-pin" size={11} color={c.mutedForeground} />
              <Text style={[styles.metaText, { color: c.mutedForeground }]} numberOfLines={1}>
                {t.plantName}
              </Text>
            </View>
          ) : null}

          <View style={styles.statusRow}>
            <StatusBadge status={t.status} small />
            <View style={styles.runtimeTag}>
              <Feather name="clock" size={11} color={c.mutedForeground} />
              <Text style={[styles.metaText, { color: c.mutedForeground }]}>
                {t.totalRuntime}h
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Telemetry grid */}
      <View style={[styles.divider, { backgroundColor: c.hairline }]} />
      <View style={styles.grid}>
        {metrics.map(m => (
          <View key={m.label} style={[styles.metric, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
            <Feather name={m.icon} size={14} color={m.tint} />
            <Text style={[styles.metricValue, { color: c.foreground }]} numberOfLines={1}>
              {m.value}
            </Text>
            <Text style={[styles.metricLabel, { color: c.mutedForeground }]} numberOfLines={1}>
              {m.label}
            </Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    gap: 12,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    gap: 12,
  },
  imageWrap: {
    width: 104,
    height: 84,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: { width: 100, height: 80 },
  headerInfo: { flex: 1, gap: 3 },
  modelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  model: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.3,
    flexShrink: 1,
  },
  modelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 7,
    maxWidth: 90,
  },
  modelBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    flexShrink: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  runtimeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  divider: {
    height: 1,
    marginHorizontal: -2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metric: {
    flexBasis: '18%',
    flexGrow: 1,
    minWidth: 58,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 9,
    paddingHorizontal: 4,
    alignItems: 'center',
    gap: 3,
  },
  metricValue: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
  },
  metricLabel: {
    fontSize: 9,
    fontFamily: 'Inter_500Medium',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});

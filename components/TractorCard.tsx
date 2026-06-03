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
}

function SignalIcon({ live, onColor, offColor }: { live: boolean; onColor: string; offColor: string }) {
  if (live) {
    return (
      <View style={styles.signalWrap}>
        <Text style={[styles.signalTri, { color: onColor }]}>▲</Text>
      </View>
    );
  }
  return (
    <View style={[styles.signalWrap, { borderWidth: 1.5, borderColor: offColor, borderRadius: 4 }]}>
      <Text style={[styles.signalTri, { color: offColor }]}>▲</Text>
    </View>
  );
}

export function TractorCard({ tractor: t, onOpenDetail }: Props) {
  const c = useColors();
  const live = !isTelemetryDisconnected(t.telemetryAt);
  const headlineId = t.registerNumber || t.serialNumber;
  const systemId = t.loggerID || t.registerNumber || t.serialNumber;
  const location = t.liveLocation || t.plantName || '—';
  const implementLabel = t.currentImplement
    ? getImplementFeetLabel(t.currentImplement) || t.currentImplement
    : 'No implement';

  const iconColor = c.foreground;

  const chips: { key: string; icon: React.ReactNode; label: string }[] = [
    {
      key: 'soc',
      icon: <Feather name="battery" size={13} color={iconColor} />,
      label: `${fmtMetric(t.soc)}%`,
    },
    {
      key: 'temp',
      icon: <Feather name="thermometer" size={13} color={iconColor} />,
      label: `${fmtMetric(t.temp, 1)}°C`,
    },
    {
      key: 'rpm',
      icon: <MaterialCommunityIcons name="speedometer" size={14} color={iconColor} />,
      label: `${fmtMetric(t.rpm)} RPM`,
    },
    {
      key: 'volt',
      icon: <MaterialCommunityIcons name="battery-outline" size={14} color={iconColor} />,
      label: `${fmtMetric(t.voltage, 1)} V`,
    },
    {
      key: 'amp',
      icon: <Feather name="activity" size={13} color={iconColor} />,
      label: `${fmtMetric(t.current, 1)} A`,
    },
    {
      key: 'id',
      icon: <MaterialCommunityIcons name="cog-outline" size={14} color={iconColor} />,
      label: systemId,
    },
    {
      key: 'loc',
      icon: <MaterialCommunityIcons name="office-building" size={14} color={iconColor} />,
      label: location,
    },
  ];

  const chipStyle = {
    backgroundColor: c.surfaceAlt,
    borderColor: c.border,
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: c.card,
          borderColor: c.border,
          shadowColor: c.shadow,
        },
      ]}
    >
      {/* Left: image + status */}
      <View style={styles.left}>
        <TouchableOpacity
          style={[styles.infoBtn, { backgroundColor: c.red }]}
          onPress={onOpenDetail}
          activeOpacity={0.8}
          disabled={!onOpenDetail}
          accessibilityLabel="Tractor info"
        >
          <Feather name="info" size={14} color={c.primaryForeground} />
        </TouchableOpacity>

        <View style={styles.imageBox}>
          <TractorImage tractor={t} style={styles.image} resizeMode="contain" />
        </View>

        <View style={styles.leftFooter}>
          <SignalIcon live={live} onColor={c.success} offColor={c.red} />
          <MaterialCommunityIcons
            name={t.isCharging ? 'power-plug' : 'power-plug-off-outline'}
            size={22}
            color={t.isCharging ? c.success : c.mutedForeground}
          />
          <View style={[styles.modelPill, { backgroundColor: c.red }]}>
            <Feather name="zap" size={12} color={c.primaryForeground} />
            <Text style={[styles.modelPillText, { color: c.primaryForeground }]} numberOfLines={1}>
              {t.model}
            </Text>
          </View>
        </View>
      </View>

      {/* Right: ID + chips + implement */}
      <View style={styles.right}>
        <Text style={[styles.headlineId, { color: c.foreground }]} numberOfLines={1}>
          {headlineId}
        </Text>

        <View style={styles.chipGrid}>
          {chips.map(chip => (
            <View key={chip.key} style={[styles.chip, chipStyle]}>
              {chip.icon}
              <Text style={[styles.chipText, { color: c.foreground }]} numberOfLines={1}>
                {chip.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={[styles.implementChip, chipStyle]}>
          <Feather name="tool" size={13} color={c.foreground} />
          <Text style={[styles.chipText, { color: c.foreground }]} numberOfLines={1}>
            {implementLabel}
          </Text>
        </View>
      </View>

      {onOpenDetail ? (
        <TouchableOpacity
          style={styles.arrowHit}
          onPress={onOpenDetail}
          activeOpacity={0.7}
          accessibilityLabel="Open tractor details"
          accessibilityRole="button"
        >
          <Feather name="chevron-right" size={22} color={c.mutedForeground} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'stretch',
    minHeight: 168,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  left: {
    width: '38%',
    maxWidth: 148,
    minWidth: 120,
    paddingRight: 6,
  },
  infoBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  imageBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 72,
  },
  image: {
    width: 118,
    height: 88,
  },
  leftFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  signalWrap: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signalTri: {
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '700',
  },
  modelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    maxWidth: 88,
  },
  modelPillText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.2,
  },
  right: {
    flex: 1,
    paddingLeft: 4,
    paddingRight: 4,
    gap: 8,
    minWidth: 0,
  },
  headlineId: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.5,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  chipText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    maxWidth: 120,
  },
  implementChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    maxWidth: '100%',
  },
  arrowHit: {
    justifyContent: 'center',
    paddingLeft: 2,
    paddingRight: 2,
  },
});

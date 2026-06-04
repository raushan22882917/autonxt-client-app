import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { formatPct } from '@/lib/plantAnalysis';

type Props = {
  uptimePct: number;
  downtimePct: number;
  repairDays: number;
  compact?: boolean;
};

export function UptimeMetricCards({ uptimePct, downtimePct, repairDays, compact }: Props) {
  const c = useColors();

  const uptimeColor = uptimePct >= 75 ? c.success : uptimePct >= 50 ? c.warning : c.red;

  const items = [
    {
      key: 'uptime',
      label: 'Uptime',
      value: formatPct(uptimePct),
      icon: 'trending-up' as const,
      color: uptimeColor,
      bg: uptimeColor === c.success ? c.successSoft : uptimeColor === c.warning ? c.warningSoft : c.redSoft,
      border: uptimeColor === c.success ? c.successBorder : uptimeColor === c.warning ? c.warningBorder : c.redBorder,
    },
    {
      key: 'downtime',
      label: 'Downtime',
      value: formatPct(downtimePct),
      icon: 'trending-down' as const,
      color: c.warning,
      bg: c.warningSoft,
      border: c.warningBorder,
    },
    {
      key: 'repair',
      label: 'Repair',
      value: `${repairDays}d`,
      icon: 'tool' as const,
      color: c.red,
      bg: c.redSoft,
      border: c.redBorder,
    },
  ];

  return (
    <View style={[styles.row, compact && styles.rowCompact]}>
      {items.map(item => (
        <View
          key={item.key}
          style={[
            styles.card,
            compact && styles.cardCompact,
            { backgroundColor: item.bg, borderColor: item.border },
          ]}
        >
          <View style={[styles.iconWrap, { backgroundColor: item.color + '20' }]}>
            <Feather name={item.icon} size={compact ? 13 : 15} color={item.color} />
          </View>
          <Text style={[styles.value, compact && styles.valueCompact, { color: item.color }]}>
            {item.value}
          </Text>
          <Text style={[styles.label, { color: item.color + 'AA' }]}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  rowCompact: {
    gap: 6,
  },
  card: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 5,
  },
  cardCompact: {
    paddingVertical: 9,
    borderRadius: 12,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.3,
  },
  valueCompact: {
    fontSize: 14,
  },
  label: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});

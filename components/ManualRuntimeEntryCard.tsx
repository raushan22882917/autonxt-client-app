import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import type { RuntimeRecord } from '@/lib/appsync';
import { manualRuntimeDayHours } from '@/lib/tractorRuntime';
import { formatDate } from '@/lib/complaint';

type Props = {
  record: RuntimeRecord;
  /** Resolved plant name when available */
  plantLabel?: string;
  compact?: boolean;
};

function fmtRawRuntime(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '—';
  return String(Math.round(value * 100) / 100);
}

export function ManualRuntimeEntryCard({ record, plantLabel, compact }: Props) {
  const c = useColors();
  const dayH = manualRuntimeDayHours(record);
  const plantDisplay = plantLabel || record.plantName || record.plantID || '—';

  const fields: { key: string; label: string; value: string }[] = [
    { key: 'date', label: 'Date', value: record.date ? formatDate(record.date) : '—' },
    { key: 'loggerID', label: 'Logger ID', value: record.loggerID || '—' },
    { key: 'plantID', label: 'Plant ID', value: record.plantID || '—' },
    { key: 'orgID', label: 'Org ID', value: record.orgID || '—' },
    {
      key: 'start',
      label: 'Start cumulative runtime',
      value: fmtRawRuntime(record.startCumulativeRuntime),
    },
    {
      key: 'end',
      label: 'End cumulative runtime',
      value: fmtRawRuntime(record.endCumulativeRuntime),
    },
  ];

  if (compact) {
    return (
      <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
        <View style={styles.compactHeader}>
          <View style={[styles.iconWrap, { backgroundColor: c.primary + '14' }]}>
            <Feather name="clock" size={16} color={c.primary} />
          </View>
          <View style={styles.compactTitle}>
            <Text style={[styles.dateTitle, { color: c.foreground }]}>
              {record.date ? formatDate(record.date) : '—'}
            </Text>
            <Text style={[styles.hoursBadge, { color: c.primary }]}>{dayH.toFixed(1)}h logged</Text>
          </View>
        </View>
        <View style={styles.fieldGrid}>
          {fields.filter(f => f.key !== 'date').map(f => (
            <FieldRow key={f.key} label={f.label} value={f.value} compact />
          ))}
          <FieldRow label="Plant" value={plantDisplay} compact />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: c.primary + '14' }]}>
          <Feather name="edit-3" size={18} color={c.primary} />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.cardTitle, { color: c.foreground }]}>Manual runtime entry</Text>
          <Text style={[styles.cardSub, { color: c.mutedForeground }]}>
            {dayH.toFixed(1)}h today
            {record.startCumulativeRuntime != null && record.endCumulativeRuntime != null
              ? ` · ${fmtRawRuntime(record.startCumulativeRuntime)} → ${fmtRawRuntime(record.endCumulativeRuntime)}`
              : ''}
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: c.border }]} />

      <View style={styles.fieldGrid}>
        {fields.map(f => (
          <FieldRow key={f.key} label={f.label} value={f.value} />
        ))}
        <FieldRow label="Plant" value={plantDisplay} />
      </View>
    </View>
  );
}

function FieldRow({
  label,
  value,
  compact,
}: {
  label: string;
  value: string;
  compact?: boolean;
}) {
  const c = useColors();
  return (
    <View style={[styles.fieldRow, compact && styles.fieldRowCompact]}>
      <Text style={[styles.fieldLabel, { color: c.mutedForeground }]}>{label}</Text>
      <Text
        style={[styles.fieldValue, { color: c.foreground }]}
        numberOfLines={compact ? 1 : 2}
        selectable
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { flex: 1, gap: 2 },
  compactTitle: { flex: 1, gap: 2 },
  cardTitle: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
  cardSub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  dateTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  hoursBadge: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  divider: {
    height: 1,
  },
  fieldGrid: {
    gap: 10,
  },
  fieldRow: {
    gap: 3,
  },
  fieldRowCompact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  fieldLabel: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  fieldValue: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
});

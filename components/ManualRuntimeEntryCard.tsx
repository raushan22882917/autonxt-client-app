import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import type { RuntimeRecord } from '@/lib/appsync';
import { manualRuntimeDayHours } from '@/lib/tractorRuntime';
import { formatDate } from '@/lib/complaint';

type Props = {
  record: RuntimeRecord;
  plantLabel?: string;
  compact?: boolean;
};

function fmt(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '—';
  return String(Math.round(value * 100) / 100);
}

export function ManualRuntimeEntryCard({ record, plantLabel, compact }: Props) {
  const c = useColors();
  const dayH = manualRuntimeDayHours(record);
  const plantDisplay = plantLabel || record.plantName || record.plantID || '—';
  const dateStr = record.date ? formatDate(record.date) : '—';
  const hasRange =
    record.startCumulativeRuntime != null && record.endCumulativeRuntime != null;

  if (compact) {
    return (
      <View style={[styles.compactCard, { backgroundColor: c.card, borderColor: c.border }]}>
        {/* Left accent */}
        <View style={[styles.compactAccent, { backgroundColor: c.primary }]} />

        <View style={styles.compactLeft}>
          <View style={[styles.compactIcon, { backgroundColor: c.primary + '12' }]}>
            <Feather name="clock" size={14} color={c.primary} />
          </View>
        </View>

        <View style={styles.compactBody}>
          <View style={styles.compactRow}>
            <Text style={[styles.compactDate, { color: c.foreground }]}>{dateStr}</Text>
            <View style={[styles.hoursChip, { backgroundColor: c.blueSoft }]}>
              <Text style={[styles.hoursChipText, { color: c.primary }]}>
                {dayH.toFixed(1)}h
              </Text>
            </View>
          </View>
          <Text style={[styles.compactMeta, { color: c.mutedForeground }]} numberOfLines={1}>
            {plantDisplay}
            {hasRange
              ? ` · ${fmt(record.startCumulativeRuntime)} → ${fmt(record.endCumulativeRuntime)}`
              : ''}
          </Text>
        </View>
      </View>
    );
  }

  const fields: { key: string; label: string; value: string }[] = [
    { key: 'date', label: 'Date', value: dateStr },
    { key: 'plant', label: 'Plant', value: plantDisplay },
    { key: 'loggerID', label: 'Logger ID', value: record.loggerID || '—' },
    { key: 'plantID', label: 'Plant ID', value: record.plantID || '—' },
    { key: 'orgID', label: 'Org ID', value: record.orgID || '—' },
    {
      key: 'start',
      label: 'Start cumulative',
      value: fmt(record.startCumulativeRuntime),
    },
    {
      key: 'end',
      label: 'End cumulative',
      value: fmt(record.endCumulativeRuntime),
    },
  ];

  return (
    <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border, shadowColor: c.shadowStrong }]}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={[styles.cardIcon, { backgroundColor: c.primary + '12' }]}>
          <Feather name="edit-3" size={17} color={c.primary} />
        </View>
        <View style={styles.cardHeaderText}>
          <Text style={[styles.cardTitle, { color: c.foreground }]}>Manual Runtime Entry</Text>
          <Text style={[styles.cardSub, { color: c.mutedForeground }]}>
            {dayH.toFixed(1)}h today
            {hasRange
              ? ` · ${fmt(record.startCumulativeRuntime)} → ${fmt(record.endCumulativeRuntime)}`
              : ''}
          </Text>
        </View>
        <View style={[styles.hoursTag, { backgroundColor: c.blueSoft, borderColor: c.blueBorder }]}>
          <Text style={[styles.hoursTagText, { color: c.primary }]}>{dayH.toFixed(1)}h</Text>
        </View>
      </View>

      {/* Fields */}
      <View style={[styles.fieldsWrap, { borderColor: c.hairline }]}>
        {fields.map((f, i) => (
          <View
            key={f.key}
            style={[
              styles.fieldRow,
              i < fields.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.hairline },
            ]}
          >
            <View style={[styles.fieldIcon, { backgroundColor: c.surfaceAlt }]}>
              <Feather
                name={
                  f.key === 'date' ? 'calendar' :
                  f.key === 'plant' ? 'map-pin' :
                  f.key === 'loggerID' ? 'cpu' :
                  f.key === 'orgID' ? 'briefcase' :
                  'activity'
                }
                size={13}
                color={c.primary}
              />
            </View>
            <View style={styles.fieldContent}>
              <Text style={[styles.fieldLabel, { color: c.mutedForeground }]}>{f.label}</Text>
              <Text
                style={[styles.fieldValue, { color: c.foreground }]}
                numberOfLines={2}
                selectable
              >
                {f.value}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /* ── Compact ── */
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    paddingVertical: 11,
    paddingRight: 14,
    gap: 10,
  },
  compactAccent: {
    width: 3,
    alignSelf: 'stretch',
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  compactLeft: {
    paddingLeft: 10,
  },
  compactIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactBody: { flex: 1, gap: 3 },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  compactDate: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.1,
  },
  hoursChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  hoursChipText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  compactMeta: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },

  /* ── Full ── */
  card: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    paddingBottom: 14,
  },
  cardIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardHeaderText: { flex: 1, gap: 2 },
  cardTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.1,
  },
  cardSub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    lineHeight: 17,
  },
  hoursTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  hoursTagText: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
  },
  fieldsWrap: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  fieldIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  fieldContent: { flex: 1, gap: 2 },
  fieldLabel: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  fieldValue: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 18,
  },
});

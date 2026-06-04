import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { TractorDetailMonthFilter } from '@/components/TractorDetailMonthFilter';
import {
  COMPLAINT_PERIOD_OPTIONS,
  complaintPeriodLabel,
  type ComplaintPeriod,
} from '@/lib/complaintFilters';

type Props = {
  period: ComplaintPeriod;
  customMonth: Date;
  onPeriodChange: (period: ComplaintPeriod) => void;
  onCustomMonthChange: (month: Date) => void;
};

export function PlantDetailDateBar({
  period,
  customMonth,
  onPeriodChange,
  onCustomMonthChange,
}: Props) {
  const c = useColors();
  const label = complaintPeriodLabel(period, period === 'CUSTOM' ? customMonth : undefined);

  return (
    <View style={[styles.wrap, { backgroundColor: c.card, borderColor: c.border }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.headerIcon, { backgroundColor: c.primary + '12' }]}>
          <Feather name="calendar" size={14} color={c.primary} />
        </View>
        <Text style={[styles.headerTitle, { color: c.foreground }]}>Date range</Text>
        <View style={[styles.activePill, { backgroundColor: c.primary + '12' }]}>
          <Text style={[styles.activeLabel, { color: c.primary }]} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </View>

      {/* Period chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {COMPLAINT_PERIOD_OPTIONS.map(opt => {
          const active = period === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? c.primary : c.surfaceAlt,
                  borderColor: active ? c.primary : c.border,
                  shadowColor: active ? c.primary : 'transparent',
                },
              ]}
              onPress={() => onPeriodChange(opt.key)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: active ? c.primaryForeground : c.foreground },
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Custom month picker */}
      {period === 'CUSTOM' ? (
        <View style={[styles.customMonthWrap, { borderTopColor: c.hairline }]}>
          <TractorDetailMonthFilter month={customMonth} onMonthChange={onCustomMonthChange} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerIcon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.1,
  },
  activePill: {
    marginLeft: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  activeLabel: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  chipRow: {
    paddingHorizontal: 14,
    paddingBottom: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  chipText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.1,
  },
  customMonthWrap: {
    borderTopWidth: 1,
  },
});

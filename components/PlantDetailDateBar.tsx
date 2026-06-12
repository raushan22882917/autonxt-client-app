import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import {
  complaintPeriodLabel,
  type ComplaintPeriod,
} from '@/lib/complaintFilters';

type Props = {
  period: ComplaintPeriod;
  customMonth: Date;
  onPressFilter: () => void;
};

export function PlantDetailDateBar({
  period,
  customMonth,
  onPressFilter,
}: Props) {
  const c = useColors();
  const label = complaintPeriodLabel(period, period === 'CUSTOM' ? customMonth : undefined);

  return (
    <TouchableOpacity
      style={[styles.wrap, { backgroundColor: c.background, borderColor: c.border }]}
      onPress={onPressFilter}
      activeOpacity={0.7}
    >
      <View style={[styles.headerIcon, { backgroundColor: c.primary + '12' }]}>
        <Feather name="calendar" size={14} color={c.primary} />
      </View>
      <Text style={[styles.headerTitle, { color: c.foreground }]} numberOfLines={1}>
        {label}
      </Text>
      <View style={styles.actionRow}>
        <Text style={[styles.actionText, { color: c.primary }]}>Change</Text>
        <Feather name="chevron-right" size={14} color={c.primary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
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
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  actionText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
});

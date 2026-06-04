import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { monthLabel, startOfMonth } from '@/lib/periodFilter';

type Props = {
  month: Date;
  onMonthChange: (month: Date) => void;
};

export function TractorDetailMonthFilter({ month, onMonthChange }: Props) {
  const c = useColors();

  const shift = (delta: number) => {
    onMonthChange(startOfMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1)));
  };

  const resetCurrent = () => onMonthChange(startOfMonth(new Date()));

  const isCurrentMonth =
    month.getFullYear() === new Date().getFullYear() &&
    month.getMonth() === new Date().getMonth();

  return (
    <View style={[styles.wrap, { backgroundColor: c.surfaceAlt, borderBottomColor: c.border }]}>
      <TouchableOpacity
        style={[styles.navBtn, { backgroundColor: c.card, borderColor: c.border }]}
        onPress={() => shift(-1)}
        accessibilityLabel="Previous month"
      >
        <Feather name="chevron-left" size={17} color={c.foreground} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.center} onPress={resetCurrent} activeOpacity={0.75}>
        <View style={styles.centerRow}>
          <View style={[styles.calIcon, { backgroundColor: c.primary + '14' }]}>
            <Feather name="calendar" size={13} color={c.primary} />
          </View>
          <Text style={[styles.monthText, { color: c.foreground }]}>
            {monthLabel(month)}
          </Text>
        </View>
        <Text
          style={[
            styles.hint,
            {
              color: isCurrentMonth ? c.mutedForeground : c.primary,
            },
          ]}
        >
          {isCurrentMonth ? 'Current month' : 'Tap to go to current'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navBtn, { backgroundColor: c.card, borderColor: c.border }]}
        onPress={() => shift(1)}
        accessibilityLabel="Next month"
      >
        <Feather name="chevron-right" size={17} color={c.foreground} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 10,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  centerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  calIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.2,
  },
  hint: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 0.1,
  },
});

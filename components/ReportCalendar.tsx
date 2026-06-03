import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { toDateKey } from '@/lib/dailyReport';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type Props = {
  month: Date;
  selectedDates: string[];
  datesWithData: Set<string>;
  onMonthChange: (next: Date) => void;
  onToggleDate: (dateKey: string) => void;
};

export function ReportCalendar({
  month,
  selectedDates,
  datesWithData,
  onMonthChange,
  onToggleDate,
}: Props) {
  const c = useColors();
  const todayKey = toDateKey(new Date());
  const selectedSet = useMemo(() => new Set(selectedDates.map(toDateKey)), [selectedDates]);

  const { year, monthIndex, cells } = useMemo(() => {
    const y = month.getFullYear();
    const m = month.getMonth();
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    const startPad = first.getDay();
    const daysInMonth = last.getDate();

    const list: { dateKey: string | null; day: number }[] = [];
    for (let i = 0; i < startPad; i++) list.push({ dateKey: null, day: 0 });
    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = toDateKey(new Date(y, m, d));
      list.push({ dateKey, day: d });
    }
    while (list.length % 7 !== 0) list.push({ dateKey: null, day: 0 });
    return { year: y, monthIndex: m, cells: list };
  }, [month]);

  const monthLabel = month.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const shiftMonth = (delta: number) => {
    onMonthChange(new Date(year, monthIndex + delta, 1));
  };

  return (
    <View style={[styles.wrap, { backgroundColor: c.card, borderColor: c.border }]}>
      <View style={styles.monthRow}>
        <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: c.surfaceAlt }]}
          onPress={() => shiftMonth(-1)}
          accessibilityLabel="Previous month"
        >
          <Feather name="chevron-left" size={20} color={c.foreground} />
        </TouchableOpacity>
        <Text style={[styles.monthTitle, { color: c.foreground }]}>{monthLabel}</Text>
        <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: c.surfaceAlt }]}
          onPress={() => shiftMonth(1)}
          accessibilityLabel="Next month"
        >
          <Feather name="chevron-right" size={20} color={c.foreground} />
        </TouchableOpacity>
      </View>

      <View style={styles.weekRow}>
        {WEEKDAYS.map(w => (
          <Text key={w} style={[styles.weekLabel, { color: c.mutedForeground }]}>
            {w}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((cell, idx) => {
          if (!cell.dateKey) {
            return <View key={`empty-${idx}`} style={styles.cell} />;
          }
          const selected = selectedSet.has(cell.dateKey);
          const isToday = cell.dateKey === todayKey;
          const hasData = datesWithData.has(cell.dateKey);

          return (
            <TouchableOpacity
              key={cell.dateKey}
              style={[
                styles.cell,
                styles.dayBtn,
                { borderColor: c.border },
                selected && { backgroundColor: c.primary, borderColor: c.primary },
                !selected && isToday && { borderColor: c.primary, borderWidth: 2 },
              ]}
              onPress={() => onToggleDate(cell.dateKey!)}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.dayNum,
                  { color: selected ? c.primaryForeground : c.foreground },
                ]}
              >
                {cell.day}
              </Text>
              {hasData ? (
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: selected ? c.primaryForeground : c.primary },
                  ]}
                />
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[styles.hint, { color: c.mutedForeground }]}>
        Tap days to select · dot = manual runtime logged · tap again to deselect
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  weekRow: {
    flexDirection: 'row',
  },
  weekLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%` as `${number}%`,
    aspectRatio: 1,
    padding: 2,
  },
  dayBtn: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dayNum: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  hint: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    lineHeight: 15,
    textAlign: 'center',
  },
});

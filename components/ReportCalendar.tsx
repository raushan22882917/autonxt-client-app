import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { toDateKey } from '@/lib/dailyReport';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const WEEKDAYS_FULL = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
      list.push({ dateKey: toDateKey(new Date(y, m, d)), day: d });
    }
    while (list.length % 7 !== 0) list.push({ dateKey: null, day: 0 });
    return { year: y, monthIndex: m, cells: list };
  }, [month]);

  const monthLabel = month.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const shiftMonth = (delta: number) => {
    onMonthChange(new Date(year, monthIndex + delta, 1));
  };

  const isCurrentMonth =
    year === new Date().getFullYear() && monthIndex === new Date().getMonth();

  const selectedCount = selectedSet.size;

  return (
    <View>
      {/* Month nav header */}
      <View style={[styles.monthNav, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
        <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: c.card, borderColor: c.border }]}
          onPress={() => shiftMonth(-1)}
          accessibilityLabel="Previous month"
        >
          <Feather name="chevron-left" size={18} color={c.foreground} />
        </TouchableOpacity>

        <View style={styles.monthInfo}>
          <Text style={[styles.monthTitle, { color: c.foreground }]}>{monthLabel}</Text>
          {selectedCount > 0 ? (
            <View style={[styles.countBadge, { backgroundColor: c.primary }]}>
              <Text style={[styles.countText, { color: c.primaryForeground }]}>
                {selectedCount} selected
              </Text>
            </View>
          ) : (
            <Text style={[styles.monthHint, { color: c.mutedForeground }]}>
              {isCurrentMonth ? 'This month' : 'Tap to select days'}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: c.card, borderColor: c.border }]}
          onPress={() => shiftMonth(1)}
          accessibilityLabel="Next month"
        >
          <Feather name="chevron-right" size={18} color={c.foreground} />
        </TouchableOpacity>
      </View>

      {/* Calendar grid */}
      <View style={styles.gridWrap}>
        {/* Weekday labels */}
        <View style={styles.weekRow}>
          {WEEKDAYS_FULL.map((w, i) => (
            <Text key={`${w}-${i}`} style={[styles.weekLabel, { color: c.mutedForeground }]}>
              {w}
            </Text>
          ))}
        </View>

        {/* Day cells */}
        <View style={styles.grid}>
          {cells.map((cell, idx) => {
            if (!cell.dateKey) {
              return <View key={`empty-${idx}`} style={styles.cell} />;
            }
            const selected = selectedSet.has(cell.dateKey);
            const isToday = cell.dateKey === todayKey;
            const hasData = datesWithData.has(cell.dateKey);
            const isPast = cell.dateKey < todayKey;

            return (
              <TouchableOpacity
                key={cell.dateKey}
                style={styles.cell}
                onPress={() => onToggleDate(cell.dateKey!)}
                activeOpacity={0.75}
              >
                <View
                  style={[
                    styles.dayInner,
                    selected && styles.daySelected,
                    !selected && isToday && styles.dayToday,
                    selected && { backgroundColor: c.primary },
                    !selected && isToday && { borderColor: c.primary, borderWidth: 2 },
                  ]}
                >
                  {selected ? (
                    <LinearGradient
                      colors={[c.primary, c.gradientEnd]}
                      style={StyleSheet.absoluteFillObject}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    />
                  ) : null}
                  <Text
                    style={[
                      styles.dayNum,
                      {
                        color: selected
                          ? c.primaryForeground
                          : isToday
                            ? c.primary
                            : isPast
                              ? c.foreground
                              : c.foreground,
                        fontFamily: isToday || selected ? 'Inter_700Bold' : 'Inter_500Medium',
                        zIndex: 1,
                      },
                    ]}
                  >
                    {cell.day}
                  </Text>
                  {hasData ? (
                    <View
                      style={[
                        styles.dot,
                        {
                          backgroundColor: selected
                            ? c.primaryForeground
                            : c.primary,
                          zIndex: 1,
                        },
                      ]}
                    />
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Legend */}
        <View style={[styles.legend, { borderTopColor: c.hairline }]}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: c.primary }]} />
            <Text style={[styles.legendText, { color: c.mutedForeground }]}>Has data</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendRing, { borderColor: c.primary }]} />
            <Text style={[styles.legendText, { color: c.mutedForeground }]}>Today</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendFill, { backgroundColor: c.primary }]} />
            <Text style={[styles.legendText, { color: c.mutedForeground }]}>Selected</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthInfo: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  monthTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.3,
  },
  monthHint: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  countText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  gridWrap: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  weekRow: {
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: 4,
  },
  weekLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%` as `${number}%`,
    aspectRatio: 1,
    padding: 3,
  },
  dayInner: {
    flex: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    overflow: 'hidden',
  },
  daySelected: {
    borderRadius: 10,
  },
  dayToday: {
    borderRadius: 10,
  },
  dayNum: {
    fontSize: 13,
    lineHeight: 17,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingTop: 10,
    marginTop: 4,
    borderTopWidth: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendRing: {
    width: 14,
    height: 14,
    borderRadius: 4,
    borderWidth: 2,
  },
  legendFill: {
    width: 14,
    height: 14,
    borderRadius: 4,
    opacity: 0.85,
  },
  legendText: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
  },
});

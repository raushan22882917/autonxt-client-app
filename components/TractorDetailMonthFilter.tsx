import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { monthLabel, startOfMonth } from '@/lib/periodFilter';

type Props = {
  month: Date;
  onMonthChange: (month: Date) => void;
};

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr',
  'May', 'Jun', 'Jul', 'Aug',
  'Sep', 'Oct', 'Nov', 'Dec'
];

export function TractorDetailMonthFilter({ month, onMonthChange }: Props) {
  const c = useColors();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'months' | 'years'>('months');
  const [tempYear, setTempYear] = useState(month.getFullYear());
  const [tempMonth, setTempMonth] = useState(month.getMonth());

  // Keep internal states in sync with external values and default to month view when opening
  useEffect(() => {
    if (pickerOpen) {
      setTempYear(month.getFullYear());
      setTempMonth(month.getMonth());
      setViewMode('months');
    }
  }, [pickerOpen, month]);

  const shift = (delta: number) => {
    onMonthChange(startOfMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1)));
  };

  const isCurrentMonth =
    month.getFullYear() === new Date().getFullYear() &&
    month.getMonth() === new Date().getMonth();

  // Dynamic 12-year grid calculation
  const baseYear = Math.floor(tempYear / 12) * 12;
  const yearsToRender = Array.from({ length: 12 }, (_, i) => baseYear + i);

  return (
    <View style={[styles.wrap, { backgroundColor: c.redSoft, borderColor: c.redBorder }]}>
      <TouchableOpacity
        style={[styles.navBtn, { backgroundColor: c.card, borderColor: c.border }]}
        onPress={() => shift(-1)}
        accessibilityLabel="Previous month"
      >
        <Feather name="chevron-left" size={17} color={c.foreground} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.center, { backgroundColor: c.card, borderColor: c.border }]}
        onPress={() => setPickerOpen(true)}
        activeOpacity={0.75}
      >
        <View style={styles.centerRow}>
          <View style={[styles.calIcon, { backgroundColor: c.primary + '14' }]}>
            <Feather name="calendar" size={13} color={c.primary} />
          </View>
          <Text style={[styles.monthText, { color: c.foreground }]}>
            {monthLabel(month)}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navBtn, { backgroundColor: c.card, borderColor: c.border }]}
        onPress={() => shift(1)}
        accessibilityLabel="Next month"
      >
        <Feather name="chevron-right" size={17} color={c.foreground} />
      </TouchableOpacity>

      <Modal
        visible={pickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setPickerOpen(false)}
        >
          <Pressable
            style={[styles.modalContent, { backgroundColor: c.card, borderColor: c.border }]}
            onPress={e => e.stopPropagation()}
          >
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: c.foreground }]}>Select Period</Text>
              <TouchableOpacity
                onPress={() => setPickerOpen(false)}
                style={[styles.closeBtn, { backgroundColor: c.surfaceAlt }]}
              >
                <Feather name="x" size={16} color={c.foreground} />
              </TouchableOpacity>
            </View>

            {/* Year Selector Row */}
            <View style={styles.yearRow}>
              <TouchableOpacity
                onPress={() => {
                  if (viewMode === 'months') {
                    setTempYear(y => y - 1);
                  } else {
                    setTempYear(y => y - 12);
                  }
                }}
                style={[styles.yearNavBtn, { backgroundColor: c.surfaceAlt }]}
              >
                <Feather name="chevron-left" size={18} color={c.foreground} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setViewMode(v => v === 'months' ? 'years' : 'months')}
                style={[styles.yearSelectorBtn, { backgroundColor: c.surfaceAlt }]}
                activeOpacity={0.72}
              >
                <Text style={[styles.yearLabel, { color: c.foreground }]}>
                  {viewMode === 'months' ? tempYear : `${baseYear} - ${baseYear + 11}`}
                </Text>
                <Feather name={viewMode === 'months' ? 'chevron-down' : 'chevron-up'} size={14} color={c.foreground} style={{ marginLeft: 4 }} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (viewMode === 'months') {
                    setTempYear(y => y + 1);
                  } else {
                    setTempYear(y => y + 12);
                  }
                }}
                style={[styles.yearNavBtn, { backgroundColor: c.surfaceAlt }]}
              >
                <Feather name="chevron-right" size={18} color={c.foreground} />
              </TouchableOpacity>
            </View>

            {/* Grid Container */}
            {viewMode === 'months' ? (
              <View style={styles.monthGrid}>
                {MONTHS.map((mLabel, idx) => {
                  const isSelected = tempMonth === idx && tempYear === month.getFullYear();
                  return (
                    <TouchableOpacity
                      key={mLabel}
                      style={[
                        styles.monthCell,
                        { backgroundColor: isSelected ? c.primary : c.surfaceAlt },
                      ]}
                      onPress={() => {
                        setTempMonth(idx);
                        onMonthChange(new Date(tempYear, idx, 1));
                        setPickerOpen(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.monthCellText,
                          {
                            color: isSelected ? '#FFFFFF' : c.foreground,
                            fontFamily: isSelected ? 'Inter_700Bold' : 'Inter_500Medium',
                          },
                        ]}
                      >
                        {mLabel}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <View style={styles.monthGrid}>
                {yearsToRender.map(year => {
                  const isSelected = year === tempYear;
                  return (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.monthCell,
                        { backgroundColor: isSelected ? c.primary : c.surfaceAlt },
                      ]}
                      onPress={() => {
                        setTempYear(year);
                        setViewMode('months');
                      }}
                    >
                      <Text
                        style={[
                          styles.monthCellText,
                          {
                            color: isSelected ? '#FFFFFF' : c.foreground,
                            fontFamily: isSelected ? 'Inter_700Bold' : 'Inter_500Medium',
                          },
                        ]}
                      >
                        {year}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* Footer / Go to Current Month */}
            <View style={[styles.modalFooter, { borderTopColor: c.hairline }]}>
              <TouchableOpacity
                style={[styles.currentMonthBtn, { backgroundColor: c.primary + '14' }]}
                onPress={() => {
                  onMonthChange(startOfMonth(new Date()));
                  setPickerOpen(false);
                }}
              >
                <Feather name="calendar" size={14} color={c.primary} />
                <Text style={[styles.currentMonthBtnText, { color: c.primary }]}>
                  Go to Current Month
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
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
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  // Modal overlay styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(8, 16, 43, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    gap: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#120E10',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.4,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  yearNavBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yearSelectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  yearLabel: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  monthCell: {
    width: '30%',
    aspectRatio: 1.8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthCellText: {
    fontSize: 13,
  },
  modalFooter: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 14,
    alignItems: 'center',
  },
  currentMonthBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    width: '100%',
  },
  currentMonthBtnText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
});

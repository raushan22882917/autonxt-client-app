import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import {
  COMPLAINT_PERIOD_OPTIONS,
  type ComplaintPeriod,
} from '@/lib/complaintFilters';
import { TractorDetailMonthFilter } from '@/components/TractorDetailMonthFilter';

type Props = {
  visible: boolean;
  period: ComplaintPeriod;
  customMonth: Date;
  onClose: () => void;
  onApply: (period: ComplaintPeriod, customMonth: Date) => void;
};

function OptionRow({
  label,
  checked,
  onPress,
  c,
}: {
  label: string;
  checked: boolean;
  onPress: () => void;
  c: ReturnType<typeof useColors>;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.optionRow,
        {
          backgroundColor: checked ? c.primary + '0A' : 'transparent',
          borderColor: checked ? c.primary + '28' : c.hairline,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.check,
          {
            backgroundColor: checked ? c.primary : 'transparent',
            borderColor: checked ? c.primary : c.border,
          },
        ]}
      >
        {checked ? <Feather name="check" size={11} color={c.primaryForeground} /> : null}
      </View>
      <Text
        style={[
          styles.optionLabel,
          {
            color: c.foreground,
            fontFamily: checked ? 'Inter_600SemiBold' : 'Inter_500Medium',
          },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function PlantDetailDateFilterSheet({
  visible,
  period,
  customMonth,
  onClose,
  onApply,
}: Props) {
  const c = useColors();
  const insets = useSafeAreaInsets();

  const [draftPeriod, setDraftPeriod] = useState<ComplaintPeriod>(period);
  const [draftCustomMonth, setDraftCustomMonth] = useState<Date>(customMonth);

  useEffect(() => {
    if (visible) {
      setDraftPeriod(period);
      setDraftCustomMonth(customMonth);
    }
  }, [visible, period, customMonth]);

  const handleApply = () => {
    onApply(draftPeriod, draftCustomMonth);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[
            styles.sheet,
            { backgroundColor: c.card, borderColor: c.border, paddingBottom: insets.bottom + 12 },
          ]}
          onPress={e => e.stopPropagation()}
        >
          <View style={[styles.handle, { backgroundColor: c.border }]} />

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: c.hairline }]}>
            <View style={[styles.headerIcon, { backgroundColor: c.primary + '12' }]}>
              <Feather name="calendar" size={18} color={c.primary} />
            </View>
            <View style={styles.headerText}>
              <Text style={[styles.headerTitle, { color: c.foreground }]}>Select Date Range</Text>
              <Text style={[styles.headerSub, { color: c.mutedForeground }]}>
                Choose the period for plant data summary
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: c.surfaceAlt }]}
              hitSlop={8}
            >
              <Feather name="x" size={18} color={c.foreground} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.group}>
              {COMPLAINT_PERIOD_OPTIONS.map(opt => (
                <OptionRow
                  key={opt.key}
                  label={opt.label}
                  checked={draftPeriod === opt.key}
                  onPress={() => setDraftPeriod(opt.key as ComplaintPeriod)}
                  c={c}
                />
              ))}
            </View>

            {/* Custom Month Picker */}
            {draftPeriod === 'CUSTOM' ? (
              <View style={{
                marginTop: 14,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: c.border,
                padding: 12,
                backgroundColor: c.surfaceAlt,
              }}>
                <TractorDetailMonthFilter
                  month={draftCustomMonth}
                  onMonthChange={setDraftCustomMonth}
                />
              </View>
            ) : null}
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: c.border }]}>
            <TouchableOpacity
              style={[styles.resetBtn, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}
              onPress={() => {
                setDraftPeriod('MONTH');
                setDraftCustomMonth(new Date());
              }}
              activeOpacity={0.8}
            >
              <Feather name="rotate-ccw" size={14} color={c.foreground} />
              <Text style={[styles.resetText, { color: c.foreground }]}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.applyBtn, { backgroundColor: c.primary }]}
              onPress={handleApply}
              activeOpacity={0.85}
            >
              <Feather name="check" size={18} color={c.primaryForeground} />
              <Text style={[styles.applyText, { color: c.primaryForeground }]}>Apply</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(8, 16, 43, 0.55)',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    maxHeight: '90%',
    paddingTop: 8,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { flex: 1, gap: 2 },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { flexGrow: 0 },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 8,
  },
  group: {
    gap: 6,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  check: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  optionLabel: {
    fontSize: 14,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 18,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
  },
  resetText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  applyBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  applyText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
  },
});

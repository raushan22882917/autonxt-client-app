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
import { TractorDetailMonthFilter } from '@/components/TractorDetailMonthFilter';
import {
  COMPLAINT_PERIOD_OPTIONS,
  COMPLAINT_STATUS_TABS,
  DEFAULT_COMPLAINT_FILTERS,
  SEVERITY_FILTERS,
  type ComplaintFilterValues,
  type ComplaintPeriod,
  type ComplaintStatusTab,
  type SeverityFilter,
} from '@/lib/complaintFilters';

type Props = {
  visible: boolean;
  applied: ComplaintFilterValues;
  onClose: () => void;
  onApply: (values: ComplaintFilterValues) => void;
};

function OptionRow({
  label,
  sublabel,
  checked,
  onPress,
  c,
}: {
  label: string;
  sublabel?: string;
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
          borderColor: checked ? c.primary + '30' : c.hairline,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.optionCheck,
          {
            backgroundColor: checked ? c.primary : 'transparent',
            borderColor: checked ? c.primary : c.border,
          },
        ]}
      >
        {checked ? <Feather name="check" size={12} color={c.primaryForeground} /> : null}
      </View>
      <View style={styles.optionText}>
        <Text
          style={[
            styles.optionLabel,
            { color: c.foreground, fontFamily: checked ? 'Inter_600SemiBold' : 'Inter_500Medium' },
          ]}
        >
          {label}
        </Text>
        {sublabel ? (
          <Text style={[styles.optionSub, { color: c.mutedForeground }]}>{sublabel}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

function SectionHeader({ title, c }: { title: string; c: ReturnType<typeof useColors> }) {
  return (
    <View style={styles.sectionHeaderWrap}>
      <View style={[styles.sectionAccent, { backgroundColor: c.primary }]} />
      <Text style={[styles.sectionTitle, { color: c.foreground }]}>{title}</Text>
    </View>
  );
}

export function ComplaintFilterSheet({ visible, applied, onClose, onApply }: Props) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState<ComplaintFilterValues>(applied);

  useEffect(() => {
    if (visible) setDraft(applied);
  }, [visible, applied]);

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[
            styles.sheet,
            {
              backgroundColor: c.card,
              borderColor: c.border,
              paddingBottom: insets.bottom + 12,
            },
          ]}
          onPress={e => e.stopPropagation()}
        >
          {/* Handle */}
          <View style={[styles.handle, { backgroundColor: c.border }]} />

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: c.hairline }]}>
            <View style={[styles.headerIcon, { backgroundColor: c.primary + '12' }]}>
              <Feather name="sliders" size={18} color={c.primary} />
            </View>
            <View style={styles.headerText}>
              <Text style={[styles.headerTitle, { color: c.foreground }]}>Filter Tickets</Text>
              <Text style={[styles.headerSub, { color: c.mutedForeground }]}>
                Narrow down complaint results
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
            keyboardShouldPersistTaps="handled"
          >
            {/* Period */}
            <SectionHeader title="Date Range" c={c} />
            <View style={styles.optionsGroup}>
              {COMPLAINT_PERIOD_OPTIONS.map(opt => (
                <OptionRow
                  key={opt.key}
                  label={opt.label}
                  checked={draft.period === opt.key}
                  onPress={() => setDraft(prev => ({ ...prev, period: opt.key as ComplaintPeriod }))}
                  c={c}
                />
              ))}
            </View>

            {draft.period === 'CUSTOM' ? (
              <View style={[styles.monthWrap, { borderColor: c.border }]}>
                <TractorDetailMonthFilter
                  month={draft.customMonth}
                  onMonthChange={month => setDraft(prev => ({ ...prev, customMonth: month }))}
                />
              </View>
            ) : null}

            {/* Status */}
            <SectionHeader title="Status" c={c} />
            <View style={styles.optionsGroup}>
              {COMPLAINT_STATUS_TABS.map(tab => (
                <OptionRow
                  key={tab.key}
                  label={tab.label}
                  checked={draft.statusTab === tab.key}
                  onPress={() => setDraft(prev => ({ ...prev, statusTab: tab.key as ComplaintStatusTab }))}
                  c={c}
                />
              ))}
            </View>

            {/* Severity */}
            <SectionHeader title="Severity" c={c} />
            <View style={styles.optionsGroup}>
              {SEVERITY_FILTERS.map(s => (
                <OptionRow
                  key={s}
                  label={s === 'ALL' ? 'All severities' : s}
                  checked={draft.severity === s}
                  onPress={() => setDraft(prev => ({ ...prev, severity: s as SeverityFilter }))}
                  c={c}
                />
              ))}
            </View>

            {/* Type */}
            <SectionHeader title="Ticket Type" c={c} />
            <View style={styles.optionsGroup}>
              <OptionRow
                label="Breakdown tickets only"
                sublabel="Includes maintenance, breakdown & accident"
                checked={draft.breakdownOnly}
                onPress={() => setDraft(prev => ({ ...prev, breakdownOnly: !prev.breakdownOnly }))}
                c={c}
              />
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: c.border }]}>
            <TouchableOpacity
              style={[styles.resetBtn, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}
              onPress={() => setDraft(DEFAULT_COMPLAINT_FILTERS)}
              activeOpacity={0.8}
            >
              <Feather name="rotate-ccw" size={15} color={c.foreground} />
              <Text style={[styles.resetBtnText, { color: c.foreground }]}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.applyBtn, { backgroundColor: c.primary }]}
              onPress={handleApply}
              activeOpacity={0.85}
            >
              <Feather name="check" size={18} color={c.primaryForeground} />
              <Text style={[styles.applyBtnText, { color: c.primaryForeground }]}>Apply filters</Text>
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
    marginBottom: 4,
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
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 8,
    gap: 0,
  },
  sectionHeaderWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 18,
    marginBottom: 8,
  },
  sectionAccent: {
    width: 3,
    height: 14,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  optionsGroup: {
    gap: 6,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  optionCheck: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  optionText: { flex: 1, gap: 2 },
  optionLabel: {
    fontSize: 14,
  },
  optionSub: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    lineHeight: 16,
  },
  monthWrap: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginTop: 8,
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
    gap: 7,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
  },
  resetBtnText: {
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
  applyBtnText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.1,
  },
});

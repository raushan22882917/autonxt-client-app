import React from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import {
  chargeDetailFields,
  type DailySegmentGroup,
  tripDetailFields,
  type DetailField,
} from '@/lib/usageSegmentDetail';

type Props = {
  visible: boolean;
  group: DailySegmentGroup | null;
  kind: 'trip' | 'charge';
  onClose: () => void;
};

function SegmentCard({
  index,
  total,
  fields,
  kind,
  c,
}: {
  index: number;
  total: number;
  fields: DetailField[];
  kind: 'trip' | 'charge';
  c: ReturnType<typeof useColors>;
}) {
  const iconName = kind === 'trip' ? 'navigation' : 'battery-charging';
  const accentColor = kind === 'trip' ? c.primary : c.success;

  return (
    <View style={[styles.segCard, { backgroundColor: c.card, borderColor: accentColor + '25' }]}>
      {/* Card header */}
      <View style={[styles.segCardHeader, { backgroundColor: accentColor + '08', borderBottomColor: accentColor + '18' }]}>
        <View style={[styles.segCardIcon, { backgroundColor: accentColor + '14' }]}>
          <Feather name={iconName} size={14} color={accentColor} />
        </View>
        <Text style={[styles.segCardTitle, { color: c.foreground }]}>
          {kind === 'trip' ? 'Trip' : 'Session'} #{index + 1}
        </Text>
        <View style={[styles.segBadge, { backgroundColor: accentColor + '14' }]}>
          <Text style={[styles.segBadgeText, { color: accentColor }]}>{index + 1} / {total}</Text>
        </View>
      </View>

      {/* Fields */}
      {fields.map((f, fi) => (
        <View
          key={`${f.label}-${fi}`}
          style={[
            styles.fieldRow,
            fi < fields.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.hairline },
          ]}
        >
          <Text style={[styles.fieldLabel, { color: c.mutedForeground }]}>{f.label}</Text>
          <Text style={[styles.fieldValue, { color: c.foreground }]} selectable numberOfLines={2}>
            {f.value || '—'}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function UsageSegmentDetailSheet({ visible, group, kind, onClose }: Props) {
  const c = useColors();
  const insets = useSafeAreaInsets();

  if (!group) return null;

  const isTrip = kind === 'trip';
  const title = isTrip ? 'Trip Details' : 'Charge Sessions';
  const icon = isTrip ? 'navigation' : 'battery-charging';
  const accentColor = isTrip ? c.primary : c.success;
  const fieldsFor = isTrip ? tripDetailFields : chargeDetailFields;

  const totalDuration = group.durationSec;
  const durationStr =
    totalDuration > 0
      ? `${Math.floor(totalDuration / 3600)}h ${Math.round((totalDuration % 3600) / 60)}m`
      : '—';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[
            styles.sheet,
            { backgroundColor: c.card, borderColor: c.border, paddingBottom: insets.bottom + 16 },
          ]}
          onPress={e => e.stopPropagation()}
        >
          {/* Handle */}
          <View style={[styles.handle, { backgroundColor: c.border }]} />

          {/* Gradient header */}
          <View style={[styles.header, { borderBottomColor: c.hairline }]}>
            <View style={[styles.headerIconWrap, { shadowColor: accentColor }]}>
              <LinearGradient
                colors={[accentColor, accentColor + 'CC']}
                style={styles.headerIconGrad}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Feather name={icon} size={22} color={c.primaryForeground} />
              </LinearGradient>
            </View>

            <View style={styles.headerInfo}>
              <Text style={[styles.headerTitle, { color: c.foreground }]}>{title}</Text>
              <Text style={[styles.headerSub, { color: c.mutedForeground }]}>
                {group.dateLabel} · {group.count} record{group.count === 1 ? '' : 's'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: c.surfaceAlt }]}
              hitSlop={8}
              accessibilityLabel="Close"
            >
              <Feather name="x" size={18} color={c.foreground} />
            </TouchableOpacity>
          </View>

          {/* Day summary strip */}
          <View style={[styles.summaryStrip, { backgroundColor: c.surfaceAlt, borderBottomColor: c.hairline }]}>
            <SummaryPill label="Date" value={group.dateLabel} color={c.foreground} c={c} />
            <View style={[styles.summaryDivider, { backgroundColor: c.border }]} />
            <SummaryPill label="Records" value={String(group.count)} color={accentColor} c={c} />
            <View style={[styles.summaryDivider, { backgroundColor: c.border }]} />
            <SummaryPill label="Duration" value={durationStr} color={accentColor} c={c} />
          </View>

          <ScrollView
            contentContainerStyle={[styles.scrollContent]}
            showsVerticalScrollIndicator={false}
          >
            {group.segments.map((seg, index) => (
              <SegmentCard
                key={`${group.dateKey}-${seg.startTime}-${index}`}
                index={index}
                total={group.count}
                fields={fieldsFor(seg)}
                kind={kind}
                c={c}
              />
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function SummaryPill({
  label,
  value,
  color,
  c,
}: {
  label: string;
  value: string;
  color: string;
  c: ReturnType<typeof useColors>;
}) {
  return (
    <View style={pillStyles.wrap}>
      <Text style={[pillStyles.value, { color }]}>{value}</Text>
      <Text style={[pillStyles.label, { color: c.mutedForeground }]}>{label}</Text>
    </View>
  );
}

const pillStyles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', gap: 3 },
  value: { fontSize: 14, fontFamily: 'Inter_700Bold', letterSpacing: -0.2 },
  label: { fontSize: 10, fontFamily: 'Inter_500Medium', textTransform: 'uppercase', letterSpacing: 0.3 },
});

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
    maxHeight: '88%',
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
  headerIconWrap: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  headerIconGrad: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: { flex: 1, gap: 3 },
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
  summaryStrip: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
  },
  summaryDivider: {
    width: 1,
    height: 32,
    alignSelf: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    gap: 12,
  },
  segCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  segCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  segCardIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segCardTitle: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.1,
  },
  segBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  segBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  fieldRow: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 3,
  },
  fieldLabel: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  fieldValue: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 20,
  },
});

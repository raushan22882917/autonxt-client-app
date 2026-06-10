import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LoadingRing } from '@/components/LoadingRing';
import { useColors } from '@/hooks/useColors';

interface Props {
  inOperation: number;
  inMaintenance: number;
  loading?: boolean;
  style?: any;
}

export function FleetStatusCard({ inOperation, inMaintenance, loading, style }: Props) {
  const c = useColors();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: c.card, borderColor: c.border, shadowColor: c.shadowStrong },
        style,
      ]}
    >
      {/* Header */}
      <View style={styles.topRow}>
        <View style={[styles.iconWrap, { backgroundColor: c.primary + '14' }]}>
          <Feather name="activity" size={18} color={c.primary} />
        </View>
        <View style={[styles.dot, { backgroundColor: c.primary + 'AA' }]} />
      </View>

      <Text style={[styles.title, { color: c.foreground }]}>Fleet Status</Text>

      {/* Split */}
      <View style={styles.split}>
        <View style={styles.half}>
          <View style={[styles.valueWrap, { backgroundColor: c.successSoft }]}>
            {loading ? (
              <LoadingRing size="sm" color={c.success} />
            ) : (
              <Text style={[styles.splitValue, { color: c.success }]}>{inOperation}</Text>
            )}
          </View>
          <View style={styles.splitLabelRow}>
            <Feather name="zap" size={11} color={c.success} />
            <Text style={[styles.splitLabel, { color: c.mutedForeground }]}>In operation</Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: c.border }]} />

        <View style={styles.half}>
          <View style={[styles.valueWrap, { backgroundColor: c.warningSoft }]}>
            {loading ? (
              <LoadingRing size="sm" color={c.warning} />
            ) : (
              <Text style={[styles.splitValue, { color: c.warning }]}>{inMaintenance}</Text>
            )}
          </View>
          <View style={styles.splitLabelRow}>
            <Feather name="tool" size={11} color={c.warning} />
            <Text style={[styles.splitLabel, { color: c.mutedForeground }]}>Maintenance</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  title: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: -0.1,
    marginBottom: 6,
  },
  split: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  half: {
    flex: 1,
    gap: 5,
    alignItems: 'center',
  },
  valueWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    width: 1,
    height: 48,
    marginHorizontal: 8,
  },
  splitValue: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.5,
  },
  splitLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  splitLabel: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
  },
});

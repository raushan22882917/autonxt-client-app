import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Status =
  | 'ACTIVE'
  | 'IDLE'
  | 'MAINTENANCE'
  | 'OFFLINE'
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED'
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL';

const STATUS_CONFIG: Record<Status, { label: string; bg: string; text: string; dot: string }> = {
  // ── Operational states ────────────────────────────────────────────────────
  ACTIVE:      { label: 'Active',      bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },  // Emerald — success
  IDLE:        { label: 'Idle',        bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },  // Amber — warning
  MAINTENANCE: { label: 'Maintenance', bg: '#DBEAFE', text: '#1E40AF', dot: '#0B78B3' },  // Electric Blue
  OFFLINE:     { label: 'Offline',     bg: '#F1F5F9', text: '#475569', dot: '#94A3B8' },  // Slate neutral
  // ── Ticket states ────────────────────────────────────────────────────────
  OPEN:        { label: 'Open',        bg: '#FDE8E5', text: '#9B2213', dot: '#D73220' },  // Bold Red
  IN_PROGRESS: { label: 'In Progress', bg: '#DBEAFE', text: '#1E40AF', dot: '#0B78B3' },  // Electric Blue
  RESOLVED:    { label: 'Resolved',    bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },  // Emerald
  CLOSED:      { label: 'Closed',      bg: '#F1F5F9', text: '#475569', dot: '#94A3B8' },  // Slate neutral
  // ── Severity levels ──────────────────────────────────────────────────────
  LOW:         { label: 'Low',         bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },  // Emerald
  MEDIUM:      { label: 'Medium',      bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },  // Amber
  HIGH:        { label: 'High',        bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },  // Red-orange
  CRITICAL:    { label: 'Critical',    bg: '#FDE8E5', text: '#9B2213', dot: '#D73220' },  // Bold Red
};

const FALLBACK = { label: '—', bg: '#EEF1F6', text: '#526070', dot: '#7A8FA6' };

interface Props {
  status: Status;
  small?: boolean;
}

export function StatusBadge({ status, small }: Props) {
  const config = STATUS_CONFIG[status] ?? FALLBACK;
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }, small && styles.small]}>
      <View style={[styles.dot, { backgroundColor: config.dot }, small && styles.dotSmall]} />
      <Text style={[styles.text, { color: config.text }, small && styles.smallText]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,              // Soft/industrial — 4px per design system
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotSmall: {
    width: 5,
    height: 5,
  },
  text: {
    fontSize: 11,
    fontFamily: 'SpaceMono_400Regular',  // Space Mono for technical readouts
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  small: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 5,
  },
  smallText: {
    fontSize: 10,
  },
});

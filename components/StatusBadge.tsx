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
  ACTIVE:      { label: 'Active',      bg: '#E4F7EC', text: '#0A7032', dot: '#0A9040' },
  IDLE:        { label: 'Idle',        bg: '#FDF0E0', text: '#8A5200', dot: '#CA7000' },
  MAINTENANCE: { label: 'Maintenance', bg: '#E8EFFD', text: '#1040A8', dot: '#1246C8' },
  OFFLINE:     { label: 'Offline',     bg: '#EEF1F6', text: '#526070', dot: '#7A8FA6' },
  OPEN:        { label: 'Open',        bg: '#FDECED', text: '#98080F', dot: '#C1121F' },
  IN_PROGRESS: { label: 'In Progress', bg: '#E8EFFD', text: '#1040A8', dot: '#1246C8' },
  RESOLVED:    { label: 'Resolved',    bg: '#E4F7EC', text: '#0A7032', dot: '#0A9040' },
  CLOSED:      { label: 'Closed',      bg: '#EEF1F6', text: '#526070', dot: '#7A8FA6' },
  LOW:         { label: 'Low',         bg: '#E4F7EC', text: '#0A7032', dot: '#0A9040' },
  MEDIUM:      { label: 'Medium',      bg: '#FDF0E0', text: '#8A5200', dot: '#CA7000' },
  HIGH:        { label: 'High',        bg: '#FDE8DA', text: '#8A3400', dot: '#C44E00' },
  CRITICAL:    { label: 'Critical',    bg: '#FDECED', text: '#98080F', dot: '#C1121F' },
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
    borderRadius: 24,
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
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.1,
  },
  small: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 5,
  },
  smallText: {
    fontSize: 11,
  },
});

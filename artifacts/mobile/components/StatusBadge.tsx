import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Status = 'ACTIVE' | 'IDLE' | 'MAINTENANCE' | 'OFFLINE' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

const STATUS_CONFIG: Record<Status, { label: string; bg: string; text: string; dot: string }> = {
  ACTIVE: { label: 'Active', bg: '#E7F6EC', text: '#127A38', dot: '#16A34A' },
  IDLE: { label: 'Idle', bg: '#FCF1E2', text: '#9A6206', dot: '#D97706' },
  MAINTENANCE: { label: 'Maintenance', bg: '#E8EFFD', text: '#1444B8', dot: '#1456E0' },
  OFFLINE: { label: 'Offline', bg: '#EEF1F5', text: '#64748B', dot: '#94A3B8' },
  OPEN: { label: 'Open', bg: '#FDECEC', text: '#A30E18', dot: '#C1121F' },
  IN_PROGRESS: { label: 'In Progress', bg: '#E8EFFD', text: '#1444B8', dot: '#1456E0' },
  RESOLVED: { label: 'Resolved', bg: '#E7F6EC', text: '#127A38', dot: '#16A34A' },
  CLOSED: { label: 'Closed', bg: '#EEF1F5', text: '#64748B', dot: '#94A3B8' },
  LOW: { label: 'Low', bg: '#E7F6EC', text: '#127A38', dot: '#16A34A' },
  MEDIUM: { label: 'Medium', bg: '#FCF1E2', text: '#9A6206', dot: '#CA8A04' },
  HIGH: { label: 'High', bg: '#FCEEE0', text: '#9A4406', dot: '#D97706' },
  CRITICAL: { label: 'Critical', bg: '#FDECEC', text: '#A30E18', dot: '#C1121F' },
};

interface Props {
  status: Status;
  small?: boolean;
}

export function StatusBadge({ status, small }: Props) {
  const config = STATUS_CONFIG[status] || { label: status, bg: '#EEF1F5', text: '#64748B', dot: '#94A3B8' };
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
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
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
    fontFamily: 'Inter_600SemiBold',
  },
  small: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    gap: 4,
  },
  smallText: {
    fontSize: 10,
  },
});

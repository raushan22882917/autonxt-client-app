import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Status = 'ACTIVE' | 'IDLE' | 'MAINTENANCE' | 'OFFLINE' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

const STATUS_CONFIG: Record<Status, { label: string; bg: string; text: string }> = {
  ACTIVE: { label: 'Active', bg: '#D1FAE5', text: '#065F46' },
  IDLE: { label: 'Idle', bg: '#FEF3C7', text: '#92400E' },
  MAINTENANCE: { label: 'Maintenance', bg: '#DBEAFE', text: '#1E40AF' },
  OFFLINE: { label: 'Offline', bg: '#F3F4F6', text: '#6B7280' },
  OPEN: { label: 'Open', bg: '#FEE2E2', text: '#991B1B' },
  IN_PROGRESS: { label: 'In Progress', bg: '#DBEAFE', text: '#1E40AF' },
  RESOLVED: { label: 'Resolved', bg: '#D1FAE5', text: '#065F46' },
  CLOSED: { label: 'Closed', bg: '#F3F4F6', text: '#6B7280' },
  LOW: { label: 'Low', bg: '#D1FAE5', text: '#065F46' },
  MEDIUM: { label: 'Medium', bg: '#FEF3C7', text: '#92400E' },
  HIGH: { label: 'High', bg: '#FED7AA', text: '#9A3412' },
  CRITICAL: { label: 'Critical', bg: '#FEE2E2', text: '#991B1B' },
};

interface Props {
  status: Status;
  small?: boolean;
}

export function StatusBadge({ status, small }: Props) {
  const config = STATUS_CONFIG[status] || { label: status, bg: '#F3F4F6', text: '#6B7280' };
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }, small && styles.small]}>
      <Text style={[styles.text, { color: config.text }, small && styles.smallText]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  small: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  smallText: {
    fontSize: 10,
  },
});

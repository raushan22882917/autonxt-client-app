import React, { useState } from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { PlantFilter } from '@/components/PlantFilter';
import { StatusBadge } from '@/components/StatusBadge';
import { Complaint } from '@/lib/appsync';

const SEVERITY_FILTERS = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const;
type SeverityFilter = typeof SEVERITY_FILTERS[number];

export default function ComplaintsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { filteredComplaints, isLoading, refresh } = useApp();
  const [severity, setSeverity] = useState<SeverityFilter>('ALL');

  const topPad = Platform.OS === 'web' ? 67 : 0;

  const displayed = severity === 'ALL'
    ? filteredComplaints
    : filteredComplaints.filter(c => c.severity === severity);

  const critCount = filteredComplaints.filter(c => c.severity === 'CRITICAL').length;
  const openCount = filteredComplaints.filter(c => c.status === 'OPEN').length;

  const renderComplaint = ({ item }: { item: Complaint }) => (
    <View style={[styles.card, { borderColor: item.severity === 'CRITICAL' ? '#DC262640' : '#1E293B' }]}>
      <View style={styles.cardTop}>
        <View style={[styles.iconWrap, { backgroundColor: severityColor(item.severity) + '20' }]}>
          <Feather name="alert-triangle" size={18} color={severityColor(item.severity)} />
        </View>
        <View style={styles.info}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.sub}>{item.tractorModel} · {item.plantName}</Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>{item.description}</Text>

      <View style={styles.badgeRow}>
        <StatusBadge status={item.severity} small />
        <StatusBadge status={item.status} small />
        <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: '#0A1628' }]}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        {/* Summary */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryBox, { borderColor: '#DC2626' }]}>
            <Text style={[styles.summaryNum, { color: '#EF4444' }]}>{critCount}</Text>
            <Text style={styles.summaryLabel}>Critical</Text>
          </View>
          <View style={[styles.summaryBox, { borderColor: '#1E293B' }]}>
            <Text style={[styles.summaryNum, { color: '#F97316' }]}>{openCount}</Text>
            <Text style={styles.summaryLabel}>Open</Text>
          </View>
          <View style={[styles.summaryBox, { borderColor: '#1E293B' }]}>
            <Text style={[styles.summaryNum, { color: '#F8FAFC' }]}>{filteredComplaints.length}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
        </View>

        {/* Severity filter */}
        <View style={styles.severityRow}>
          {SEVERITY_FILTERS.map(s => (
            <TouchableOpacity
              key={s}
              style={[
                styles.severityChip,
                severity === s && { backgroundColor: '#F97316' },
                severity !== s && { borderColor: '#1E293B' },
              ]}
              onPress={() => setSeverity(s)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.severityText,
                { color: severity === s ? '#fff' : '#64748B' },
              ]}>
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <PlantFilter />

      <FlatList
        data={displayed}
        keyExtractor={c => c.complaintID}
        renderItem={renderComplaint}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor="#F97316" />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="check-circle" size={36} color="#1E293B" />
            <Text style={styles.emptyText}>No complaints found</Text>
          </View>
        }
      />
    </View>
  );
}

function severityColor(s: string): string {
  switch (s) {
    case 'CRITICAL': return '#EF4444';
    case 'HIGH': return '#F97316';
    case 'MEDIUM': return '#F59E0B';
    case 'LOW': return '#10B981';
    default: return '#64748B';
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' });
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    gap: 2,
  },
  summaryNum: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
  },
  summaryLabel: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: '#64748B',
  },
  severityRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  severityChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: '#111827',
  },
  severityText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 10,
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  title: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#F8FAFC',
  },
  sub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#64748B',
    marginTop: 2,
  },
  description: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
    lineHeight: 18,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  date: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: '#475569',
    marginLeft: 'auto',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    color: '#475569',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});

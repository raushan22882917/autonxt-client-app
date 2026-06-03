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
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/StatusBadge';
import { Complaint } from '@/lib/appsync';
import { severityColor, formatDate } from '@/lib/complaint';

const SEVERITY_FILTERS = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const;
type SeverityFilter = typeof SEVERITY_FILTERS[number];

export default function ComplaintsScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { filteredComplaints, isLoading, refresh } = useApp();
  const [severity, setSeverity] = useState<SeverityFilter>('ALL');

  const topPad = Platform.OS === 'web' ? 67 : 0;

  const displayed =
    severity === 'ALL'
      ? filteredComplaints
      : filteredComplaints.filter(x => x.severity === severity);

  const critCount = filteredComplaints.filter(x => x.severity === 'CRITICAL').length;
  const openCount = filteredComplaints.filter(x => x.status === 'OPEN').length;

  const renderComplaint = ({ item }: { item: Complaint }) => {
    const sev = severityColor(item.severity, c);
    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: c.card,
            borderColor: item.severity === 'CRITICAL' ? sev + '55' : c.border,
            shadowColor: c.shadow,
          },
        ]}
        activeOpacity={0.75}
        onPress={() => router.push(`/complaint/${item.complaintID}`)}
      >
        <View style={[styles.sevStripe, { backgroundColor: sev }]} />
        <View style={styles.cardBody}>
          <View style={styles.cardTop}>
            <View style={[styles.iconWrap, { backgroundColor: sev + '18' }]}>
              <Feather name="alert-triangle" size={18} color={sev} />
            </View>
            <View style={styles.info}>
              <Text style={[styles.title, { color: c.foreground }]} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={[styles.sub, { color: c.mutedForeground }]} numberOfLines={1}>
                {[item.tractorModel, item.plantName].filter(Boolean).join(' · ')}
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color={c.mutedForeground} />
          </View>

          <Text style={[styles.description, { color: c.mutedForeground }]} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.badgeRow}>
            <StatusBadge status={item.severity} small />
            <StatusBadge status={item.status} small />
            <Text style={[styles.date, { color: c.mutedForeground }]}>
              {formatDate(item.createdAt)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        {/* Summary */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryBox, { backgroundColor: c.card, borderColor: c.border }]}>
            <Text style={[styles.summaryNum, { color: c.red }]}>{critCount}</Text>
            <Text style={[styles.summaryLabel, { color: c.mutedForeground }]}>Critical</Text>
          </View>
          <View style={[styles.summaryBox, { backgroundColor: c.card, borderColor: c.border }]}>
            <Text style={[styles.summaryNum, { color: c.primary }]}>{openCount}</Text>
            <Text style={[styles.summaryLabel, { color: c.mutedForeground }]}>Open</Text>
          </View>
          <View style={[styles.summaryBox, { backgroundColor: c.card, borderColor: c.border }]}>
            <Text style={[styles.summaryNum, { color: c.foreground }]}>{filteredComplaints.length}</Text>
            <Text style={[styles.summaryLabel, { color: c.mutedForeground }]}>Total</Text>
          </View>
        </View>

        {/* Severity filter */}
        <View style={styles.severityRow}>
          {SEVERITY_FILTERS.map(s => {
            const active = severity === s;
            return (
              <TouchableOpacity
                key={s}
                style={[
                  styles.severityChip,
                  {
                    backgroundColor: active ? c.primary : c.card,
                    borderColor: active ? c.primary : c.border,
                  },
                ]}
                onPress={() => setSeverity(s)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.severityText,
                    { color: active ? c.primaryForeground : c.mutedForeground },
                  ]}
                >
                  {s}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <FlatList
        data={displayed}
        keyExtractor={x => x.complaintID}
        renderItem={renderComplaint}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor={c.primary} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="check-circle" size={36} color={c.border} />
            <Text style={[styles.emptyText, { color: c.mutedForeground }]}>No complaints found</Text>
          </View>
        }
      />
    </View>
  );
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
    borderRadius: 14,
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
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
  },
  sevStripe: {
    width: 4,
  },
  cardBody: {
    flex: 1,
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
  },
  sub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  description: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
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
    marginLeft: 'auto',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});

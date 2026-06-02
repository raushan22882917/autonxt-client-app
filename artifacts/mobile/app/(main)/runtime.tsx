import React, { useMemo } from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { PlantFilter } from '@/components/PlantFilter';
import { RuntimeRecord } from '@/lib/appsync';

export default function RuntimeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { filteredRuntimeRecords, filteredTractors, isLoading, refresh } = useApp();

  const topPad = Platform.OS === 'web' ? 67 : 0;

  const totalHours = useMemo(
    () => filteredRuntimeRecords.reduce((s, r) => s + r.hoursRun, 0),
    [filteredRuntimeRecords]
  );
  const totalFuel = useMemo(
    () => filteredRuntimeRecords.reduce((s, r) => s + (r.fuelConsumed || 0), 0),
    [filteredRuntimeRecords]
  );
  const totalDistance = useMemo(
    () => filteredRuntimeRecords.reduce((s, r) => s + (r.distanceCovered || 0), 0),
    [filteredRuntimeRecords]
  );
  const avgHoursPerTractor = filteredTractors.length
    ? (filteredTractors.reduce((s, t) => s + t.totalRuntime, 0) / filteredTractors.length).toFixed(0)
    : 0;

  // Group by tractor
  const byTractor = useMemo(() => {
    const map: Record<string, { tractorID: string; model: string; plant: string; totalHours: number; records: RuntimeRecord[] }> = {};
    filteredRuntimeRecords.forEach(r => {
      if (!map[r.tractorID]) {
        map[r.tractorID] = {
          tractorID: r.tractorID,
          model: r.tractorModel || r.tractorID,
          plant: r.plantName || '',
          totalHours: 0,
          records: [],
        };
      }
      map[r.tractorID].totalHours += r.hoursRun;
      map[r.tractorID].records.push(r);
    });
    return Object.values(map).sort((a, b) => b.totalHours - a.totalHours);
  }, [filteredRuntimeRecords]);

  const maxHours = byTractor.length > 0 ? byTractor[0].totalHours : 1;

  const renderTractor = ({ item }: { item: typeof byTractor[0] }) => (
    <View style={[styles.card, { backgroundColor: '#111827', borderColor: '#1E293B' }]}>
      <View style={styles.cardHeader}>
        <View style={styles.tractorIconWrap}>
          <Feather name="truck" size={18} color="#F97316" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.tractorModel}>{item.model}</Text>
          <Text style={styles.plantName}>{item.plant}</Text>
        </View>
        <Text style={styles.hoursNum}>{item.totalHours.toFixed(1)}h</Text>
      </View>

      {/* Bar */}
      <View style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            { width: `${Math.min(100, (item.totalHours / maxHours) * 100)}%` as any },
          ]}
        />
      </View>

      {/* Daily breakdown (last 3) */}
      <View style={styles.dayRow}>
        {item.records.slice(0, 3).map((r, i) => (
          <View key={r.recordID} style={styles.dayBox}>
            <Text style={styles.dayLabel}>{shortDate(r.date)}</Text>
            <Text style={styles.dayHours}>{r.hoursRun}h</Text>
            {r.fuelConsumed ? (
              <Text style={styles.dayFuel}>{r.fuelConsumed}L</Text>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: '#0A1628' }]}>
      {/* Summary header */}
      <View style={[styles.summarySection, { paddingTop: topPad + 16 }]}>
        <Text style={styles.sectionTitle}>Cumulative Runtime</Text>

        <View style={styles.kpiRow}>
          <View style={styles.kpi}>
            <Feather name="clock" size={20} color="#F97316" />
            <Text style={styles.kpiNum}>{totalHours.toFixed(0)}h</Text>
            <Text style={styles.kpiLabel}>Total Hours</Text>
          </View>
          <View style={styles.kpiDivider} />
          <View style={styles.kpi}>
            <Feather name="droplet" size={20} color="#3B82F6" />
            <Text style={styles.kpiNum}>{totalFuel.toFixed(0)}L</Text>
            <Text style={styles.kpiLabel}>Fuel Used</Text>
          </View>
          <View style={styles.kpiDivider} />
          <View style={styles.kpi}>
            <Feather name="navigation" size={20} color="#10B981" />
            <Text style={styles.kpiNum}>{totalDistance.toFixed(0)}km</Text>
            <Text style={styles.kpiLabel}>Distance</Text>
          </View>
          <View style={styles.kpiDivider} />
          <View style={styles.kpi}>
            <Feather name="bar-chart-2" size={20} color="#8B5CF6" />
            <Text style={styles.kpiNum}>{avgHoursPerTractor}h</Text>
            <Text style={styles.kpiLabel}>Avg/Tractor</Text>
          </View>
        </View>
      </View>

      <PlantFilter />

      <FlatList
        data={byTractor}
        keyExtractor={i => i.tractorID}
        renderItem={renderTractor}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor="#F97316" />
        }
        ListHeaderComponent={
          <Text style={styles.listHeader}>By Tractor (7-day)</Text>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="clock" size={36} color="#1E293B" />
            <Text style={styles.emptyText}>No runtime data available</Text>
          </View>
        }
      />
    </View>
  );
}

function shortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  summarySection: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#64748B',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  kpiRow: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 16,
    alignItems: 'center',
  },
  kpi: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  kpiNum: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#F8FAFC',
  },
  kpiLabel: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    color: '#64748B',
    textAlign: 'center',
  },
  kpiDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#1E293B',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 10,
  },
  listHeader: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#64748B',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tractorIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F9731618',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: { flex: 1 },
  tractorModel: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#F8FAFC',
  },
  plantName: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: '#64748B',
    marginTop: 1,
  },
  hoursNum: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#F97316',
  },
  barTrack: {
    height: 6,
    backgroundColor: '#1E293B',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: 6,
    backgroundColor: '#F97316',
    borderRadius: 3,
  },
  dayRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dayBox: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    gap: 2,
  },
  dayLabel: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    color: '#64748B',
  },
  dayHours: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#F8FAFC',
  },
  dayFuel: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    color: '#3B82F6',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    color: '#475569',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});

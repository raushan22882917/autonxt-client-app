import React, { useMemo } from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
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
  const c = useColors();
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
    <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border, shadowColor: c.shadow }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.tractorIconWrap, { backgroundColor: c.primary + '14' }]}>
          <Feather name="truck" size={18} color={c.primary} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.tractorModel, { color: c.foreground }]}>{item.model}</Text>
          <Text style={[styles.plantName, { color: c.mutedForeground }]}>{item.plant}</Text>
        </View>
        <Text style={[styles.hoursNum, { color: c.primary }]}>{item.totalHours.toFixed(1)}h</Text>
      </View>

      {/* Bar */}
      <View style={[styles.barTrack, { backgroundColor: c.track }]}>
        <View
          style={[
            styles.barFill,
            { backgroundColor: c.primary, width: `${Math.min(100, (item.totalHours / maxHours) * 100)}%` as any },
          ]}
        />
      </View>

      {/* Daily breakdown (last 3) */}
      <View style={styles.dayRow}>
        {item.records.slice(0, 3).map(r => (
          <View key={r.recordID} style={[styles.dayBox, { backgroundColor: c.surfaceAlt }]}>
            <Text style={[styles.dayLabel, { color: c.mutedForeground }]}>{shortDate(r.date)}</Text>
            <Text style={[styles.dayHours, { color: c.foreground }]}>{r.hoursRun}h</Text>
            {r.fuelConsumed ? (
              <Text style={[styles.dayFuel, { color: c.blue }]}>{r.fuelConsumed}L</Text>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      {/* Summary header */}
      <View style={[styles.summarySection, { paddingTop: topPad + 16 }]}>
        <Text style={[styles.sectionTitle, { color: c.mutedForeground }]}>Cumulative Runtime</Text>

        <View style={[styles.kpiRow, { backgroundColor: c.card, borderColor: c.border, shadowColor: c.shadow }]}>
          <View style={styles.kpi}>
            <Feather name="clock" size={20} color={c.primary} />
            <Text style={[styles.kpiNum, { color: c.foreground }]}>{totalHours.toFixed(0)}h</Text>
            <Text style={[styles.kpiLabel, { color: c.mutedForeground }]}>Total Hours</Text>
          </View>
          <View style={[styles.kpiDivider, { backgroundColor: c.border }]} />
          <View style={styles.kpi}>
            <Feather name="droplet" size={20} color={c.blue} />
            <Text style={[styles.kpiNum, { color: c.foreground }]}>{totalFuel.toFixed(0)}L</Text>
            <Text style={[styles.kpiLabel, { color: c.mutedForeground }]}>Fuel Used</Text>
          </View>
          <View style={[styles.kpiDivider, { backgroundColor: c.border }]} />
          <View style={styles.kpi}>
            <Feather name="navigation" size={20} color={c.success} />
            <Text style={[styles.kpiNum, { color: c.foreground }]}>{totalDistance.toFixed(0)}km</Text>
            <Text style={[styles.kpiLabel, { color: c.mutedForeground }]}>Distance</Text>
          </View>
          <View style={[styles.kpiDivider, { backgroundColor: c.border }]} />
          <View style={styles.kpi}>
            <Feather name="bar-chart-2" size={20} color={c.accent} />
            <Text style={[styles.kpiNum, { color: c.foreground }]}>{avgHoursPerTractor}h</Text>
            <Text style={[styles.kpiLabel, { color: c.mutedForeground }]}>Avg/Tractor</Text>
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
          <RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor={c.primary} />
        }
        ListHeaderComponent={
          <Text style={[styles.listHeader, { color: c.mutedForeground }]}>By Tractor</Text>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="clock" size={36} color={c.border} />
            <Text style={[styles.emptyText, { color: c.mutedForeground }]}>No runtime data available</Text>
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
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  kpiRow: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
  },
  kpi: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  kpiNum: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  kpiLabel: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  kpiDivider: {
    width: 1,
    height: 40,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 10,
  },
  listHeader: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: { flex: 1 },
  tractorModel: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  plantName: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    marginTop: 1,
  },
  hoursNum: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  barTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: 6,
    borderRadius: 3,
  },
  dayRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dayBox: {
    flex: 1,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    gap: 2,
  },
  dayLabel: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
  },
  dayHours: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  dayFuel: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});

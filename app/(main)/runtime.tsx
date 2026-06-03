import React, { useEffect, useMemo, useState } from 'react';
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
import { ManualRuntimeEntryCard } from '@/components/ManualRuntimeEntryCard';
import {
  fetchTractorsAnalytics,
  RuntimeRecord,
  type TractorAnalytics,
} from '@/lib/appsync';
import { manualRuntimeDayHours } from '@/lib/tractorRuntime';

function fmtDuration(seconds: number | null | undefined): string {
  if (seconds == null || Number.isNaN(seconds) || seconds <= 0) return '—';
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function RuntimeScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { filteredRuntimeRecords, filteredTractors, plants, isLoading, refresh } = useApp();
  const [analyticsByTractor, setAnalyticsByTractor] = useState<Map<string, TractorAnalytics | null>>(
    new Map()
  );
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const topPad = Platform.OS === 'web' ? 67 : 0;

  const tractorIds = useMemo(
    () => filteredTractors.map(t => t.tractorID),
    [filteredTractors]
  );

  useEffect(() => {
    if (tractorIds.length === 0) {
      setAnalyticsByTractor(new Map());
      return;
    }
    let cancelled = false;
    setAnalyticsLoading(true);
    fetchTractorsAnalytics(tractorIds)
      .then(map => {
        if (!cancelled) setAnalyticsByTractor(map);
      })
      .catch(() => {
        if (!cancelled) setAnalyticsByTractor(new Map());
      })
      .finally(() => {
        if (!cancelled) setAnalyticsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tractorIds.join('|')]);

  const totalHours = useMemo(
    () => filteredRuntimeRecords.reduce((s, r) => s + manualRuntimeDayHours(r), 0),
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

  const fleetTrips = useMemo(() => {
    let count = 0;
    let duration = 0;
    let distance = 0;
    for (const a of analyticsByTractor.values()) {
      const t = a?.trips;
      count += t?.totalCount ?? 0;
      duration += t?.totalDuration ?? 0;
      distance += t?.totalDistance ?? 0;
    }
    return { count, duration, distance };
  }, [analyticsByTractor]);

  const fleetCharges = useMemo(() => {
    let count = 0;
    let duration = 0;
    let kwh = 0;
    for (const a of analyticsByTractor.values()) {
      const ch = a?.charges;
      count += ch?.totalCount ?? 0;
      duration += ch?.totalDuration ?? 0;
      kwh += ch?.totalKwhCharged ?? 0;
    }
    return { count, duration, kwh };
  }, [analyticsByTractor]);

  const avgHoursPerTractor = filteredTractors.length
    ? (filteredTractors.reduce((s, t) => s + t.totalRuntime, 0) / filteredTractors.length).toFixed(0)
    : 0;

  const byTractor = useMemo(() => {
    const map: Record<
      string,
      {
        tractorID: string;
        model: string;
        plant: string;
        totalHours: number;
        records: RuntimeRecord[];
        tripsCount: number;
        tripsDuration: number;
        chargeCount: number;
        chargeKwh: number;
      }
    > = {};
    filteredRuntimeRecords.forEach(r => {
      if (!map[r.tractorID]) {
        const analytics = analyticsByTractor.get(r.tractorID);
        map[r.tractorID] = {
          tractorID: r.tractorID,
          model: r.tractorModel || r.tractorID,
          plant: r.plantName || '',
          totalHours: 0,
          records: [],
          tripsCount: analytics?.trips?.totalCount ?? 0,
          tripsDuration: analytics?.trips?.totalDuration ?? 0,
          chargeCount: analytics?.charges?.totalCount ?? 0,
          chargeKwh: analytics?.charges?.totalKwhCharged ?? 0,
        };
      }
      map[r.tractorID].totalHours += manualRuntimeDayHours(r);
      map[r.tractorID].records.push(r);
    });
    filteredTractors.forEach(t => {
      if (map[t.tractorID]) return;
      const analytics = analyticsByTractor.get(t.tractorID);
      const trips = analytics?.trips;
      const charges = analytics?.charges;
      if ((trips?.totalCount ?? 0) > 0 || (charges?.totalCount ?? 0) > 0) {
        map[t.tractorID] = {
          tractorID: t.tractorID,
          model: t.model || t.serialNumber,
          plant: t.plantName || '',
          totalHours: 0,
          records: [],
          tripsCount: trips?.totalCount ?? 0,
          tripsDuration: trips?.totalDuration ?? 0,
          chargeCount: charges?.totalCount ?? 0,
          chargeKwh: charges?.totalKwhCharged ?? 0,
        };
      }
    });
    return Object.values(map).sort((a, b) => b.totalHours - a.totalHours);
  }, [filteredRuntimeRecords, filteredTractors, analyticsByTractor]);

  const maxHours = byTractor.length > 0 ? Math.max(...byTractor.map(x => x.totalHours), 1) : 1;

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
        <Text style={[styles.hoursNum, { color: c.primary }]}>
          {item.totalHours > 0 ? `${item.totalHours.toFixed(1)}h` : '—'}
        </Text>
      </View>

      {(item.tripsCount > 0 || item.chargeCount > 0) && (
        <View style={styles.usageRow}>
          {item.tripsCount > 0 ? (
            <View style={[styles.usageChip, { backgroundColor: c.surfaceAlt }]}>
              <Feather name="navigation" size={12} color={c.primary} />
              <Text style={[styles.usageChipText, { color: c.foreground }]}>
                {item.tripsCount} trips · {fmtDuration(item.tripsDuration)}
              </Text>
            </View>
          ) : null}
          {item.chargeCount > 0 ? (
            <View style={[styles.usageChip, { backgroundColor: c.surfaceAlt }]}>
              <Feather name="battery-charging" size={12} color={c.blue} />
              <Text style={[styles.usageChipText, { color: c.foreground }]}>
                {item.chargeCount} charges
                {item.chargeKwh > 0 ? ` · ${Math.round(item.chargeKwh)} kWh` : ''}
              </Text>
            </View>
          ) : null}
        </View>
      )}

      {item.totalHours > 0 && (
        <View style={[styles.barTrack, { backgroundColor: c.track }]}>
          <View
            style={[
              styles.barFill,
              {
                backgroundColor: c.primary,
                width: `${Math.min(100, (item.totalHours / maxHours) * 100)}%` as `${number}%`,
              },
            ]}
          />
        </View>
      )}

      {item.records.length > 0 ? (
        <View style={styles.entriesBlock}>
          <Text style={[styles.entriesTitle, { color: c.mutedForeground }]}>
            Manual runtime entries
          </Text>
          {item.records.slice(0, 5).map(r => (
            <ManualRuntimeEntryCard
              key={r.recordID}
              record={r}
              compact
              plantLabel={r.plantName || plants.find(p => p.plantID === r.plantID)?.name}
            />
          ))}
          {item.records.length > 5 ? (
            <Text style={[styles.moreEntries, { color: c.mutedForeground }]}>
              +{item.records.length - 5} more entries
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <View style={[styles.summarySection, { paddingTop: topPad + 16 }]}>
        <Text style={[styles.sectionTitle, { color: c.mutedForeground }]}>Fleet usage</Text>

        <View style={[styles.kpiRow, { backgroundColor: c.card, borderColor: c.border, shadowColor: c.shadow }]}>
          <View style={styles.kpi}>
            <Feather name="clock" size={20} color={c.primary} />
            <Text style={[styles.kpiNum, { color: c.foreground }]}>{totalHours.toFixed(0)}h</Text>
            <Text style={[styles.kpiLabel, { color: c.mutedForeground }]}>Manual Hours</Text>
          </View>
          <View style={[styles.kpiDivider, { backgroundColor: c.border }]} />
          <View style={styles.kpi}>
            <Feather name="navigation" size={20} color={c.primary} />
            <Text style={[styles.kpiNum, { color: c.foreground }]}>
              {analyticsLoading ? '…' : fleetTrips.count}
            </Text>
            <Text style={[styles.kpiLabel, { color: c.mutedForeground }]}>Trips</Text>
          </View>
          <View style={[styles.kpiDivider, { backgroundColor: c.border }]} />
          <View style={styles.kpi}>
            <Feather name="battery-charging" size={20} color={c.blue} />
            <Text style={[styles.kpiNum, { color: c.foreground }]}>
              {analyticsLoading ? '…' : fleetCharges.count}
            </Text>
            <Text style={[styles.kpiLabel, { color: c.mutedForeground }]}>Charges</Text>
          </View>
          <View style={[styles.kpiDivider, { backgroundColor: c.border }]} />
          <View style={styles.kpi}>
            <Feather name="bar-chart-2" size={20} color={c.accent} />
            <Text style={[styles.kpiNum, { color: c.foreground }]}>{avgHoursPerTractor}h</Text>
            <Text style={[styles.kpiLabel, { color: c.mutedForeground }]}>Avg/Tractor</Text>
          </View>
        </View>

        {!analyticsLoading && (fleetTrips.count > 0 || fleetCharges.count > 0) && (
          <Text style={[styles.fleetUsageSub, { color: c.mutedForeground }]}>
            {fleetTrips.count > 0
              ? `${fleetTrips.count} trips (${fmtDuration(fleetTrips.duration)})`
              : ''}
            {fleetTrips.count > 0 && fleetCharges.count > 0 ? ' · ' : ''}
            {fleetCharges.count > 0
              ? `${fleetCharges.count} charges (${Math.round(fleetCharges.kwh)} kWh)`
              : ''}
          </Text>
        )}
      </View>

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
          <>
            <Text style={[styles.listHeader, { color: c.mutedForeground }]}>
              Manual runtime log
            </Text>
            <Text style={[styles.listSub, { color: c.mutedForeground }]}>
              Each entry shows loggerID, plantID, orgID, date, startCumulativeRuntime, endCumulativeRuntime
            </Text>
          </>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="clock" size={36} color={c.border} />
            <Text style={[styles.emptyText, { color: c.mutedForeground }]}>
              {analyticsLoading
                ? 'Loading trip, charge, and runtime data…'
                : 'No runtime or usage data for the selected plant'}
            </Text>
          </View>
        }
      />
    </View>
  );
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
  fleetUsageSub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 10,
    lineHeight: 17,
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
    marginBottom: 4,
  },
  listSub: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    lineHeight: 16,
    marginBottom: 10,
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
  usageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  usageChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  usageChipText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
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
  entriesBlock: {
    gap: 8,
  },
  entriesTitle: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  moreEntries: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginTop: 2,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});

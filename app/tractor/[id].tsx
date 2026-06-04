import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { TractorCard } from '@/components/TractorCard';
import { TractorDetailMonthFilter } from '@/components/TractorDetailMonthFilter';
import { UsageSegmentDetailSheet } from '@/components/UsageSegmentDetailSheet';
import { DataTable, KeyValueTable } from '@/components/DataTable';
import {
  monthLabel,
  filterCharges,
  filterSegmentsForMonth,
  filterTrips,
  isDateKeyInMonth,
  mergeAnalyticsBucket,
  monthIsoRange,
  monthTimeSegment,
  startOfMonth,
  summarizeSegments,
} from '@/lib/periodFilter';
import {
  fetchTractorById,
  fetchTractorManualRuntimeRaw,
  fetchTractorTripsChargeData,
  type RawManualRuntimeEntry,
  type Tractor,
  type TractorAnalytics,
  type UsageSegment,
} from '@/lib/appsync';
import {
  chargeDayColumns,
  chargeSummaryRows,
  complaintColumns,
  dailyGroupKey,
  faultColumns,
  groupSegmentsByDay,
  manualRuntimeRowKey,
  runtimeColumns,
  tripDayColumns,
  tripSummaryRows,
} from '@/lib/tractorDetailTables';
import type { DailySegmentGroup } from '@/lib/usageSegmentDetail';
import { flattenFaultMetrics } from '@/lib/tractorMetrics';

type TabKey = 'trips' | 'charge' | 'runtime' | 'breakdown';

const TABS: { key: TabKey; label: string; icon: keyof typeof Feather.glyphMap }[] = [
  { key: 'runtime', label: 'Runtime', icon: 'clock' },
  { key: 'trips', label: 'Trips', icon: 'navigation' },
  { key: 'charge', label: 'Charge', icon: 'battery-charging' },
  { key: 'breakdown', label: 'Faults', icon: 'alert-triangle' },
];

export default function TractorDetailScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tractors, complaints, plants } = useApp();
  const [tab, setTab] = useState<TabKey>('runtime');
  const [tractor, setTractor] = useState<Tractor | undefined>();
  const [analytics, setAnalytics] = useState<TractorAnalytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [usageSegments, setUsageSegments] = useState<UsageSegment[]>([]);
  const [tripSegments, setTripSegments] = useState<UsageSegment[]>([]);
  const [chargeSegments, setChargeSegments] = useState<UsageSegment[]>([]);
  const [segmentsLoading, setSegmentsLoading] = useState(true);
  const [segmentsError, setSegmentsError] = useState<string | null>(null);
  const [manualRuntime, setManualRuntime] = useState<RawManualRuntimeEntry[]>([]);
  const [manualRuntimeLoading, setManualRuntimeLoading] = useState(false);
  const [filterMonth, setFilterMonth] = useState(() => startOfMonth(new Date()));
  const [tripsDeviceKey, setTripsDeviceKey] = useState<string | null>(null);
  const [segmentSheet, setSegmentSheet] = useState<{
    group: DailySegmentGroup;
    kind: 'trip' | 'charge';
  } | null>(null);

  useEffect(() => {
    if (!id) return;
    const cached = tractors.find(t => t.tractorID === id);
    if (cached) setTractor(cached);

    let cancelled = false;
    fetchTractorById(id, plants)
      .then(data => {
        if (!cancelled && data) setTractor(data);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [id, tractors, plants]);

  useEffect(() => {
    if (!tractor) return;
    let cancelled = false;
    setAnalyticsLoading(true);
    setSegmentsLoading(true);
    setAnalyticsError(null);
    setSegmentsError(null);

    const { startTime, endTime } = monthIsoRange(filterMonth);
    const timeSegment = monthTimeSegment(filterMonth);

    fetchTractorTripsChargeData(tractor, { startTime, endTime, timeSegment })
      .then(({ analytics: analyticsRes, usageSegments: all, tripSegments: trips, chargeSegments: charges, deviceKey }) => {
        if (cancelled) return;
        setAnalytics(analyticsRes);
        setTripsDeviceKey(deviceKey);
        setUsageSegments(filterSegmentsForMonth(all, filterMonth));
        setTripSegments(filterSegmentsForMonth(trips, filterMonth));
        setChargeSegments(filterSegmentsForMonth(charges, filterMonth));
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : 'Failed to load trips and charge data';
        setAnalyticsError(msg);
        setSegmentsError(msg);
        setUsageSegments([]);
        setTripSegments([]);
        setChargeSegments([]);
        setTripsDeviceKey(null);
      })
      .finally(() => {
        if (!cancelled) {
          setAnalyticsLoading(false);
          setSegmentsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [tractor?.tractorID, tractor?.loggerID, filterMonth]);

  useEffect(() => {
    if (!tractor?.loggerID) {
      setManualRuntime([]);
      return;
    }
    let cancelled = false;
    setManualRuntimeLoading(true);
    fetchTractorManualRuntimeRaw(tractor)
      .then(rows => {
        if (!cancelled) {
          setManualRuntime(rows.filter(r => isDateKeyInMonth(r.date, filterMonth)));
        }
      })
      .catch(() => {
        if (!cancelled) setManualRuntime([]);
      })
      .finally(() => {
        if (!cancelled) setManualRuntimeLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tractor?.loggerID, filterMonth]);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(main)/tractors');
  };

  const Header = (
    <View style={{ backgroundColor: c.card, borderBottomWidth: 1, borderBottomColor: c.border }}>
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: c.surfaceAlt }]}
          onPress={goBack}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={20} color={c.foreground} />
        </TouchableOpacity>
        <Text style={[styles.topTitle, { color: c.foreground }]}>Tractor Details</Text>
        <View style={{ width: 40 }} />
      </View>
      <TractorDetailMonthFilter month={filterMonth} onMonthChange={setFilterMonth} />
    </View>
  );

  if (!tractor) {
    return (
      <View style={[styles.root, { backgroundColor: c.background }]}>
        {Header}
        <View style={styles.empty}>
          <View style={[styles.emptyIconWrap, { backgroundColor: c.surfaceAlt }]}>
            <Feather name="search" size={32} color={c.mutedForeground} />
          </View>
          <Text style={[styles.emptyTitle, { color: c.foreground }]}>Tractor Not Found</Text>
          <Text style={[styles.emptyText, { color: c.mutedForeground }]}>
            Could not locate tractor data
          </Text>
        </View>
      </View>
    );
  }

  const tractorRuntime = manualRuntime;
  const tractorBreakdowns = complaints
    .filter(
      x => x.tractorID === tractor.tractorID && isDateKeyInMonth(x.createdAt, filterMonth)
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const displayTractor = tractors.find(t => t.tractorID === tractor.tractorID) ?? tractor;
  const faults = flattenFaultMetrics(analytics?.faultMetrics);
  const totalTodaysRuntime = tractorRuntime.reduce(
    (sum, r) => sum + (typeof r.todaysRuntime === 'number' ? r.todaysRuntime : 0),
    0
  );

  const tripsList = tripSegments.length > 0 ? tripSegments : filterTrips(usageSegments);
  const chargesList = chargeSegments.length > 0 ? chargeSegments : filterCharges(usageSegments);

  const tripDays = groupSegmentsByDay(tripsList.filter((s): s is UsageSegment => s != null));
  const chargeDays = groupSegmentsByDay(chargesList.filter((s): s is UsageSegment => s != null));

  const tripSummary = mergeAnalyticsBucket(analytics?.trips, summarizeSegments(tripsList));
  const chargeSummary = mergeAnalyticsBucket(analytics?.charges, summarizeSegments(chargesList));
  const monthSubtitle = tripsDeviceKey
    ? `${monthLabel(filterMonth)} · logger ${tripsDeviceKey}`
    : monthLabel(filterMonth);

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      {Header}
      <UsageSegmentDetailSheet
        visible={segmentSheet != null}
        group={segmentSheet?.group ?? null}
        kind={segmentSheet?.kind ?? 'trip'}
        onClose={() => setSegmentSheet(null)}
      />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Tractor card */}
        <TractorCard tractor={displayTractor} hideActions />

        {/* Tab bar */}
        <View style={[styles.tabBar, { backgroundColor: c.card, borderColor: c.border }]}>
          {TABS.map(t => {
            const active = tab === t.key;
            return (
              <TouchableOpacity
                key={t.key}
                style={[
                  styles.tab,
                  active
                    ? { backgroundColor: c.primary }
                    : { backgroundColor: 'transparent' },
                ]}
                onPress={() => setTab(t.key)}
                activeOpacity={0.8}
              >
                <Feather
                  name={t.icon}
                  size={14}
                  color={active ? c.primaryForeground : c.mutedForeground}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    { color: active ? c.primaryForeground : c.mutedForeground },
                  ]}
                >
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Runtime tab */}
        {tab === 'runtime' && (
          <View style={styles.tabContent}>
            <SummaryStrip
              items={[
                { label: 'Total runtime', value: `${tractor.totalRuntime}h` },
                { label: 'Log entries', value: String(tractorRuntime.length) },
                { label: 'Sum today\'s', value: String(totalTodaysRuntime) },
              ]}
              c={c}
            />
            <DataTable
              title="Manual runtime log"
              columns={runtimeColumns}
              data={tractorRuntime}
              keyExtractor={manualRuntimeRowKey}
              emptyMessage={
                tractor.loggerID
                  ? 'No manual runtime entries for this tractor'
                  : 'Logger ID required for manual runtime'
              }
              loading={manualRuntimeLoading}
              compact
              fitWidth
            />
          </View>
        )}

        {/* Trips tab */}
        {tab === 'trips' && (
          <View style={styles.tabContent}>
            {analyticsError ? (
              <TabError message={analyticsError} c={c} />
            ) : (
              <KeyValueTable
                title="Trip summary"
                subtitle={monthSubtitle}
                rows={tripSummaryRows(tripSummary)}
                loading={analyticsLoading}
                compact
              />
            )}
            {segmentsError ? (
              <TabError message={segmentsError} c={c} />
            ) : (
              <DataTable
                title="Trips by day"
                subtitle={`${monthSubtitle} · ${tripsList.length} trip${tripsList.length === 1 ? '' : 's'} · tap row`}
                columns={tripDayColumns}
                data={tripDays}
                keyExtractor={dailyGroupKey}
                emptyMessage={
                  tractor.loggerID
                    ? `No trips in ${monthLabel(filterMonth)}`
                    : 'No logger ID — assign a logger to load trip data'
                }
                loading={segmentsLoading}
                compact
                fitWidth
                onRowPress={group => setSegmentSheet({ group, kind: 'trip' })}
                showRowChevron
              />
            )}
          </View>
        )}

        {/* Charge tab */}
        {tab === 'charge' && (
          <View style={styles.tabContent}>
            {analyticsError ? (
              <TabError message={analyticsError} c={c} />
            ) : (
              <KeyValueTable
                title="Charge summary"
                subtitle={monthSubtitle}
                rows={chargeSummaryRows(chargeSummary)}
                loading={analyticsLoading}
                compact
              />
            )}
            {segmentsError ? (
              <TabError message={segmentsError} c={c} />
            ) : (
              <DataTable
                title="Charge by day"
                subtitle={`${monthSubtitle} · ${chargesList.length} session${chargesList.length === 1 ? '' : 's'} · tap row`}
                columns={chargeDayColumns}
                data={chargeDays}
                keyExtractor={dailyGroupKey}
                emptyMessage={
                  tractor.loggerID
                    ? `No charge sessions in ${monthLabel(filterMonth)}`
                    : 'No logger ID — assign a logger to load charge data'
                }
                loading={segmentsLoading}
                compact
                fitWidth
                onRowPress={group => setSegmentSheet({ group, kind: 'charge' })}
                showRowChevron
              />
            )}
          </View>
        )}

        {/* Breakdown tab */}
        {tab === 'breakdown' && (
          <View style={styles.tabContent}>
            <DataTable
              title="Controller faults"
              subtitle="From analytics fault metrics"
              columns={faultColumns}
              data={faults}
              keyExtractor={(f, i) => `${f.startTime ?? 'f'}-${i}`}
              emptyMessage="No controller faults recorded"
              loading={analyticsLoading}
            />
            <DataTable
              title="Complaints & breakdowns"
              subtitle="Tap a row to open ticket details"
              columns={complaintColumns()}
              data={tractorBreakdowns}
              keyExtractor={b => b.complaintID}
              emptyMessage="No complaints for this tractor"
              onRowPress={b => router.push(`/complaint/${encodeURIComponent(b.complaintID)}`)}
              showRowChevron
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function SummaryStrip({
  items,
  c,
}: {
  items: { label: string; value: string }[];
  c: ReturnType<typeof useColors>;
}) {
  return (
    <View style={[styles.summaryCard, { backgroundColor: c.card, borderColor: c.border }]}>
      {items.map((item, i) => (
        <React.Fragment key={item.label}>
          {i > 0 ? <View style={[styles.summaryDivider, { backgroundColor: c.hairline }]} /> : null}
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: c.foreground }]}>{item.value}</Text>
            <Text style={[styles.summaryLabel, { color: c.mutedForeground }]}>{item.label}</Text>
          </View>
        </React.Fragment>
      ))}
    </View>
  );
}

function TabError({ message, c }: { message: string; c: ReturnType<typeof useColors> }) {
  return (
    <View style={[styles.errorBanner, { backgroundColor: c.redSoft, borderColor: c.redBorder }]}>
      <View style={[styles.errorIcon, { backgroundColor: c.red + '18' }]}>
        <Feather name="alert-circle" size={18} color={c.red} />
      </View>
      <Text style={[styles.errorBannerText, { color: c.foreground }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.2,
  },
  content: {
    padding: 14,
    gap: 12,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    padding: 5,
    gap: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 9,
    borderRadius: 12,
  },
  tabLabel: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.1,
  },
  tabContent: {
    gap: 10,
  },
  summaryCard: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  summaryDivider: {
    width: 1,
    height: 30,
  },
  summaryValue: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.3,
  },
  summaryLabel: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  errorIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 19,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    padding: 24,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
});

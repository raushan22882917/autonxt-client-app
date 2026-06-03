import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
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
import { StatusBadge } from '@/components/StatusBadge';
import { severityColor, formatDate, formatDateTime } from '@/lib/complaint';
import {
  fetchTractorAnalytics,
  type AnalyticsBucket,
  type TractorAnalytics,
} from '@/lib/appsync';

function fmtNum(v: number | null | undefined, digits = 0): string {
  if (v === null || v === undefined || Number.isNaN(v)) return '—';
  return (Math.round(v * 10 ** digits) / 10 ** digits).toLocaleString();
}

// Formats a value with a unit, preserving a legitimate 0 (only null/undefined → "—").
function fmtUnit(v: number | null | undefined, unit: string, digits = 1): string {
  if (v === null || v === undefined || Number.isNaN(v)) return '—';
  return `${fmtNum(v, digits)} ${unit}`;
}

// Durations from the analytics API are reported in seconds.
function fmtDuration(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined || Number.isNaN(seconds) || seconds <= 0) return '—';
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

const tractorImg = require('../../assets/images/tractor.png');

type TabKey = 'trips' | 'charge' | 'runtime' | 'breakdown';

const TABS: { key: TabKey; label: string; icon: keyof typeof Feather.glyphMap }[] = [
  { key: 'trips', label: 'Trips', icon: 'navigation' },
  { key: 'charge', label: 'Charge', icon: 'battery-charging' },
  { key: 'runtime', label: 'Runtime', icon: 'clock' },
  { key: 'breakdown', label: 'Breakdown', icon: 'alert-triangle' },
];

export default function TractorDetailScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tractors, complaints, runtimeRecords } = useApp();
  const [tab, setTab] = useState<TabKey>('runtime');
  const [analytics, setAnalytics] = useState<TractorAnalytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setAnalyticsLoading(true);
    setAnalyticsError(null);
    fetchTractorAnalytics(id)
      .then(res => {
        if (!cancelled) setAnalytics(res);
      })
      .catch((err: unknown) => {
        if (!cancelled) setAnalyticsError(err instanceof Error ? err.message : 'Failed to load usage data');
      })
      .finally(() => {
        if (!cancelled) setAnalyticsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const tractor = tractors.find(t => t.tractorID === id);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(main)/tractors');
  };

  const Header = (
    <View style={[styles.topBar, { paddingTop: insets.top + 8, backgroundColor: c.card, borderColor: c.border }]}>
      <TouchableOpacity style={[styles.backBtn, { backgroundColor: c.surfaceAlt }]} onPress={goBack} activeOpacity={0.7}>
        <Feather name="chevron-left" size={22} color={c.foreground} />
      </TouchableOpacity>
      <Text style={[styles.topTitle, { color: c.foreground }]}>Tractor Details</Text>
      <View style={{ width: 38 }} />
    </View>
  );

  if (!tractor) {
    return (
      <View style={[styles.root, { backgroundColor: c.background }]}>
        {Header}
        <View style={styles.empty}>
          <Feather name="search" size={40} color={c.border} />
          <Text style={[styles.emptyText, { color: c.mutedForeground }]}>Tractor not found</Text>
        </View>
      </View>
    );
  }

  const tractorRuntime = runtimeRecords
    .filter(r => r.tractorID === tractor.tractorID)
    .sort((a, b) => b.date.localeCompare(a.date));
  const tractorBreakdowns = complaints
    .filter(x => x.tractorID === tractor.tractorID)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const telemetry: { icon: keyof typeof Feather.glyphMap; label: string; value: string }[] = [
    { icon: 'battery-charging', label: 'Battery', value: tractor.soc === undefined ? '—' : `${Math.round(tractor.soc)}%` },
    { icon: 'thermometer', label: 'Temp', value: tractor.temp === undefined ? '—' : `${tractor.temp.toFixed(1)}°C` },
    { icon: 'rotate-cw', label: 'RPM', value: tractor.rpm === undefined ? '—' : String(Math.round(tractor.rpm)) },
    { icon: 'zap', label: 'Voltage', value: tractor.voltage === undefined ? '—' : `${tractor.voltage.toFixed(1)}V` },
    { icon: 'activity', label: 'Current', value: tractor.current === undefined ? '—' : `${tractor.current.toFixed(1)}A` },
  ];

  const totalHours = tractorRuntime.reduce((sum, r) => sum + (r.hoursRun || 0), 0);

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      {Header}
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: c.card, borderColor: c.border, shadowColor: c.shadow }]}>
          <View style={styles.heroTop}>
            <View style={[styles.imageWrap, { backgroundColor: c.surfaceAlt }]}>
              <Image source={tractorImg} style={styles.image} resizeMode="contain" />
            </View>
            <View style={styles.heroInfo}>
              <Text style={[styles.heroModel, { color: c.foreground }]} numberOfLines={1}>
                {tractor.model}
              </Text>
              <View style={styles.metaRow}>
                <Feather name="hash" size={12} color={c.mutedForeground} />
                <Text style={[styles.metaText, { color: c.mutedForeground }]} numberOfLines={1}>
                  {tractor.serialNumber}
                </Text>
              </View>
              {tractor.plantName ? (
                <View style={styles.metaRow}>
                  <Feather name="map-pin" size={12} color={c.mutedForeground} />
                  <Text style={[styles.metaText, { color: c.mutedForeground }]} numberOfLines={1}>
                    {tractor.plantName}
                  </Text>
                </View>
              ) : null}
              <View style={{ marginTop: 6 }}>
                <StatusBadge status={tractor.status} small />
              </View>
            </View>
          </View>

          {/* Live telemetry */}
          <View style={styles.telemetryGrid}>
            {telemetry.map(t => (
              <View key={t.label} style={[styles.telemetryChip, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
                <Feather name={t.icon} size={15} color={c.primary} />
                <Text style={[styles.telemetryValue, { color: c.foreground }]}>{t.value}</Text>
                <Text style={[styles.telemetryLabel, { color: c.mutedForeground }]}>{t.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tabs */}
        <View style={[styles.tabBar, { backgroundColor: c.card, borderColor: c.border }]}>
          {TABS.map(t => {
            const active = tab === t.key;
            return (
              <TouchableOpacity
                key={t.key}
                style={[styles.tab, active && { backgroundColor: c.primary }]}
                onPress={() => setTab(t.key)}
                activeOpacity={0.8}
              >
                <Feather name={t.icon} size={14} color={active ? c.primaryForeground : c.mutedForeground} />
                <Text style={[styles.tabLabel, { color: active ? c.primaryForeground : c.mutedForeground }]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Tab content */}
        {tab === 'runtime' && (
          <View style={styles.tabContent}>
            {tractorRuntime.length > 0 && (
              <View style={[styles.summaryCard, { backgroundColor: c.card, borderColor: c.border }]}>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryValue, { color: c.foreground }]}>{tractor.totalRuntime}h</Text>
                  <Text style={[styles.summaryLabel, { color: c.mutedForeground }]}>Total Runtime</Text>
                </View>
                <View style={[styles.summaryDivider, { backgroundColor: c.hairline }]} />
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryValue, { color: c.foreground }]}>{tractorRuntime.length}</Text>
                  <Text style={[styles.summaryLabel, { color: c.mutedForeground }]}>Records</Text>
                </View>
                <View style={[styles.summaryDivider, { backgroundColor: c.hairline }]} />
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryValue, { color: c.foreground }]}>
                    {(Math.round(totalHours * 10) / 10).toString()}h
                  </Text>
                  <Text style={[styles.summaryLabel, { color: c.mutedForeground }]}>Logged Hours</Text>
                </View>
              </View>
            )}
            {tractorRuntime.length === 0 ? (
              <EmptyState icon="clock" title="No runtime records" sub="No runtime entries have been logged for this tractor yet." c={c} />
            ) : (
              tractorRuntime.map(r => (
                <View key={r.recordID} style={[styles.row, { backgroundColor: c.card, borderColor: c.border }]}>
                  <View style={[styles.rowIcon, { backgroundColor: c.primary + '14' }]}>
                    <Feather name="clock" size={16} color={c.primary} />
                  </View>
                  <View style={styles.rowMain}>
                    <Text style={[styles.rowTitle, { color: c.foreground }]}>{formatDate(r.date)}</Text>
                    {r.plantName ? (
                      <Text style={[styles.rowSub, { color: c.mutedForeground }]} numberOfLines={1}>{r.plantName}</Text>
                    ) : null}
                  </View>
                  <Text style={[styles.rowValue, { color: c.primary }]}>{r.hoursRun}h</Text>
                </View>
              ))
            )}
          </View>
        )}

        {tab === 'breakdown' && (
          <View style={styles.tabContent}>
            {tractorBreakdowns.length === 0 ? (
              <EmptyState icon="check-circle" title="No breakdowns" sub="This tractor has no recorded breakdown or complaint history." c={c} />
            ) : (
              tractorBreakdowns.map(b => {
                const sev = severityColor(b.severity, c);
                return (
                  <TouchableOpacity
                    key={b.complaintID}
                    style={[styles.row, { backgroundColor: c.card, borderColor: c.border }]}
                    onPress={() => router.push(`/complaint/${encodeURIComponent(b.complaintID)}`)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.rowIcon, { backgroundColor: sev + '18' }]}>
                      <Feather name="alert-triangle" size={16} color={sev} />
                    </View>
                    <View style={styles.rowMain}>
                      <Text style={[styles.rowTitle, { color: c.foreground }]} numberOfLines={1}>{b.title}</Text>
                      <Text style={[styles.rowSub, { color: c.mutedForeground }]} numberOfLines={1}>
                        {formatDateTime(b.createdAt)}
                      </Text>
                      <View style={styles.badgeRow}>
                        <StatusBadge status={b.severity} small />
                        <StatusBadge status={b.status} small />
                      </View>
                    </View>
                    <Feather name="chevron-right" size={18} color={c.mutedForeground} />
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        )}

        {tab === 'trips' && (
          <View style={styles.tabContent}>
            <AnalyticsTab
              loading={analyticsLoading}
              error={analyticsError}
              bucket={analytics?.trips}
              kind="trips"
              c={c}
            />
          </View>
        )}

        {tab === 'charge' && (
          <View style={styles.tabContent}>
            <AnalyticsTab
              loading={analyticsLoading}
              error={analyticsError}
              bucket={analytics?.charges}
              kind="charge"
              c={c}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function AnalyticsTab({
  loading,
  error,
  bucket,
  kind,
  c,
}: {
  loading: boolean;
  error: string | null;
  bucket: AnalyticsBucket | null | undefined;
  kind: 'trips' | 'charge';
  c: ReturnType<typeof useColors>;
}) {
  if (loading) {
    return (
      <View style={[styles.emptyBlock, { backgroundColor: c.card, borderColor: c.border }]}>
        <ActivityIndicator color={c.primary} />
        <Text style={[styles.emptyBlockSub, { color: c.mutedForeground, marginTop: 8 }]}>
          Loading usage data…
        </Text>
      </View>
    );
  }
  if (error) {
    return (
      <EmptyState
        icon="alert-circle"
        title="Couldn't load usage data"
        sub={error}
        c={c}
      />
    );
  }
  const hasData = !!bucket && (bucket.totalCount ?? 0) > 0;
  if (!hasData) {
    return kind === 'trips' ? (
      <EmptyState icon="navigation" title="No trips recorded" sub="This tractor has no trip activity for the selected period." c={c} />
    ) : (
      <EmptyState icon="battery-charging" title="No charging sessions" sub="This tractor has no charging activity for the selected period." c={c} />
    );
  }

  const metrics: { icon: keyof typeof Feather.glyphMap; label: string; value: string }[] =
    kind === 'trips'
      ? [
          { icon: 'navigation', label: 'Trips', value: fmtNum(bucket!.totalCount) },
          { icon: 'clock', label: 'Run Time', value: fmtDuration(bucket!.totalDuration) },
          { icon: 'map', label: 'Distance', value: fmtUnit(bucket!.totalDistance, 'km') },
          { icon: 'zap', label: 'Energy Used', value: fmtUnit(bucket!.totalKwhDelivered, 'kWh') },
          {
            icon: 'dollar-sign',
            label: 'Cost Savings',
            value:
              bucket!.totalCostSavings === null || bucket!.totalCostSavings === undefined
                ? '—'
                : `₹${fmtNum(bucket!.totalCostSavings)}`,
          },
          { icon: 'feather', label: 'Trees Saved', value: fmtNum(bucket!.totalTreesSaved, 1) },
        ]
      : [
          { icon: 'battery-charging', label: 'Sessions', value: fmtNum(bucket!.totalCount) },
          { icon: 'clock', label: 'Charge Time', value: fmtDuration(bucket!.totalDuration) },
          { icon: 'zap', label: 'Energy Added', value: fmtUnit(bucket!.totalKwhCharged, 'kWh') },
          { icon: 'alert-triangle', label: 'Disconnects', value: fmtNum(bucket!.totalDisconnectCount) },
        ];

  return (
    <View style={styles.metricsGrid}>
      {metrics.map(m => (
        <View key={m.label} style={[styles.metricCard, { backgroundColor: c.card, borderColor: c.border }]}>
          <View style={[styles.metricIcon, { backgroundColor: c.primary + '14' }]}>
            <Feather name={m.icon} size={16} color={c.primary} />
          </View>
          <Text style={[styles.metricValue, { color: c.foreground }]}>{m.value}</Text>
          <Text style={[styles.metricLabel, { color: c.mutedForeground }]}>{m.label}</Text>
        </View>
      ))}
    </View>
  );
}

function EmptyState({
  icon,
  title,
  sub,
  c,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  sub: string;
  c: ReturnType<typeof useColors>;
}) {
  return (
    <View style={[styles.emptyBlock, { backgroundColor: c.card, borderColor: c.border }]}>
      <View style={[styles.emptyIcon, { backgroundColor: c.surfaceAlt }]}>
        <Feather name={icon} size={26} color={c.mutedForeground} />
      </View>
      <Text style={[styles.emptyBlockTitle, { color: c.foreground }]}>{title}</Text>
      <Text style={[styles.emptyBlockSub, { color: c.mutedForeground }]}>{sub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  hero: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 14,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  heroTop: {
    flexDirection: 'row',
    gap: 14,
  },
  imageWrap: {
    width: 110,
    height: 90,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: { width: 104, height: 84 },
  heroInfo: { flex: 1, gap: 3 },
  heroModel: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    flexShrink: 1,
  },
  telemetryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  telemetryChip: {
    flexBasis: '18%',
    flexGrow: 1,
    minWidth: 60,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 11,
    alignItems: 'center',
    gap: 3,
  },
  telemetryValue: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
  },
  telemetryLabel: {
    fontSize: 9,
    fontFamily: 'Inter_500Medium',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 9,
    borderRadius: 10,
  },
  tabLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  tabContent: {
    gap: 10,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricCard: {
    flexBasis: '47%',
    flexGrow: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.3,
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  summaryCard: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  summaryDivider: {
    width: 1,
    height: 32,
  },
  summaryValue: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.3,
  },
  summaryLabel: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowMain: { flex: 1, gap: 3 },
  rowTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  rowSub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  rowValue: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  emptyBlock: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 10,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBlockTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  emptyBlockSub: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 19,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});

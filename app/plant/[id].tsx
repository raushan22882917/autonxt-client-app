import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { DataTable } from '@/components/DataTable';
import { PlantDetailFilterSheet } from '@/components/PlantDetailFilterSheet';
import { isActiveComplaint } from '@/lib/complaintFilters';
import { isBreakdownComplaint } from '@/lib/isBreakdownComplaint';
import {
  buildPlantRuntimeLogRows,
  plantComplaintTableColumns,
  plantRuntimeLogColumns,

  plantTractorColumns,
} from '@/lib/plantDetailTables';
import { complaintPeriodLabel, type ComplaintPeriod } from '@/lib/complaintFilters';
import {
  applyPeriodToTractorMetrics,
  countActivePlantDetailFilters,
  DEFAULT_PLANT_DETAIL_FILTERS,
  filterComplaintsByPeriod,
  filterPlantComplaints,
  filterRuntimeLogs,

  filterTractorMetrics,
  plantDetailFilterSummary,
  type PlantDetailFilterValues,
} from '@/lib/plantDetailFilters';
import {
  buildPlantSummary,
  formatPct,
  getPlantFleet,
  PLANT_CARD_THEMES,
} from '@/lib/plantAnalysis';

type TabKey = 'tractors' | 'breakdown' | 'tickets' | 'runtime';

const TABS: { key: TabKey; label: string; icon: keyof typeof Feather.glyphMap }[] = [
  { key: 'tractors', label: 'Tractors', icon: 'truck' },
  { key: 'breakdown', label: 'Breakdown', icon: 'alert-triangle' },
  { key: 'tickets', label: 'Tickets', icon: 'inbox' },
  { key: 'runtime', label: 'Runtime', icon: 'clock' },
];

const cleanLocation = (loc?: string) => {
  if (!loc) return '';
  return loc
    .replace(/\s*\(\s*(?:Lat:\s*)?-?\d+(?:\.\d+)?\s*,\s*(?:Lon:\s*)?-?\d+(?:\.\d+)?\s*\)/gi, '')
    .replace(/\s*(?:Lat:\s*)?-?\d+(?:\.\d+)?\s*,\s*(?:Lon:\s*)?-?\d+(?:\.\d+)?/gi, '')
    .trim();
};

export default function PlantDetailScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const plantID = id ? decodeURIComponent(id) : '';
  const { plants, tractors, complaints, runtimeRecords, refresh } = useApp();
  const [tab, setTab] = useState<TabKey>('tractors');
  const [filters, setFilters] = useState<PlantDetailFilterValues>(DEFAULT_PLANT_DETAIL_FILTERS);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [breakdownStatusFilter, setBreakdownStatusFilter] = useState<'ALL' | 'IN_PROGRESS' | 'CLOSED' | 'RESOLVED'>('ALL');
  const [breakdownStatusOpen, setBreakdownStatusOpen] = useState(false);
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState<{ action: () => void } | null>(null);
  const [showAllRuntime, setShowAllRuntime] = useState(false);

  useEffect(() => {
    if (pendingUpdate) {
      const timer = setTimeout(() => {
        pendingUpdate.action();
        setPendingUpdate(null);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [pendingUpdate]);

  useEffect(() => {
    if (isTabLoading && !pendingUpdate) {
      setIsTabLoading(false);
    }
  }, [isTabLoading, pendingUpdate]);

  const topPad = Platform.OS === 'web' ? 67 : 0;

  const appliedFilters = useMemo(() => ({ ...filters, search }), [filters, search]);
  const activeFilterCount = countActivePlantDetailFilters(appliedFilters);

  const plant = plants.find(p => p.plantID === plantID);
  const colorIndex = Math.max(0, plants.findIndex(p => p.plantID === plantID));
  const theme = PLANT_CARD_THEMES[colorIndex % PLANT_CARD_THEMES.length];

  const summary = useMemo(() => {
    if (!plant) return null;
    return buildPlantSummary(plant, tractors, complaints, runtimeRecords, colorIndex);
  }, [plant, tractors, complaints, runtimeRecords, colorIndex]);

  const fleet = useMemo(
    () => getPlantFleet(plantID, tractors, complaints, runtimeRecords),
    [plantID, tractors, complaints, runtimeRecords]
  );

  const tractorOptions = useMemo(
    () =>
      fleet.tractorMetrics.map(m => ({
        id: m.tractor.tractorID,
        label: m.tractor.displayName || m.tractor.model || m.tractor.tractorID,
      })),
    [fleet.tractorMetrics]
  );

  const tractorLabel = useMemo(() => {
    const map = new Map<string, string>();
    tractorOptions.forEach(t => map.set(t.id, t.label));
    return (tractorID: string, fallback?: string) => map.get(tractorID) || fallback || tractorID;
  }, [tractorOptions]);

  const { period, customMonth } = filters;

  const breakdownSource = useMemo(
    () => fleet.plantComplaints.filter(isBreakdownComplaint),
    [fleet.plantComplaints]
  );
  const openTicketsSource = useMemo(
    () => fleet.plantComplaints.filter(isActiveComplaint),
    [fleet.plantComplaints]
  );
  const breakdownInPeriod = useMemo(
    () => filterComplaintsByPeriod(breakdownSource, period, customMonth),
    [breakdownSource, period, customMonth]
  );
  const openTicketsInPeriod = useMemo(
    () => filterComplaintsByPeriod(openTicketsSource, period, customMonth),
    [openTicketsSource, period, customMonth]
  );
  const periodScopedMetrics = useMemo(
    () =>
      applyPeriodToTractorMetrics(
        fleet.tractorMetrics,
        fleet.plantComplaints,
        fleet.plantRuntime,
        period,
        customMonth
      ),
    [fleet.tractorMetrics, fleet.plantComplaints, fleet.plantRuntime, period, customMonth]
  );
  const metricsBase = period === 'ALL' ? fleet.tractorMetrics : periodScopedMetrics;
  const filteredTractors = useMemo(
    () => filterTractorMetrics(metricsBase, appliedFilters),
    [metricsBase, appliedFilters]
  );
  const filteredBreakdownBase = useMemo(
    () => filterPlantComplaints(breakdownSource, { ...appliedFilters, period: 'ALL' }),
    [breakdownSource, appliedFilters]
  );
  const filteredBreakdown = useMemo(
    () => breakdownStatusFilter === 'ALL'
      ? filteredBreakdownBase
      : filteredBreakdownBase.filter(r => r.status === breakdownStatusFilter),
    [filteredBreakdownBase, breakdownStatusFilter]
  );
  const filteredTickets = useMemo(
    () => filterPlantComplaints(openTicketsSource, { ...appliedFilters, period: 'ALL' }),
    [openTicketsSource, appliedFilters]
  );
  const runtimeLogRowsAll = useMemo(
    () => buildPlantRuntimeLogRows(fleet.plantRuntime, tractorLabel),
    [fleet.plantRuntime, tractorLabel]
  );
  const filteredRuntimeLogs = useMemo(
    () => filterRuntimeLogs(runtimeLogRowsAll, { ...appliedFilters, period: 'ALL' }),
    [runtimeLogRowsAll, appliedFilters]
  );



  const complaintColumns = useMemo(() => plantComplaintTableColumns(fleet.plantRuntime), [fleet.plantRuntime]);
  const tractorColumns = useMemo(() => plantTractorColumns(), []);

  const runtimeLogCols = useMemo(() => plantRuntimeLogColumns(), []);

  const tabMeta = useMemo(() => ({
    tractors:  { count: filteredTractors.length,    total: metricsBase.length },
    breakdown: { count: filteredBreakdown.length,   total: breakdownSource.length },
    tickets:   { count: filteredTickets.length,     total: openTicketsSource.length },
    runtime:   { count: filteredRuntimeLogs.length, total: runtimeLogRowsAll.length },
  }), [filteredTractors, filteredBreakdown, filteredTickets, filteredRuntimeLogs,
       metricsBase.length, breakdownSource.length, openTicketsSource.length, runtimeLogRowsAll.length]);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(main)/runtime');
  };
  const openTractor  = (id: string) => router.push(`/tractor/${encodeURIComponent(id)}`);
  const openComplaint = (id: string) => router.push(`/complaint/${id}`);

  if (!plant || !summary) {
    return (
      <View style={[styles.root, { backgroundColor: c.background }]}>
        <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity
            style={styles.circleBackBtn}
            onPress={goBack}
            activeOpacity={0.75}
          >
            <Feather name="arrow-left" size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.topTitle}>Plant Details</Text>
          <View style={{ width: 44 }} />
        </View>
        <View style={[styles.centered]}>
          <View style={[styles.emptyIconWrap, { backgroundColor: c.surfaceAlt }]}>
            <Feather name="home" size={32} color={c.mutedForeground} />
          </View>
          <Text style={[styles.missingTitle, { color: c.foreground }]}>Plant not found</Text>
        </View>
      </View>
    );
  }

  const currentMeta = tabMeta[tab];

  const underMaintCount = useMemo(() => {
    return fleet.plantComplaints.filter(isActiveComplaint).length;
  }, [fleet.plantComplaints]);

  const inUseNowCount = useMemo(() => {
    return Math.max(0, fleet.plantTractors.length - underMaintCount);
  }, [fleet.plantTractors.length, underMaintCount]);

  const uptimePct = useMemo(() => {
    const total = fleet.plantTractors.length;
    if (total === 0) return 0;
    return Math.round((inUseNowCount / total) * 100);
  }, [inUseNowCount, fleet.plantTractors.length]);

  const downtimePct = useMemo(() => {
    const total = fleet.plantTractors.length;
    if (total === 0) return 0;
    return Math.round((underMaintCount / total) * 100);
  }, [underMaintCount, fleet.plantTractors.length]);
  const dateLabel = useMemo(() => {
    return complaintPeriodLabel(
      appliedFilters.period,
      appliedFilters.period === 'CUSTOM' ? appliedFilters.customMonth : undefined
    );
  }, [appliedFilters.period, appliedFilters.customMonth]);

  const otherFiltersLabel = useMemo(() => {
    const parts: string[] = [];
    if (appliedFilters.tractorID) {
      const t = tractorOptions.find(o => o.id === appliedFilters.tractorID);
      parts.push(`Tractor: ${t?.label ?? 'Selected'}`);
    }
    if (appliedFilters.tractorStatus !== 'ALL') parts.push(`Status: ${appliedFilters.tractorStatus}`);
    if (appliedFilters.severity !== 'ALL') parts.push(`Severity: ${appliedFilters.severity}`);
    if (appliedFilters.breakdownOnly) parts.push('Breakdown only');
    if (appliedFilters.search.trim()) parts.push(`Search: "${appliedFilters.search.trim()}"`);
    return parts.join(' · ');
  }, [appliedFilters, tractorOptions]);

  const tabContent = () => {
    switch (tab) {
      case 'tractors':
        return (
          <DataTable
            title="Fleet tractors"
            subtitle={`${filteredTractors.length} of ${metricsBase.length} in range`}
            columns={tractorColumns}
            data={filteredTractors}
            keyExtractor={m => m.tractor.tractorID}
            emptyMessage="No tractors match filters"
            compact
            showRowChevron
            stickyFirstColumn
            onRowPress={m => openTractor(m.tractor.tractorID)}
            titleColor="#FFFFFF"
            titleBgGradient={[c.gradientEnd, '#be1e2d']}
            headerBgColor={c.redSoft}
            headerTextColor={c.primary}
            rowBgColorOdd={c.redSoft + '40'}
            rowBgColorEven={c.card}
            borderColor={c.redBorder}
            outerBorderColor={c.redBorder}
            getRowBgColor={m => m.openTickets > 0 ? '#FFD6D6' : m.tractor.status === 'MAINTENANCE' ? '#FFECEC' : undefined}
          />
        );
      case 'breakdown': {
        const bdStatusOptions: { key: 'ALL' | 'IN_PROGRESS' | 'CLOSED' | 'RESOLVED'; label: string }[] = [
          { key: 'ALL', label: 'All' },
          { key: 'IN_PROGRESS', label: 'In Progress' },
          { key: 'CLOSED', label: 'Closed' },
          { key: 'RESOLVED', label: 'Resolved' },
        ];
        const selectedLabel = bdStatusOptions.find(o => o.key === breakdownStatusFilter)?.label ?? 'All';
        return (
          <View>
            {/* Status filter pill */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 6 }}>
              <TouchableOpacity
                onPress={() => setBreakdownStatusOpen(v => !v)}
                activeOpacity={0.75}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  backgroundColor: breakdownStatusFilter !== 'ALL' ? c.primary : c.surfaceAlt,
                  borderColor: breakdownStatusFilter !== 'ALL' ? c.primary : c.border,
                  borderWidth: 1,
                  borderRadius: 20,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                }}
              >
                <Text style={{ fontSize: 12, fontFamily: 'Inter_600SemiBold', color: breakdownStatusFilter !== 'ALL' ? '#fff' : c.foreground }}>
                  Status: {selectedLabel}
                </Text>
                <Feather name={breakdownStatusOpen ? 'chevron-up' : 'chevron-down'} size={13} color={breakdownStatusFilter !== 'ALL' ? '#fff' : c.mutedForeground} />
              </TouchableOpacity>
            </View>

            {/* Dropdown options */}
            {breakdownStatusOpen && (
              <View style={{
                position: 'absolute',
                top: 36,
                left: 0,
                zIndex: 999,
                backgroundColor: c.card,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: c.border,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 8,
                minWidth: 140,
                overflow: 'hidden',
              }}>
                {bdStatusOptions.map((opt, idx) => (
                  <TouchableOpacity
                    key={opt.key}
                    onPress={() => {
                      if (breakdownStatusFilter === opt.key) {
                        setBreakdownStatusOpen(false);
                        return;
                      }
                      setBreakdownStatusOpen(false);
                      setIsTabLoading(true);
                      setPendingUpdate({
                        action: () => setBreakdownStatusFilter(opt.key),
                      });
                    }}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      backgroundColor: breakdownStatusFilter === opt.key ? c.redSoft : 'transparent',
                      borderBottomWidth: idx < bdStatusOptions.length - 1 ? 1 : 0,
                      borderBottomColor: c.border,
                    }}
                  >
                    <Text style={{ fontSize: 13, fontFamily: 'Inter_500Medium', color: breakdownStatusFilter === opt.key ? c.primary : c.foreground }}>
                      {opt.label}
                    </Text>
                    {breakdownStatusFilter === opt.key && (
                      <Feather name="check" size={13} color={c.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <DataTable
              title="Breakdown history"
              subtitle={`${filteredBreakdown.length} of ${breakdownSource.length} entries`}
              columns={complaintColumns}
              data={filteredBreakdown}
              keyExtractor={r => r.complaintID}
              emptyMessage="No breakdown records match filters"
              compact
              showRowChevron
              stickyFirstColumn
              onRowPress={r => openComplaint(r.complaintID)}
              titleColor="#FFFFFF"
              titleBgGradient={[c.gradientEnd, '#be1e2d']}
              headerBgColor={c.redSoft}
              headerTextColor={c.primary}
              rowBgColorOdd={c.redSoft + '40'}
              rowBgColorEven={c.card}
              borderColor={c.redBorder}
              outerBorderColor={c.redBorder}
            />
          </View>
        );
      }
      case 'tickets':
        return (
          <DataTable
            title="Open tickets"
            subtitle={`${filteredTickets.length} of ${openTicketsSource.length} entries`}
            columns={complaintColumns}
            data={filteredTickets}
            keyExtractor={r => r.complaintID}
            emptyMessage="No open tickets match filters"
            compact
            showRowChevron
            stickyFirstColumn
            onRowPress={r => openComplaint(r.complaintID)}
            titleColor="#FFFFFF"
            titleBgGradient={[c.gradientEnd, '#be1e2d']}
            headerBgColor={c.redSoft}
            headerTextColor={c.primary}
            rowBgColorOdd={c.redSoft + '40'}
            rowBgColorEven={c.card}
            borderColor={c.redBorder}
            outerBorderColor={c.redBorder}
          />
        );
      case 'runtime': {
        const hasMore = filteredRuntimeLogs.length > 10;
        const runtimeLogsToRender = showAllRuntime ? filteredRuntimeLogs : filteredRuntimeLogs.slice(0, 10);
        return (
          <View style={{ gap: 12 }}>
            <DataTable
              title="Manual log"
              subtitle={showAllRuntime 
                ? `${filteredRuntimeLogs.length} of ${runtimeLogRowsAll.length} entries`
                : `Showing top 10 of ${filteredRuntimeLogs.length} entries`
              }
              columns={runtimeLogCols}
              data={runtimeLogsToRender}
              keyExtractor={r => r.recordID}
              emptyMessage="No log entries match filters"
              compact
              showRowChevron
              stickyFirstColumn
              onRowPress={r => openTractor(r.tractorID)}
              titleColor="#FFFFFF"
              titleBgGradient={[c.gradientEnd, '#be1e2d']}
              headerBgColor={c.redSoft}
              headerTextColor={c.primary}
              rowBgColorOdd={c.redSoft + '40'}
              rowBgColorEven={c.card}
              borderColor={c.redBorder}
              outerBorderColor={c.redBorder}
            />
            {hasMore && !showAllRuntime && (
              <TouchableOpacity
                onPress={() => {
                  setIsTabLoading(true);
                  setPendingUpdate({
                    action: () => setShowAllRuntime(true),
                  });
                }}
                activeOpacity={0.7}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 12,
                  marginTop: 4,
                }}
              >
                <Text style={{ fontSize: 14, fontFamily: 'Inter_700Bold', color: c.primary }}>
                  See All Logs ({filteredRuntimeLogs.length})
                </Text>
              </TouchableOpacity>
            )}
          </View>
        );
      }
      default: return null;
    }
  };
  const uptimeColor = uptimePct >= 75 ? c.success : uptimePct >= 50 ? c.warning : c.red;

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      {/* Red Gradient Header Area */}
      <LinearGradient
        colors={['#7E152F', '#BE185D']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          paddingTop: insets.top + 12,
          paddingHorizontal: 20,
          paddingBottom: 40,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        {/* Top Navigation Bar inside Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 36, fontFamily: 'Inter_700Bold', color: '#FFFFFF', textAlign: 'center' }}>
              {plant.name}
            </Text>
            {cleanLocation(plant.location) ? (
              <Text style={{ fontSize: 12, fontFamily: 'Inter_500Medium', color: 'rgba(255, 255, 255, 0.7)', marginTop: 4, textAlign: 'center' }}>
                {cleanLocation(plant.location)}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Progress / Slider Indicator */}
        <View style={{ height: 4, backgroundColor: '#FFFFFF', borderRadius: 2, position: 'relative', marginTop: 16, marginBottom: 8 }}>
          <View
            style={{
              position: 'absolute',
              top: -5,
              left: '100%',
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: '#FFFFFF',
              borderWidth: 3,
              borderColor: '#7E152F',
              marginLeft: -7,
            }}
          />
        </View>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1, marginTop: -36 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Overlapping White Card */}
        {/* Giant Parent 3D Metrics Box containing all three metrics sections */}
        <View
          style={{
            backgroundColor: c.card,
            borderRadius: 24,
            borderWidth: 1.2,
            borderColor: c.border,
            borderBottomWidth: 4, // 3D depth bevel thickness
            borderBottomColor: c.border,
            padding: 12, // increased from 10
            marginHorizontal: 16,
            marginTop: 0,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.1,
            shadowRadius: 20,
            elevation: 8,
            marginBottom: 20,
            gap: 12, // increased from 10
          }}
        >
          {/* SECTION 1: Status List (Commissioned fleet, In use now, Under maint/breakdown, Total breakdowns) */}
          <View>
            {[
              { label: 'Commissioned fleet',   value: `${fleet.plantTractors.length}`, dotColor: theme.accent, showBorder: true },
              { label: 'In use now',           value: `${inUseNowCount}`,  dotColor: c.success, showBorder: true },
              { label: 'Under maint/breakdown', value: `${underMaintCount}`, dotColor: c.warning, showBorder: true },
              { label: 'Total breakdowns',     value: `${fleet.plantComplaints.length}`, dotColor: c.red, showBorder: false },
            ].map((item, idx) => (
              <View
                key={item.label}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 10, // increased from 8
                  borderBottomWidth: item.showBorder ? StyleSheet.hairlineWidth : 0,
                  borderBottomColor: c.border,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: item.dotColor }} />
                  <Text style={{ fontSize: 15, fontFamily: 'Inter_600SemiBold', color: c.foreground }}>
                    {item.label}
                  </Text>
                </View>
                <Text style={{ fontSize: 15, fontFamily: 'Inter_700Bold', color: c.foreground }}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>

          {/* Divider */}
          <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: c.border }} />

          {/* SECTION 2: Fleet Bar (Breakdown open, Runtime logged, Fleet uptime) */}
          <View style={{
            flexDirection: 'row',
            backgroundColor: c.surfaceAlt,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: c.border,
            paddingVertical: 10, // increased from 8
            paddingHorizontal: 8,
          }}>
            <View style={{ flex: 1, alignItems: 'center', gap: 3 }}>
              <Text style={{ fontSize: 16, fontFamily: 'Inter_700Bold', color: c.warning }}>
                {underMaintCount}
              </Text>
              <Text style={{ fontSize: 10, fontFamily: 'Inter_500Medium', color: c.mutedForeground, textAlign: 'center' }}>
                Breakdown open
              </Text>
            </View>
            <View style={{ width: 1, height: 30, backgroundColor: c.border, alignSelf: 'center' }} />
            
            <View style={{ flex: 1, alignItems: 'center', gap: 3 }}>
              <Text style={{ fontSize: 16, fontFamily: 'Inter_700Bold', color: c.primary }}>
                {Math.round(fleet.plantTractors.reduce((sum, t) => sum + (t.totalRuntime || 0), 0))}h
              </Text>
              <Text style={{ fontSize: 10, fontFamily: 'Inter_500Medium', color: c.mutedForeground, textAlign: 'center' }}>
                Cumulative runtime
              </Text>
            </View>
            <View style={{ width: 1, height: 30, backgroundColor: c.border, alignSelf: 'center' }} />
            
            <View style={{ flex: 1, alignItems: 'center', gap: 3 }}>
              <Text style={{ fontSize: 16, fontFamily: 'Inter_700Bold', color: uptimeColor }}>
                {formatPct(uptimePct)}
              </Text>
              <Text style={{ fontSize: 10, fontFamily: 'Inter_500Medium', color: c.mutedForeground, textAlign: 'center' }}>
                Fleet uptime
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: c.border }} />

          {/* SECTION 3: 3-box layout side-by-side with brick texture backdrop */}
          <View
            style={{
              borderRadius: 16,
              borderWidth: 0,
              padding: 6, // increased from 4 (horizontal/vertical unified)
              overflow: 'hidden',
              backgroundColor: c.surfaceAlt,
            }}
          >
            {/* Brick background pattern (faint neutral brick lines) */}
            <View style={[StyleSheet.absoluteFillObject, { borderRadius: 16, overflow: 'hidden' }]} pointerEvents="none">
              {/* Horizontal rows */}
              <View style={{ position: 'absolute', top: '20%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(18, 14, 16, 0.04)' }} />
              <View style={{ position: 'absolute', top: '40%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(18, 14, 16, 0.04)' }} />
              <View style={{ position: 'absolute', top: '60%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(18, 14, 16, 0.04)' }} />
              <View style={{ position: 'absolute', top: '80%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(18, 14, 16, 0.04)' }} />
              
              {/* Vertical joints */}
              <View style={{ position: 'absolute', top: 0, bottom: '80%', left: '33%', width: 1, backgroundColor: 'rgba(18, 14, 16, 0.04)' }} />
              <View style={{ position: 'absolute', top: 0, bottom: '80%', left: '66%', width: 1, backgroundColor: 'rgba(18, 14, 16, 0.04)' }} />
              
              <View style={{ position: 'absolute', top: '20%', bottom: '60%', left: '16%', width: 1, backgroundColor: 'rgba(18, 14, 16, 0.04)' }} />
              <View style={{ position: 'absolute', top: '20%', bottom: '60%', left: '50%', width: 1, backgroundColor: 'rgba(18, 14, 16, 0.04)' }} />
              <View style={{ position: 'absolute', top: '20%', bottom: '60%', left: '83%', width: 1, backgroundColor: 'rgba(18, 14, 16, 0.04)' }} />
              
              <View style={{ position: 'absolute', top: '40%', bottom: '40%', left: '33%', width: 1, backgroundColor: 'rgba(18, 14, 16, 0.04)' }} />
              <View style={{ position: 'absolute', top: '40%', bottom: '40%', left: '66%', width: 1, backgroundColor: 'rgba(18, 14, 16, 0.04)' }} />
              
              <View style={{ position: 'absolute', top: '60%', bottom: '20%', left: '16%', width: 1, backgroundColor: 'rgba(18, 14, 16, 0.04)' }} />
              <View style={{ position: 'absolute', top: '60%', bottom: '20%', left: '50%', width: 1, backgroundColor: 'rgba(18, 14, 16, 0.04)' }} />
              <View style={{ position: 'absolute', top: '60%', bottom: '20%', left: '83%', width: 1, backgroundColor: 'rgba(18, 14, 16, 0.04)' }} />

              <View style={{ position: 'absolute', top: '80%', bottom: 0, left: '33%', width: 1, backgroundColor: 'rgba(18, 14, 16, 0.04)' }} />
              <View style={{ position: 'absolute', top: '80%', bottom: 0, left: '66%', width: 1, backgroundColor: 'rgba(18, 14, 16, 0.04)' }} />
            </View>

            {/* Child cards container in 3-box layout side-by-side in the same line */}
            <View style={{ flexDirection: 'row', gap: 2 }}>
              {/* Box 1: Uptime */}
              <View
                style={{
                  flexGrow: 1,
                  flexShrink: 1,
                  flexBasis: 0,
                  minHeight: 60, // increased from 52
                  backgroundColor: c.card,
                  borderRadius: 12,
                  borderWidth: 1.2,
                  borderColor: c.border,
                  borderBottomWidth: 2.5,
                  borderBottomColor: c.border,
                  paddingHorizontal: 6, // increased from 5
                  paddingVertical: 8, // increased from 6
                  gap: 2,
                  shadowColor: c.shadow,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.04,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: uptimeColor }} />
                  <Text 
                    style={{ fontSize: 11, fontFamily: 'Inter_600SemiBold', color: c.foreground }}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    Uptime
                  </Text>
                </View>
                <Text 
                  style={{ fontSize: 18, fontFamily: 'SpaceMono_700Bold', color: uptimeColor }}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {formatPct(uptimePct)}
                </Text>
              </View>

              {/* Box 2: Downtime */}
              <View
                style={{
                  flexGrow: 1,
                  flexShrink: 1,
                  flexBasis: 0,
                  minHeight: 60, // increased from 52
                  backgroundColor: c.card,
                  borderRadius: 12,
                  borderWidth: 1.2,
                  borderColor: c.border,
                  borderBottomWidth: 2.5,
                  borderBottomColor: c.border,
                  paddingHorizontal: 6, // increased from 5
                  paddingVertical: 8, // increased from 6
                  gap: 2,
                  shadowColor: c.shadow,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.04,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c.warning }} />
                  <Text 
                    style={{ fontSize: 11, fontFamily: 'Inter_600SemiBold', color: c.foreground }}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    Downtime
                  </Text>
                </View>
                <Text 
                  style={{ fontSize: 18, fontFamily: 'SpaceMono_700Bold', color: c.warning }}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {formatPct(downtimePct)}
                </Text>
              </View>

              {/* Box 3: Repair */}
              <View
                style={{
                  flexGrow: 1,
                  flexShrink: 1,
                  flexBasis: 0,
                  minHeight: 60, // increased from 52
                  backgroundColor: c.card,
                  borderRadius: 12,
                  borderWidth: 1.2,
                  borderColor: c.border,
                  borderBottomWidth: 2.5,
                  borderBottomColor: c.border,
                  paddingHorizontal: 6, // increased from 5
                  paddingVertical: 8, // increased from 6
                  gap: 2,
                  shadowColor: c.shadow,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.04,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c.red }} />
                  <Text 
                    style={{ fontSize: 11, fontFamily: 'Inter_600SemiBold', color: c.foreground }}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    Repair
                  </Text>
                </View>
                <Text 
                  style={{ fontSize: 18, fontFamily: 'SpaceMono_700Bold', color: c.red }}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {summary.repairDays}d
                </Text>
              </View>
            </View>
          </View>

          {/* SECTION 4: Uptime progress bar track at bottom */}
          <View style={{ height: 6, backgroundColor: c.track, borderRadius: 3, overflow: 'hidden' }}>
            <View style={{ height: '100%', borderRadius: 3, backgroundColor: c.success, width: '100%' }} />
          </View>
        </View>


        {/* Recent Section Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, marginTop: 16, marginBottom: 12 }}>
          <View style={{ width: 5, height: 24, borderRadius: 2.5, backgroundColor: c.primary }} />
          <Text style={{ fontSize: 22, fontFamily: 'Inter_900Black', color: c.foreground, letterSpacing: -0.4 }}>
            Fleet Details
          </Text>
        </View>

        {/* Big Div Wrapper for Tabs + Content (styled like a premium card) */}
        <View style={{
          backgroundColor: c.card,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: c.border,
          padding: 14,
          marginHorizontal: 16,
          marginBottom: 24,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.05,
          shadowRadius: 15,
          elevation: 4,
        }}>
          {/* Non-scrollable Tab Chips Container Card Wrapper */}
          <View style={{
            backgroundColor: c.surfaceAlt,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: c.border,
            padding: 5,
            marginBottom: 12,
            gap: 4,
          }}>
            {/* Row 1 */}
            <View style={{ flexDirection: 'row', gap: 4 }}>
              {TABS.slice(0, 2).map(t => {
                const active = tab === t.key;
                const meta = tabMeta[t.key];
                return (
                  <TouchableOpacity
                    key={t.key}
                    style={[
                      styles.tabChip,
                      {
                        flex: 1, // distribute space evenly
                        backgroundColor: active ? c.primary : c.card,
                        borderColor: active ? c.primary : c.border,
                        paddingHorizontal: 6,
                        paddingVertical: 6,
                        justifyContent: 'center',
                        gap: 4,
                      },
                    ]}
                    onPress={() => {
                      if (tab === t.key) return;
                      setIsTabLoading(true);
                      setPendingUpdate({
                        action: () => {
                          setTab(t.key);
                          setShowAllRuntime(false);
                        },
                      });
                    }}
                    activeOpacity={0.8}
                  >
                    <Feather name={t.icon} size={12} color={active ? c.primaryForeground : c.mutedForeground} />
                    <Text 
                      style={[styles.tabChipLabel, { color: active ? c.primaryForeground : c.foreground, fontSize: 11 }]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {t.label}
                    </Text>
                    <View style={[styles.tabChipBadge, { 
                      backgroundColor: active ? c.primaryForeground + '28' : c.muted, 
                      minWidth: 16, 
                      height: 16, 
                      borderRadius: 8,
                      paddingHorizontal: 3,
                    }]}>
                      <Text 
                        style={[styles.tabChipBadgeText, { color: active ? c.primaryForeground : c.mutedForeground, fontSize: 8 }]}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                      >
                        {meta.count}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Row 2 */}
            <View style={{ flexDirection: 'row', gap: 4 }}>
              {TABS.slice(2, 4).map(t => {
                const active = tab === t.key;
                const meta = tabMeta[t.key];
                return (
                  <TouchableOpacity
                    key={t.key}
                    style={[
                      styles.tabChip,
                      {
                        flex: 1, // distribute space evenly
                        backgroundColor: active ? c.primary : c.card,
                        borderColor: active ? c.primary : c.border,
                        paddingHorizontal: 6,
                        paddingVertical: 6,
                        justifyContent: 'center',
                        gap: 4,
                      },
                    ]}
                    onPress={() => {
                      if (tab === t.key) return;
                      setIsTabLoading(true);
                      setPendingUpdate({
                        action: () => {
                          setTab(t.key);
                          setShowAllRuntime(false);
                        },
                      });
                    }}
                    activeOpacity={0.8}
                  >
                    <Feather name={t.icon} size={12} color={active ? c.primaryForeground : c.mutedForeground} />
                    <Text 
                      style={[styles.tabChipLabel, { color: active ? c.primaryForeground : c.foreground, fontSize: 11 }]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {t.label}
                    </Text>
                    <View style={[styles.tabChipBadge, { 
                      backgroundColor: active ? c.primaryForeground + '28' : c.muted, 
                      minWidth: 16, 
                      height: 16, 
                      borderRadius: 8,
                      paddingHorizontal: 3,
                    }]}>
                      <Text 
                        style={[styles.tabChipBadgeText, { color: active ? c.primaryForeground : c.mutedForeground, fontSize: 8 }]}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                      >
                        {meta.count}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Inner Content Section */}
          <View style={{ gap: 12 }}>
            {/* Search + filter bar */}
            <View style={[styles.toolbar, { marginHorizontal: 0, marginTop: 0 }]}>
              <View style={[styles.searchBox, { backgroundColor: c.background, borderColor: c.border }]}>
                <Feather name="search" size={15} color={c.mutedForeground} />
                <TextInput
                  style={[styles.searchInput, { color: c.foreground }]}
                  placeholder="Search…"
                  placeholderTextColor={c.mutedForeground + '88'}
                  value={search}
                  onChangeText={setSearch}
                />
                {search.length > 0 ? (
                  <TouchableOpacity
                    onPress={() => {
                      setIsTabLoading(true);
                      setPendingUpdate({
                        action: () => setSearch(''),
                      });
                    }}
                    hitSlop={8}
                  >
                    <View style={[styles.clearBtn, { backgroundColor: c.border }]}>
                      <Feather name="x" size={11} color={c.mutedForeground} />
                    </View>
                  </TouchableOpacity>
                ) : null}
              </View>
              <TouchableOpacity
                style={[
                  styles.filterBtn,
                  {
                    backgroundColor: activeFilterCount > 0 ? c.primary : c.background,
                    borderColor: activeFilterCount > 0 ? c.primary : c.border,
                    shadowColor: activeFilterCount > 0 ? c.primary : 'transparent',
                  },
                ]}
                onPress={() => setFilterSheetOpen(true)}
                activeOpacity={0.8}
              >
                <Feather name="sliders" size={16} color={activeFilterCount > 0 ? c.primaryForeground : c.foreground} />
                {activeFilterCount > 0 ? (
                  <View style={[styles.filterBadge, { backgroundColor: c.primaryForeground }]}>
                    <Text style={[styles.filterBadgeText, { color: c.primary }]}>{activeFilterCount}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 2 }}>
              <Text style={{ fontSize: 13, fontFamily: 'Inter_700Bold', color: c.primary, textTransform: 'uppercase', letterSpacing: 0.3 }}>
                {dateLabel}
              </Text>
              <Text style={[styles.showingLine, { color: c.foreground }]}>
                {currentMeta.count} result{currentMeta.count !== 1 ? 's' : ''}
                {currentMeta.count !== currentMeta.total ? ` (of ${currentMeta.total})` : ''}
              </Text>
            </View>

            {otherFiltersLabel ? (
              <Text style={[styles.filterLine, { color: c.mutedForeground, marginBottom: 8 }]} numberOfLines={1}>
                {otherFiltersLabel}
              </Text>
            ) : null}

            {tabContent()}
          </View>
        </View>
      </ScrollView>

      <PlantDetailFilterSheet
        visible={filterSheetOpen}
        applied={filters}
        tractorOptions={tractorOptions}
        showBreakdownToggle={tab === 'breakdown' || tab === 'tickets'}
        onClose={() => setFilterSheetOpen(false)}
        onApply={(newFilters) => {
          setIsTabLoading(true);
          setPendingUpdate({
            action: () => {
              setFilters(newFilters);
              setShowAllRuntime(false);
            },
          });
        }}
      />

      {isTabLoading && (
        <View style={StyleSheet.absoluteFillObject}>
          <View style={[styles.loadingOverlayBg, { backgroundColor: 'rgba(8, 16, 43, 0.45)' }]} />
          <View style={styles.loadingContainer}>
            <View style={[styles.loadingBox, { backgroundColor: c.card, borderColor: c.border }]}>
              <ActivityIndicator size="large" color={c.primary} />
              <Text style={[styles.loadingText, { color: c.foreground }]}>
                Processing...
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerContainer: {
    backgroundColor: 'transparent',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: '#7E152F',
  },
  circleBackBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  topTitle: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  centered: {
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
  missingTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
  },
  goBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 4,
  },
  goBackText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
  },
  hero: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    overflow: 'hidden',
  },
  backLink: {
    alignSelf: 'flex-start',
    marginBottom: 14,
  },
  backCircle: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  heroCard: {
    borderRadius: 22,
    borderWidth: 1.5,
    padding: 18,
    gap: 14,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  heroInfo: { flex: 1, gap: 5 },
  heroTitle: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroSub: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    flex: 1,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    gap: 3,
  },
  pillValue: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.4,
  },
  pillLabel: {
    fontSize: 9,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  fleetBar: {
    flexDirection: 'row',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
  },
  fleetBarItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  fleetBarDivider: {
    width: 1,
    height: 30,
    alignSelf: 'center',
  },
  fleetBarVal: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.3,
  },
  fleetBarLbl: {
    fontSize: 9,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },
  uptimeBarWrap: {
    marginTop: -4,
  },
  uptimeTrack: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  uptimeFill: {
    height: '100%',
    borderRadius: 3,
  },
  tabScrollWrap: {
    marginTop: 8,
  },
  tabScroll: {
    paddingHorizontal: 16,
    gap: 8,
    paddingVertical: 6,
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 2,
  },
  tabChipLabel: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.1,
  },
  tabChipBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  tabChipBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  contentSection: {
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 10,
    paddingBottom: 8,
  },
  toolbar: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 11,
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    padding: 0,
  },
  clearBtn: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtn: {
    width: 38,
    height: 38,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 2,
  },
  filterBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  filterLine: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    lineHeight: 17,
  },
  showingLine: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.1,
  },
  tableCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    marginTop: 4,
  },
  tableCardHeader: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 6,
    gap: 3,
  },
  tableCardTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.1,
  },
  tableCardSub: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  runtimeStack: {
    gap: 14,
  },
  loadingOverlayBg: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999,
  },
  loadingBox: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
    minWidth: 130,
  },
  loadingText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: -0.1,
  },
});

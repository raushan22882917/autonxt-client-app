import React, { useMemo, useState } from 'react';
import {
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
import { PlantDetailDateBar } from '@/components/PlantDetailDateBar';
import { PlantDetailFilterSheet } from '@/components/PlantDetailFilterSheet';
import { UptimeMetricCards } from '@/components/UptimeMetricCards';
import { isActiveComplaint } from '@/lib/complaintFilters';
import { isBreakdownComplaint } from '@/lib/isBreakdownComplaint';
import {
  buildPlantRuntimeLogRows,
  plantComplaintTableColumns,
  plantRuntimeLogColumns,
  plantRuntimeTractorColumns,
  plantTractorColumns,
} from '@/lib/plantDetailTables';
import type { ComplaintPeriod } from '@/lib/complaintFilters';
import {
  applyPeriodToTractorMetrics,
  countActivePlantDetailFilters,
  DEFAULT_PLANT_DETAIL_FILTERS,
  filterComplaintsByPeriod,
  filterPlantComplaints,
  filterRuntimeLogs,
  filterRuntimeRecordsByPeriod,
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

export default function PlantDetailScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const plantID = id ? decodeURIComponent(id) : '';
  const { plants, tractors, complaints, runtimeRecords } = useApp();
  const [tab, setTab] = useState<TabKey>('tractors');
  const [filters, setFilters] = useState<PlantDetailFilterValues>(DEFAULT_PLANT_DETAIL_FILTERS);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [search, setSearch] = useState('');

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
  const filteredBreakdown = useMemo(
    () => filterPlantComplaints(breakdownInPeriod, appliedFilters),
    [breakdownInPeriod, appliedFilters]
  );
  const filteredTickets = useMemo(
    () => filterPlantComplaints(openTicketsInPeriod, appliedFilters),
    [openTicketsInPeriod, appliedFilters]
  );
  const runtimeInPeriod = useMemo(
    () => filterRuntimeRecordsByPeriod(fleet.plantRuntime, period, customMonth),
    [fleet.plantRuntime, period, customMonth]
  );
  const runtimeLogRows = useMemo(
    () => buildPlantRuntimeLogRows(runtimeInPeriod, tractorLabel),
    [runtimeInPeriod, tractorLabel]
  );
  const filteredRuntimeLogs = useMemo(
    () => filterRuntimeLogs(runtimeLogRows, appliedFilters),
    [runtimeLogRows, appliedFilters]
  );
  const runtimeTractorsDisplay = useMemo(() => {
    if (period !== 'ALL') return filteredTractors;
    const ids = new Set(filteredRuntimeLogs.map(r => r.tractorID));
    if (ids.size === 0 && !appliedFilters.tractorID && !appliedFilters.search.trim())
      return filteredTractors;
    return filteredTractors.filter(m => ids.has(m.tractor.tractorID));
  }, [filteredTractors, filteredRuntimeLogs, period, appliedFilters]);
  const logCountByTractor = useMemo(() => {
    const map = new Map<string, number>();
    filteredRuntimeLogs.forEach(r => { map.set(r.tractorID, (map.get(r.tractorID) ?? 0) + 1); });
    return map;
  }, [filteredRuntimeLogs]);

  const complaintColumns = useMemo(() => plantComplaintTableColumns(), []);
  const tractorColumns = useMemo(() => plantTractorColumns(), []);
  const runtimeTractorCols = useMemo(() => plantRuntimeTractorColumns(logCountByTractor), [logCountByTractor]);
  const runtimeLogCols = useMemo(() => plantRuntimeLogColumns(), []);

  const tabMeta = useMemo(() => ({
    tractors:  { count: filteredTractors.length,    total: metricsBase.length },
    breakdown: { count: filteredBreakdown.length,   total: breakdownInPeriod.length },
    tickets:   { count: filteredTickets.length,     total: openTicketsInPeriod.length },
    runtime:   { count: filteredRuntimeLogs.length, total: runtimeLogRows.length },
  }), [filteredTractors, filteredBreakdown, filteredTickets, filteredRuntimeLogs,
       metricsBase.length, breakdownInPeriod.length, openTicketsInPeriod.length, runtimeLogRows.length]);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(main)/runtime');
  };
  const openTractor  = (id: string) => router.push(`/tractor/${encodeURIComponent(id)}`);
  const openComplaint = (id: string) => router.push(`/complaint/${id}`);

  const Header = (
    <View style={styles.headerContainer}>
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
    </View>
  );

  if (!plant || !summary) {
    return (
      <View style={[styles.root, { backgroundColor: c.background }]}>
        {Header}
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
  const filterSummary = plantDetailFilterSummary(appliedFilters, tractorOptions);

  const tableWrap = (child: React.ReactNode, title: string, subtitle: string) => (
    <View style={[styles.tableCard, { backgroundColor: c.card, borderColor: c.border }]}>
      <View style={styles.tableCardHeader}>
        <Text style={[styles.tableCardTitle, { color: c.foreground }]}>{title}</Text>
        <Text style={[styles.tableCardSub, { color: c.mutedForeground }]}>{subtitle}</Text>
      </View>
      {child}
    </View>
  );

  const tabContent = () => {
    switch (tab) {
      case 'tractors':
        return tableWrap(
          <DataTable columns={tractorColumns} data={filteredTractors}
            keyExtractor={m => m.tractor.tractorID} emptyMessage="No tractors match filters"
            compact fitWidth showRowChevron onRowPress={m => openTractor(m.tractor.tractorID)} />,
          'Fleet tractors', `${filteredTractors.length} of ${metricsBase.length} in range`
        );
      case 'breakdown':
        return tableWrap(
          <DataTable columns={complaintColumns} data={filteredBreakdown}
            keyExtractor={r => r.complaintID} emptyMessage="No breakdown records match filters"
            compact fitWidth showRowChevron onRowPress={r => openComplaint(r.complaintID)} />,
          'Breakdown history', `${filteredBreakdown.length} of ${breakdownInPeriod.length} in range`
        );
      case 'tickets':
        return tableWrap(
          <DataTable columns={complaintColumns} data={filteredTickets}
            keyExtractor={r => r.complaintID} emptyMessage="No open tickets match filters"
            compact fitWidth showRowChevron onRowPress={r => openComplaint(r.complaintID)} />,
          'Open tickets', `${filteredTickets.length} of ${openTicketsInPeriod.length} in range`
        );
      case 'runtime':
        return (
          <View style={styles.runtimeStack}>
            {tableWrap(
              <DataTable columns={runtimeTractorCols} data={runtimeTractorsDisplay}
                keyExtractor={m => m.tractor.tractorID} emptyMessage="No tractors match filters"
                compact fitWidth showRowChevron onRowPress={m => openTractor(m.tractor.tractorID)} />,
              'Tractor runtime', `${runtimeTractorsDisplay.length} tractor${runtimeTractorsDisplay.length === 1 ? '' : 's'}`
            )}
            {tableWrap(
              <DataTable columns={runtimeLogCols} data={filteredRuntimeLogs}
                keyExtractor={r => r.recordID} emptyMessage="No log entries match filters"
                compact fitWidth showRowChevron onRowPress={r => openTractor(r.tractorID)} />,
              'Manual log', `${filteredRuntimeLogs.length} of ${runtimeLogRows.length} entries`
            )}
          </View>
        );
      default: return null;
    }
  };

  const uptimeColor = summary.uptimePct >= 75 ? c.success : summary.uptimePct >= 50 ? c.warning : c.red;

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      {Header}
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 100 }} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={[styles.hero, { paddingTop: 8 }]}>
          <LinearGradient
            colors={[theme.accent + '22', theme.accent + '08', c.background]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />

          {/* Plant header card */}
          <View style={[styles.heroCard, { backgroundColor: c.card, borderColor: theme.border, shadowColor: theme.accent }]}>
            {/* Icon + name */}
            <View style={styles.heroTop}>
              <View style={[styles.heroIcon, { backgroundColor: theme.accent + '18' }]}>
                <Feather name={theme.icon} size={28} color={theme.accent} />
              </View>
              <View style={styles.heroInfo}>
                <Text style={[styles.heroTitle, { color: c.foreground }]}>{plant.name}</Text>
                {plant.location ? (
                  <View style={styles.locationRow}>
                    <Feather name="map-pin" size={12} color={c.mutedForeground} />
                    <Text style={[styles.heroSub, { color: c.mutedForeground }]} numberOfLines={1}>
                      {plant.location}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>

            {/* Stat pills */}
            <View style={styles.pillRow}>
              {[
                { label: 'Tractors',     value: summary.tractorCount, color: theme.accent,  bg: theme.accent + '14' },
                { label: 'In operation', value: summary.inOperation,  color: c.success,     bg: c.successSoft },
                { label: 'Maintenance',  value: summary.maintenance,  color: c.warning,     bg: c.warningSoft },
                { label: 'Open',         value: summary.openTickets,  color: c.red,         bg: c.redSoft },
              ].map(p => (
                <View key={p.label} style={[styles.pill, { backgroundColor: p.bg }]}>
                  <Text style={[styles.pillValue, { color: p.color }]}>{p.value}</Text>
                  <Text style={[styles.pillLabel, { color: p.color + 'BB' }]}>{p.label}</Text>
                </View>
              ))}
            </View>

            <UptimeMetricCards
              uptimePct={summary.uptimePct}
              downtimePct={summary.downtimePct}
              repairDays={summary.repairDays}
            />

            {/* Fleet bar */}
            <View style={[styles.fleetBar, { backgroundColor: c.surfaceAlt, borderColor: c.hairline }]}>
              <View style={styles.fleetBarItem}>
                <Text style={[styles.fleetBarVal, { color: c.warning }]}>{summary.breakdownOpen}</Text>
                <Text style={[styles.fleetBarLbl, { color: c.mutedForeground }]}>Breakdown open</Text>
              </View>
              <View style={[styles.fleetBarDivider, { backgroundColor: c.border }]} />
              <View style={styles.fleetBarItem}>
                <Text style={[styles.fleetBarVal, { color: c.primary }]}>
                  {summary.runtimeHours > 0 ? `${Math.round(summary.runtimeHours)}h` : '—'}
                </Text>
                <Text style={[styles.fleetBarLbl, { color: c.mutedForeground }]}>Runtime logged</Text>
              </View>
              <View style={[styles.fleetBarDivider, { backgroundColor: c.border }]} />
              <View style={styles.fleetBarItem}>
                <Text style={[styles.fleetBarVal, { color: uptimeColor }]}>
                  {formatPct(summary.uptimePct)}
                </Text>
                <Text style={[styles.fleetBarLbl, { color: c.mutedForeground }]}>Fleet uptime</Text>
              </View>
            </View>

            {/* Uptime progress bar */}
            <View style={styles.uptimeBarWrap}>
              <View style={[styles.uptimeTrack, { backgroundColor: c.track }]}>
                <View style={[styles.uptimeFill, { width: `${Math.min(100, summary.uptimePct)}%`, backgroundColor: uptimeColor }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Horizontal tab chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScroll}
          style={styles.tabScrollWrap}
        >
          {TABS.map(t => {
            const active = tab === t.key;
            const meta = tabMeta[t.key];
            return (
              <TouchableOpacity
                key={t.key}
                style={[
                  styles.tabChip,
                  {
                    backgroundColor: active ? c.primary : c.card,
                    borderColor: active ? c.primary : c.border,
                    shadowColor: active ? c.primary : 'transparent',
                  },
                ]}
                onPress={() => setTab(t.key)}
                activeOpacity={0.8}
              >
                <Feather name={t.icon} size={14} color={active ? c.primaryForeground : c.mutedForeground} />
                <Text style={[styles.tabChipLabel, { color: active ? c.primaryForeground : c.foreground }]}>
                  {t.label}
                </Text>
                <View style={[styles.tabChipBadge, { backgroundColor: active ? c.primaryForeground + '28' : c.muted }]}>
                  <Text style={[styles.tabChipBadgeText, { color: active ? c.primaryForeground : c.mutedForeground }]}>
                    {meta.count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Content section */}
        <View style={styles.contentSection}>
          <PlantDetailDateBar
            period={period}
            customMonth={customMonth}
            onPeriodChange={(p: ComplaintPeriod) => setFilters(prev => ({ ...prev, period: p }))}
            onCustomMonthChange={month => setFilters(prev => ({ ...prev, customMonth: month, period: 'CUSTOM' }))}
          />

          {/* Search + filter bar */}
          <View style={styles.toolbar}>
            <View style={[styles.searchBox, { backgroundColor: c.card, borderColor: c.border }]}>
              <Feather name="search" size={16} color={c.mutedForeground} />
              <TextInput
                style={[styles.searchInput, { color: c.foreground }]}
                placeholder="Search…"
                placeholderTextColor={c.mutedForeground + '88'}
                value={search}
                onChangeText={setSearch}
              />
              {search.length > 0 ? (
                <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}>
                  <View style={[styles.clearBtn, { backgroundColor: c.border }]}>
                    <Feather name="x" size={12} color={c.mutedForeground} />
                  </View>
                </TouchableOpacity>
              ) : null}
            </View>
            <TouchableOpacity
              style={[
                styles.filterBtn,
                {
                  backgroundColor: activeFilterCount > 0 ? c.primary : c.card,
                  borderColor: activeFilterCount > 0 ? c.primary : c.border,
                  shadowColor: activeFilterCount > 0 ? c.primary : 'transparent',
                },
              ]}
              onPress={() => setFilterSheetOpen(true)}
              activeOpacity={0.8}
            >
              <Feather name="sliders" size={18} color={activeFilterCount > 0 ? c.primaryForeground : c.foreground} />
              {activeFilterCount > 0 ? (
                <View style={[styles.filterBadge, { backgroundColor: c.primaryForeground }]}>
                  <Text style={[styles.filterBadgeText, { color: c.primary }]}>{activeFilterCount}</Text>
                </View>
              ) : null}
            </TouchableOpacity>
          </View>

          {filterSummary ? (
            <Text style={[styles.filterLine, { color: c.mutedForeground }]} numberOfLines={2}>
              {filterSummary}
            </Text>
          ) : null}

          <Text style={[styles.showingLine, { color: c.foreground }]}>
            {currentMeta.count} result{currentMeta.count !== 1 ? 's' : ''}
            {currentMeta.count !== currentMeta.total ? ` (of ${currentMeta.total})` : ''}
          </Text>

          {tabContent()}
        </View>
      </ScrollView>

      <PlantDetailFilterSheet
        visible={filterSheetOpen}
        applied={filters}
        tractorOptions={tractorOptions}
        showBreakdownToggle={tab === 'breakdown' || tab === 'tickets'}
        onClose={() => setFilterSheetOpen(false)}
        onApply={setFilters}
      />
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
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 11,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    padding: 0,
  },
  clearBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
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
});

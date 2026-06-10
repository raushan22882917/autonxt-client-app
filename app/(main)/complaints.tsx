import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { ComplaintFilterSheet } from '@/components/ComplaintFilterSheet';
import { StatusBadge } from '@/components/StatusBadge';
import { Complaint } from '@/lib/appsync';
import { severityColor, formatDate } from '@/lib/complaint';
import {
  COMPLAINT_STATUS_TABS,
  complaintPeriodLabel,
  countActiveComplaintFilters,
  DEFAULT_COMPLAINT_FILTERS,
  emptyMessageForTab,
  filterComplaintList,
  filterComplaintsByPeriod,
  isActiveComplaint,
  type ComplaintFilterValues,
} from '@/lib/complaintFilters';
import { isBreakdownComplaint } from '@/lib/isBreakdownComplaint';

function activeFilterSummary(filters: ComplaintFilterValues): string {
  const statusLabel =
    COMPLAINT_STATUS_TABS.find(t => t.key === filters.statusTab)?.label ?? filters.statusTab;
  const periodLabel = complaintPeriodLabel(
    filters.period,
    filters.period === 'CUSTOM' ? filters.customMonth : undefined
  );
  const parts = [statusLabel, periodLabel];
  if (filters.severity !== 'ALL') parts.push(filters.severity);
  if (filters.breakdownOnly) parts.push('Breakdown');
  return parts.join(' · ');
}

// ── Icon-enhanced summary box ─────────────────────────────────────────────
function SummaryBox({
  value,
  label,
  color,
  bg,
  border,
  icon,
}: {
  value: number;
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: string;
}) {
  return (
    <View style={[summaryStyles.box, { backgroundColor: bg, borderColor: border }]}>
      <View style={[summaryStyles.iconWrap, { backgroundColor: color + '20' }]}>
        <Feather name={icon as any} size={15} color={color} />
      </View>
      <Text style={[summaryStyles.num, { color }]}>{value}</Text>
      <Text style={[summaryStyles.label, { color: color + 'BB' }]}>{label}</Text>
    </View>
  );
}

export default function ComplaintsScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { filteredComplaints, isLoading, refresh } = useApp();

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ComplaintFilterValues>(DEFAULT_COMPLAINT_FILTERS);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const { period, customMonth, statusTab, severity, breakdownOnly } = filters;
  const activeFilterCount = countActiveComplaintFilters(filters);

  const topPad = Platform.OS === 'web' ? 67 : 0;
  const periodLabel = complaintPeriodLabel(
    period,
    period === 'CUSTOM' ? customMonth : undefined
  );

  const inPeriod = useMemo(
    () => filterComplaintsByPeriod(filteredComplaints, period, customMonth),
    [filteredComplaints, period, customMonth]
  );

  const displayed = useMemo(
    () =>
      filterComplaintList(filteredComplaints, {
        statusTab,
        severity,
        breakdownOnly,
        search,
        period,
        customMonth,
      }),
    [filteredComplaints, statusTab, severity, breakdownOnly, search, period, customMonth]
  );

  const raisedCount = inPeriod.length;
  const critCount = inPeriod.filter(x => x.severity === 'CRITICAL').length;
  const openCount = inPeriod.filter(isActiveComplaint).length;
  const breakdownRaised = inPeriod.filter(isBreakdownComplaint).length;

  const renderComplaint = ({ item }: { item: Complaint }) => {
    const sev = severityColor(item.severity, c);
    const isCritical = item.severity === 'CRITICAL';
    const isBreakdown = isBreakdownComplaint(item);

    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: c.card,
            borderColor: isCritical ? sev + '55' : c.border,
            shadowColor: isCritical ? sev : c.shadowStrong,
            shadowOpacity: isCritical ? 0.18 : 0.06,
          },
        ]}
        activeOpacity={0.75}
        onPress={() => router.push(`/complaint/${item.complaintID}`)}
        accessibilityRole="button"
      >
        {/* Severity stripe — 5px */}
        <View style={[styles.sevStripe, { backgroundColor: sev }]} />

        <View style={styles.cardBody}>
          {/* Header row */}
          <View style={styles.cardTop}>
            <View style={[styles.iconWrap, { backgroundColor: sev + '18', borderColor: sev + '30', borderWidth: 1 }]}>
              <Feather name={isBreakdown ? 'alert-octagon' : 'alert-triangle'} size={19} color={sev} />
            </View>
            <View style={styles.info}>
              <Text style={[styles.title, { color: c.foreground }]} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={[styles.sub, { color: c.mutedForeground }]} numberOfLines={1}>
                {[item.tractorModel, item.plantName].filter(Boolean).join(' · ')}
              </Text>
            </View>
            <View style={[styles.arrowWrap, { backgroundColor: c.surfaceAlt }]}>
              <Feather name="chevron-right" size={16} color={c.mutedForeground} />
            </View>
          </View>

          {/* Description */}
          <Text style={[styles.description, { color: c.mutedForeground }]} numberOfLines={2}>
            {item.description}
          </Text>

          {/* Footer row */}
          <View style={styles.badgeRow}>
            <StatusBadge status={item.severity} small />
            <StatusBadge status={item.status} small />
            {isBreakdown ? (
              <View style={[styles.breakdownPill, { backgroundColor: c.red + '14', borderColor: c.red + '30' }]}>
                <Feather name="alert-octagon" size={9} color={c.red} />
                <Text style={[styles.breakdownPillText, { color: c.red }]}>Breakdown</Text>
              </View>
            ) : null}
            <View style={styles.dateRow}>
              <Feather name="calendar" size={11} color={c.mutedForeground} />
              <Text style={[styles.date, { color: c.mutedForeground }]}>
                {formatDate(item.createdAt)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const ListHeader = (
    <View style={{ paddingTop: topPad }}>
      {/* ── Operator Support Hero Strip ── */}
      <View style={[styles.heroStrip, { shadowColor: c.primary }]}>
        <LinearGradient
          colors={[c.gradientStart, c.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.heroGradient}
        >
          <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
            <View style={styles.heroDotTR} />
            <View style={styles.heroGridH} />
          </View>

          <View style={styles.heroLeft}>
            <Text style={styles.heroSuper}>OPERATOR SUPPORT</Text>
            <Text style={styles.heroTitle}>Tickets & Complaints</Text>
          </View>

          <View style={styles.heroStats}>
            <View style={[styles.heroStatItem, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              <Text style={styles.heroStatNum}>{openCount}</Text>
              <Text style={styles.heroStatLabel}>OPEN</Text>
            </View>
            {critCount > 0 && (
              <View style={[styles.heroStatItem, { backgroundColor: 'rgba(255,200,0,0.25)' }]}>
                <Text style={styles.heroStatNum}>{critCount}</Text>
                <Text style={styles.heroStatLabel}>CRIT</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </View>

      {/* ── Search + Filter ── */}
      <View style={styles.controlArea}>
        <View style={styles.searchRow}>
          <View style={[styles.searchBox, { backgroundColor: c.card, borderColor: c.border }]}>
            <Feather name="search" size={17} color={c.mutedForeground} />
            <TextInput
              style={[styles.searchInput, { color: c.foreground }]}
              placeholder="Search tickets…"
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
                shadowOpacity: activeFilterCount > 0 ? 0.3 : 0,
              },
            ]}
            onPress={() => setFilterSheetOpen(true)}
            activeOpacity={0.8}
          >
            <Feather
              name="sliders"
              size={19}
              color={activeFilterCount > 0 ? c.primaryForeground : c.foreground}
            />
            {activeFilterCount > 0 ? (
              <View style={[styles.filterBadge, { backgroundColor: c.primaryForeground }]}>
                <Text style={[styles.filterBadgeText, { color: c.primary }]}>{activeFilterCount}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>

        {/* Active filter summary */}
        <Text style={[styles.activeFilters, { color: c.mutedForeground }]} numberOfLines={1}>
          {activeFilterSummary(filters)}
        </Text>

        {/* Icon-enhanced Summary Boxes */}
        <View style={styles.summaryRow}>
          <SummaryBox
            value={raisedCount}
            label="Raised"
            color={c.blue}
            bg={c.blueSoft}
            border={c.blue + '30'}
            icon="inbox"
          />
          <SummaryBox
            value={critCount}
            label="Critical"
            color={c.red}
            bg={c.redSoft}
            border={c.redBorder}
            icon="alert-octagon"
          />
          <SummaryBox
            value={openCount}
            label="Open"
            color={c.warning}
            bg={c.warningSoft}
            border={c.warningBorder}
            icon="clock"
          />
          <SummaryBox
            value={breakdownRaised}
            label="Breakdown"
            color={c.foreground}
            bg={c.surfaceAlt}
            border={c.border}
            icon="tool"
          />
        </View>

        {/* Results count + period */}
        <View style={styles.resultsRow}>
          <View style={[styles.sectionAccent, { backgroundColor: c.primary }]} />
          <Text style={[styles.periodHint, { color: c.mutedForeground }]}>
            Showing <Text style={{ color: c.foreground, fontFamily: 'Inter_700Bold' }}>{displayed.length}</Text>
            {' '}of {raisedCount} · {periodLabel}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <FlatList
        data={displayed}
        keyExtractor={x => x.complaintID}
        renderItem={renderComplaint}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor={c.primary} />
        }
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <View style={[styles.empty, { backgroundColor: c.card, borderColor: c.border }]}>
            <View style={[styles.emptyIconWrap, { backgroundColor: c.successSoft }]}>
              <Feather name="check-circle" size={32} color={c.success} />
            </View>
            <Text style={[styles.emptyTitle, { color: c.foreground }]}>
              {search ? 'No Results' : 'All Clear'}
            </Text>
            <Text style={[styles.emptyText, { color: c.mutedForeground }]}>
              {emptyMessageForTab(statusTab, breakdownOnly, periodLabel)}
            </Text>
            <TouchableOpacity
              style={[styles.emptyFilterBtn, { borderColor: c.primary + '44', backgroundColor: c.blueSoft }]}
              onPress={() => setFilterSheetOpen(true)}
            >
              <Feather name="sliders" size={15} color={c.primary} />
              <Text style={[styles.emptyFilterText, { color: c.primary }]}>Adjust filters</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <ComplaintFilterSheet
        visible={filterSheetOpen}
        applied={filters}
        onClose={() => setFilterSheetOpen(false)}
        onApply={setFilters}
      />
    </View>
  );
}

const summaryStyles = StyleSheet.create({
  box: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  num: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

const styles = StyleSheet.create({
  root: { flex: 1 },

  // ── Hero strip ──
  heroStrip: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 5,
  },
  heroGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    overflow: 'hidden',
  },
  heroDotTR: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    top: -35,
    right: -20,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  heroGridH: {
    position: 'absolute',
    left: '35%',
    right: 0,
    top: '65%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  heroLeft: { flex: 1, gap: 3 },
  heroSuper: {
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 1.6,
  },
  heroTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  heroStats: {
    flexDirection: 'row',
    gap: 6,
  },
  heroStatItem: {
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 48,
  },
  heroStatNum: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    lineHeight: 22,
  },
  heroStatLabel: {
    fontSize: 8,
    fontFamily: 'Inter_700Bold',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 0.8,
  },

  // ── Control area ──
  controlArea: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    gap: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
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
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
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
  activeFilters: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 0.1,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 8,
  },
  resultsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionAccent: {
    width: 4,
    height: 16,
    borderRadius: 2,
  },
  periodHint: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },

  // ── Complaint card ──
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  sevStripe: { width: 5 },
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
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  info: { flex: 1, gap: 2 },
  title: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.1,
  },
  sub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  arrowWrap: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  description: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    lineHeight: 19,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    flexWrap: 'wrap',
  },
  breakdownPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  breakdownPillText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
  },
  date: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },

  // ── Empty ──
  empty: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 8,
    gap: 10,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.3,
  },
  emptyText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  emptyFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 4,
  },
  emptyFilterText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
});

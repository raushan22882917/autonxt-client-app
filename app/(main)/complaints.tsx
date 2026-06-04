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
            borderColor: isCritical ? sev + '44' : c.border,
            shadowColor: c.shadowStrong,
          },
        ]}
        activeOpacity={0.75}
        onPress={() => router.push(`/complaint/${item.complaintID}`)}
        accessibilityRole="button"
      >
        {/* Severity stripe */}
        <View style={[styles.sevStripe, { backgroundColor: sev }]} />

        <View style={styles.cardBody}>
          {/* Header row */}
          <View style={styles.cardTop}>
            <View style={[styles.iconWrap, { backgroundColor: sev + '15' }]}>
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
    <View style={[styles.header, { paddingTop: topPad + 14 }]}>
      {/* Search + Filter row */}
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

      {/* Stats row */}
      <View style={styles.summaryRow}>
        <SummaryBox
          value={raisedCount}
          label="Raised"
          color={c.primary}
          bg={c.blueSoft}
          border={c.primary + '25'}
        />
        <SummaryBox
          value={critCount}
          label="Critical"
          color={c.red}
          bg={c.redSoft}
          border={c.redBorder}
        />
        <SummaryBox
          value={openCount}
          label="Open"
          color={c.warning}
          bg={c.warningSoft}
          border={c.warningBorder}
        />
        <SummaryBox
          value={breakdownRaised}
          label="Breakdown"
          color={c.foreground}
          bg={c.surfaceAlt}
          border={c.border}
        />
      </View>

      {/* Results count */}
      <Text style={[styles.periodHint, { color: c.mutedForeground }]}>
        Showing {displayed.length} of {raisedCount} · {periodLabel}
      </Text>
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

function SummaryBox({
  value,
  label,
  color,
  bg,
  border,
}: {
  value: number;
  label: string;
  color: string;
  bg: string;
  border: string;
}) {
  return (
    <View style={[summaryStyles.box, { backgroundColor: bg, borderColor: border }]}>
      <Text style={[summaryStyles.num, { color }]}>{value}</Text>
      <Text style={[summaryStyles.label, { color: color + 'CC' }]}>{label}</Text>
    </View>
  );
}

const summaryStyles = StyleSheet.create({
  box: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 2,
  },
  num: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 16,
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
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
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
  periodHint: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
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
    width: 42,
    height: 42,
    borderRadius: 12,
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

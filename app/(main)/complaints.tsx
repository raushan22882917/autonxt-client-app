import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { ComplaintFilterSheet } from '@/components/ComplaintFilterSheet';
import { StatusBadge } from '@/components/StatusBadge';
import { TractorImage } from '@/components/TractorImage';
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

function formatResolutionTime(ms: number): string {
  const mins = ms / (1000 * 60);
  if (mins < 60) return `${Math.round(mins)}m`;
  const hours = mins / 60;
  if (hours < 24) return `${hours.toFixed(1).replace('.0', '')}h`;
  const days = hours / 24;
  return `${days.toFixed(1).replace('.0', '')}d`;
}

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

// ── Icon-enhanced summary card ────────────────────────────────────────────
function SummaryCard({
  value,
  label,
  icon,
  color,
  c,
  onPress,
}: {
  value: number;
  label: string;
  icon: string;
  color: string;
  c: ReturnType<typeof useColors>;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[
        summaryStyles.card,
        {
          backgroundColor: c.card, // solid white background for maximum contrast
          borderColor: c.border,
          borderBottomColor: c.primary, // bold red 3D bottom bevel line
          shadowColor: c.primary, // warm ambient brand glow
        },
      ]}
    >
      <Text style={[summaryStyles.label, { color: c.mutedForeground }]}>{label}</Text>
      <View style={summaryStyles.valueContainer}>
        <View style={[summaryStyles.iconWrap, { backgroundColor: color + '10' }]}>
          <Feather name={icon as any} size={20} color={color} />
        </View>
        <Text style={[summaryStyles.value, { color: c.foreground }]}>{value}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ComplaintsScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    tractors,
    filteredComplaints,
    isLoading,
    refresh,
    complaintSearch: search,
    setComplaintSearch: setSearch,
    complaintFilters: filters,
    setComplaintFilters: setFilters,
    complaintFilterOpen: filterSheetOpen,
    setComplaintFilterOpen: setFilterSheetOpen,
    setSelectedPlantID,
    selectedPlantID,
    plants,
  } = useApp();

  React.useEffect(() => {
    setSelectedPlantID(null);
  }, []);

  const [pagePlantOpen, setPagePlantOpen] = useState(false);
  const [dropdownSearch, setDropdownSearch] = useState('');

  const filteredPlantsForDropdown = useMemo(() => {
    if (!dropdownSearch.trim()) return plants;
    const q = dropdownSearch.toLowerCase().trim();
    return plants.filter(
      p =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.location && p.location.toLowerCase().includes(q))
    );
  }, [plants, dropdownSearch]);

  const { width: screenWidth } = useWindowDimensions();

  // Responsive scaling based on device screen width (standard base is 375px)
  const scale = screenWidth / 375;
  const scaleFactor = Math.min(1.5, Math.max(0.95, scale));

  const parentPadding = 18 * scaleFactor;
  const childPaddingV = 16 * scaleFactor;
  const childPaddingH = 18 * scaleFactor;
  const childGap = 12 * scaleFactor;

  const numberFontSize = Math.round(20 * scaleFactor);
  const labelFontSize = Math.round(13 * scaleFactor);
  const dotSize = Math.round(9 * scaleFactor);


  const [showAllModal, setShowAllModal] = useState(false);
  const [modalMode, setModalMode] = useState<'ALL' | 'FILTERED'>('ALL');

  const { period, customMonth, statusTab, severity, breakdownOnly } = filters;
  const activeFilterCount = countActiveComplaintFilters(filters);

  const handleBoxPress = (type: 'TOTAL' | 'RAISED' | 'WIP' | 'CLOSED') => {
    setModalMode('FILTERED');
    setFilters(prev => {
      switch (type) {
        case 'TOTAL':
          return {
            ...prev,
            statusTab: 'ALL',
            severity: 'ALL',
            breakdownOnly: false,
            period: 'ALL',
          };
        case 'RAISED':
          return {
            ...prev,
            statusTab: 'ALL',
            severity: 'ALL',
            breakdownOnly: false,
          };
        case 'WIP':
          return {
            ...prev,
            statusTab: 'IN_PROGRESS',
            severity: 'ALL',
            breakdownOnly: false,
          };
        case 'CLOSED':
          return {
            ...prev,
            statusTab: 'CLOSED',
            severity: 'ALL',
            breakdownOnly: false,
          };
        default:
          return prev;
      }
    });
    setShowAllModal(true);
  };

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

  const sortedAllComplaints = useMemo(() => {
    const sorted = [...filteredComplaints].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    if (!search.trim()) return sorted;
    const q = search.toLowerCase().trim();
    return sorted.filter(c => {
      const hay = [
        c.title,
        c.description,
        c.tractorModel,
        c.tractorID,
        c.plantName,
        c.reportedBy,
        c.problemSubType,
        c.breakdownType,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [filteredComplaints, search]);

  const totalTicketsCount = filteredComplaints.length;
  const raisedCount = inPeriod.length;
  const wipCount = inPeriod.filter(x => x.status === 'IN_PROGRESS').length;
  const closedCount = inPeriod.filter(x => x.status === 'CLOSED' || x.status === 'RESOLVED').length;

  const resolvedInPeriod = inPeriod.filter(
    x => x.resolvedAt && (x.status === 'CLOSED' || x.status === 'RESOLVED')
  );
  const resolvedDurations = resolvedInPeriod
    .map(x => new Date(x.resolvedAt!).getTime() - new Date(x.createdAt).getTime())
    .filter(d => d >= 0);
  const avgResolutionTimeStr =
    resolvedDurations.length > 0
      ? formatResolutionTime(
          resolvedDurations.reduce((sum, d) => sum + d, 0) / resolvedDurations.length
        )
      : '--';

  const renderComplaint = ({ item }: { item: Complaint }) => {
    const sev = severityColor(item.severity, c);
    const isCritical = item.severity === 'CRITICAL';
    const isBreakdown = isBreakdownComplaint(item);
    // Look up the full tractor to get model + color (same as the card header uses)
    const fullTractor = tractors.find(t => t.tractorID === item.tractorID);
    const tractorImageFields = fullTractor
      ? { model: fullTractor.model, color: fullTractor.color }
      : { model: item.tractorModel };

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
        onPress={() => {
          setShowAllModal(false);
          router.push(`/complaint/${item.complaintID}`);
        }}
        accessibilityRole="button"
      >
        {/* Accent stripe — 5px */}
        <View style={[styles.sevStripe, { backgroundColor: c.primary }]} />

        <View style={styles.cardBody}>
          <View style={styles.dateRow}>
            <Feather name="calendar" size={11} color={c.mutedForeground} />
            <Text style={[styles.date, { color: c.mutedForeground }]}>
              {formatDate(item.createdAt)}
            </Text>
          </View>

          {/* Header row */}
          <View style={styles.cardTop}>
            <View style={[styles.iconWrap, { overflow: 'hidden' }]}>
              <TractorImage
                tractor={tractorImageFields}
                colorful={false}
              />
            </View>
            {/* Vertical divider */}
            <View style={[styles.cardDivider, { backgroundColor: c.border }]} />
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
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const ListHeader = (
    <View style={[styles.header, { paddingTop: topPad + 28 }]}>

        {/* Section Heading */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={[styles.sectionAccent, { backgroundColor: c.primary, height: 24 }]} />
            <Text style={[styles.periodHint, { color: c.foreground, fontSize: 21 }]}>
              Issues
            </Text>
          </View>

          {/* Plant Dropdown Button next to Section Title */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#FFFFFF',
              borderColor: '#E2E8F0',
              borderWidth: 1,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 16,
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 4,
              elevation: 1,
            }}
            onPress={() => setPagePlantOpen(true)}
            activeOpacity={0.7}
            disabled={plants.length === 0}
          >
            <View style={{
              width: 20,
              height: 20,
              borderRadius: 6,
              backgroundColor: '#FDF2F4',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Feather name="layers" size={11} color="#7E152F" />
            </View>
            <Text style={{ fontSize: 12, fontFamily: 'Inter_600SemiBold', color: '#1E293B' }} numberOfLines={1}>
              {selectedPlantID ? (plants.find(p => p.plantID === selectedPlantID)?.name ?? 'Selected Plant') : 'All Plants'}
            </Text>
            <Feather name="chevron-down" size={12} color="#7E152F" />
          </TouchableOpacity>
        </View>

        {/* Parent container wrapping the parent 3D box and its overlapping capsule */}
        <View style={{ position: 'relative', marginTop: 14, marginBottom: 20 }}>
          
          {/* Overlapping top-middle capsule showing month/year */}
          <View
            style={{
              position: 'absolute',
              top: -14,
              left: 0,
              right: 0,
              alignItems: 'center',
              zIndex: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => setFilterSheetOpen(true)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#7E152F', '#A82C48']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  borderColor: 'transparent',
                  borderWidth: 0,
                  borderRadius: 20,
                  paddingHorizontal: 14,
                  paddingVertical: 5,
                  overflow: 'hidden',
                  shadowColor: '#000000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.12,
                  shadowRadius: 6,
                  elevation: 4,
                }}
              >
                <Feather name="calendar" size={12} color="#FFFFFF" />
                <Text style={{ fontSize: 11, fontFamily: 'Inter_700Bold', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 0.4 }}>
                  {periodLabel}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Parent container card styled like the image */}
          <View
            style={{
              borderRadius: 24,
              borderWidth: 1,
              borderColor: 'rgba(0, 0, 0, 0.05)',
              paddingTop: parentPadding + 14,
              paddingBottom: parentPadding,
              paddingHorizontal: parentPadding - 4, // slightly less padding for quadrants space
              overflow: 'visible', // Allow capsule to overlap top border
              backgroundColor: '#FFFFFF', // solid white background
              shadowColor: '#120E10',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.04,
              shadowRadius: 16,
              elevation: 4,
            }}
          >
            {/* Row 1 */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* Box 1: Total Tickets */}
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10 * scaleFactor,
                  paddingVertical: 12 * scaleFactor,
                  paddingHorizontal: 4 * scaleFactor,
                }}
                activeOpacity={0.7}
                onPress={() => handleBoxPress('TOTAL')}
              >
                <View
                  style={{
                    width: 32 * scaleFactor,
                    height: 32 * scaleFactor,
                    borderRadius: 16 * scaleFactor,
                    backgroundColor: '#3B82F6', // Blue
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Feather name="file-text" size={14 * scaleFactor} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1, gap: 1 }}>
                  <Text style={{ fontSize: 11.5 * scaleFactor, fontFamily: 'Inter_500Medium', color: '#64748B' }} numberOfLines={2}>
                    Total Tickets
                  </Text>
                  <Text style={{ fontSize: 24 * scaleFactor, fontFamily: 'Inter_700Bold', color: '#0F172A', lineHeight: 28 * scaleFactor }}>
                    {totalTicketsCount}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Vertical Divider */}
              <View style={{ width: 1, backgroundColor: c.border, height: 48 * scaleFactor, alignSelf: 'center' }} />

              {/* Box 2: Ticket Raised */}
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10 * scaleFactor,
                  paddingVertical: 12 * scaleFactor,
                  paddingLeft: 14 * scaleFactor,
                  paddingRight: 4 * scaleFactor,
                }}
                activeOpacity={0.7}
                onPress={() => handleBoxPress('RAISED')}
              >
                <View
                  style={{
                    width: 32 * scaleFactor,
                    height: 32 * scaleFactor,
                    borderRadius: 16 * scaleFactor,
                    backgroundColor: '#8B5CF6', // Purple
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Feather name="inbox" size={14 * scaleFactor} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1, gap: 1 }}>
                  <Text style={{ fontSize: 11.5 * scaleFactor, fontFamily: 'Inter_500Medium', color: '#64748B' }} numberOfLines={2}>
                    Ticket Raised
                  </Text>
                  <Text style={{ fontSize: 24 * scaleFactor, fontFamily: 'Inter_700Bold', color: '#0F172A', lineHeight: 28 * scaleFactor }}>
                    {raisedCount}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Horizontal Divider */}
            <View style={{ height: 1, backgroundColor: c.border, marginVertical: 4 * scaleFactor }} />

            {/* Row 2 */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* Box 3: Work in Progress */}
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10 * scaleFactor,
                  paddingVertical: 12 * scaleFactor,
                  paddingHorizontal: 4 * scaleFactor,
                }}
                activeOpacity={0.7}
                onPress={() => handleBoxPress('WIP')}
              >
                <View
                  style={{
                    width: 32 * scaleFactor,
                    height: 32 * scaleFactor,
                    borderRadius: 16 * scaleFactor,
                    backgroundColor: '#E2A93E', // Yellow/Orange
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Feather name="activity" size={14 * scaleFactor} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1, gap: 1 }}>
                  <Text style={{ fontSize: 11.5 * scaleFactor, fontFamily: 'Inter_500Medium', color: '#64748B' }} numberOfLines={2}>
                    Work in Progress
                  </Text>
                  <Text style={{ fontSize: 24 * scaleFactor, fontFamily: 'Inter_700Bold', color: '#0F172A', lineHeight: 28 * scaleFactor }}>
                    {wipCount}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Vertical Divider */}
              <View style={{ width: 1, backgroundColor: c.border, height: 48 * scaleFactor, alignSelf: 'center' }} />

              {/* Box 4: Closed Resolution Time */}
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10 * scaleFactor,
                  paddingVertical: 12 * scaleFactor,
                  paddingLeft: 14 * scaleFactor,
                  paddingRight: 4 * scaleFactor,
                }}
                activeOpacity={0.7}
                onPress={() => handleBoxPress('CLOSED')}
              >
                <View
                  style={{
                    width: 32 * scaleFactor,
                    height: 32 * scaleFactor,
                    borderRadius: 16 * scaleFactor,
                    backgroundColor: '#7E152F', // Burgundy
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Feather name="clock" size={14 * scaleFactor} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1, gap: 1 }}>
                  <Text style={{ fontSize: 11.5 * scaleFactor, fontFamily: 'Inter_500Medium', color: '#64748B' }} numberOfLines={2}>
                    Closed Resolution Time
                  </Text>
                  <Text style={{ fontSize: 24 * scaleFactor, fontFamily: 'Inter_700Bold', color: '#0F172A', lineHeight: 28 * scaleFactor }}>
                    {avgResolutionTimeStr}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Results count + period */}
        <View style={[styles.resultsRow, { marginBottom: 10 * scaleFactor }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={[styles.sectionAccent, { backgroundColor: c.primary }]} />
            <Text style={[styles.periodHint, { color: c.foreground }]}>
              Tickets <Text style={{ color: c.mutedForeground, fontSize: 12, fontFamily: 'Inter_500Medium' }}>({sortedAllComplaints.length > 5 ? `Showing 5 of ${sortedAllComplaints.length}` : sortedAllComplaints.length})</Text>
            </Text>
          </View>
        </View>
      </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <FlatList
        data={sortedAllComplaints.slice(0, 5)}
        keyExtractor={x => x.complaintID}
        renderItem={renderComplaint}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={
          sortedAllComplaints.length > 5 ? (
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 14,
                backgroundColor: c.card,
                borderColor: c.border,
                borderWidth: 1,
                borderRadius: 16,
                marginTop: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 4,
                elevation: 1,
              }}
              onPress={() => {
                setModalMode('ALL');
                setShowAllModal(true);
              }}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 13, fontFamily: 'Inter_700Bold', color: c.primary }}>
                See All Tickets ({sortedAllComplaints.length})
              </Text>
            </TouchableOpacity>
          ) : null
        }
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor={c.primary} />
        }
        ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
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
              style={[styles.emptyFilterBtn, { borderColor: c.primary + '44', backgroundColor: c.redSoft }]}
              onPress={() => setFilterSheetOpen(true)}
            >
              <Feather name="sliders" size={15} color={c.primary} />
              <Text style={[styles.emptyFilterText, { color: c.primary }]}>Adjust filters</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Page Plant Selector Modal */}
      <Modal
        visible={pagePlantOpen}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setPagePlantOpen(false);
          setDropdownSearch('');
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(18, 14, 16, 0.45)', // dim overlay
            justifyContent: 'flex-end',
          }}
          activeOpacity={1}
          onPress={() => {
            setPagePlantOpen(false);
            setDropdownSearch('');
          }}
        >
          <View
            style={{
              backgroundColor: c.background,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              paddingBottom: insets.bottom + 20,
              paddingTop: 16,
              paddingHorizontal: 20,
              maxHeight: '82%',
              width: '100%',
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: -6 },
              shadowOpacity: 0.15,
              shadowRadius: 16,
              elevation: 20,
            }}
          >
            {/* Sheet Handle */}
            <View style={{ width: 38, height: 5, borderRadius: 2.5, backgroundColor: c.border, alignSelf: 'center', marginBottom: 16 }} />
            
            {/* Title */}
            <Text style={{ fontSize: 16, fontFamily: 'Inter_700Bold', color: c.primary, marginBottom: 16 }}>
              Select Plant
            </Text>

            {/* Inner Dropdown Search */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: c.surfaceAlt,
                borderColor: c.border,
                borderWidth: 1.5,
                borderRadius: 12,
                marginBottom: 14,
                paddingHorizontal: 12,
                height: 40,
              }}
            >
              <Feather name="search" size={15} color={c.mutedForeground} style={{ marginRight: 6 }} />
              <TextInput
                style={{
                  color: c.foreground,
                  fontSize: 14,
                  fontFamily: 'Inter_500Medium',
                  flex: 1,
                  paddingVertical: 0,
                  height: '100%',
                }}
                placeholder="Search plants…"
                placeholderTextColor={c.mutedForeground + '88'}
                value={dropdownSearch}
                onChangeText={setDropdownSearch}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {dropdownSearch.length > 0 && (
                <TouchableOpacity onPress={() => setDropdownSearch('')} hitSlop={8}>
                  <Feather name="x" size={15} color={c.mutedForeground} />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Option: All Plants */}
              {!dropdownSearch.trim() && (
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: !selectedPlantID ? c.primary + '35' : c.border,
                    backgroundColor: !selectedPlantID ? c.primary + '0E' : 'transparent',
                    marginBottom: 10,
                    gap: 12,
                  }}
                  onPress={() => {
                    setSelectedPlantID(null);
                    setPagePlantOpen(false);
                    setDropdownSearch('');
                  }}
                  activeOpacity={0.75}
                >
                  <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: !selectedPlantID ? c.primary : c.surfaceAlt,
                  }}>
                    <Feather name={!selectedPlantID ? 'check' : 'map-pin'} size={14} color={!selectedPlantID ? '#FFFFFF' : c.mutedForeground} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontFamily: 'Inter_700Bold', color: c.foreground }}>
                      All Plants
                    </Text>
                    <Text style={{ fontSize: 10, fontFamily: 'Inter_500Medium', color: c.mutedForeground, marginTop: 1 }}>
                      Entire fleet complaints
                    </Text>
                  </View>
                </TouchableOpacity>
              )}

              {/* Individual Plants */}
              {filteredPlantsForDropdown.map(p => {
                const active = selectedPlantID === p.plantID;
                return (
                  <TouchableOpacity
                    key={p.plantID}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 14,
                      paddingHorizontal: 16,
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: active ? c.primary + '35' : c.border,
                      backgroundColor: active ? c.primary + '0E' : 'transparent',
                      marginBottom: 10,
                      gap: 12,
                    }}
                    onPress={() => {
                      setSelectedPlantID(p.plantID);
                      setPagePlantOpen(false);
                      setDropdownSearch('');
                    }}
                    activeOpacity={0.75}
                  >
                    <View style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: active ? c.primary : c.surfaceAlt,
                    }}>
                      <Feather name={active ? 'check' : 'map-pin'} size={14} color={active ? '#FFFFFF' : c.mutedForeground} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontFamily: 'Inter_700Bold', color: c.foreground }} numberOfLines={1}>
                        {p.name}
                      </Text>
                      <Text style={{ fontSize: 10, fontFamily: 'Inter_500Medium', color: c.mutedForeground, marginTop: 1 }} numberOfLines={1}>
                        {p.location || 'Site'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Pop Window / Bottom Sheet for See All scrollable tickets */}
      <Modal
        visible={showAllModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAllModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { backgroundColor: c.background }]}>
            {/* Modal Header */}
            <View
              style={[
                styles.modalHeader,
                {
                  backgroundColor: c.card, // 3D white background
                  shadowColor: '#120E10',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 5,
                },
              ]}
            >
              {/* Modal Drag Indicator Bar */}
              <View style={[styles.modalDragBar, { backgroundColor: c.border }]} />

              <View style={styles.modalHeaderContent}>
                <Text style={[styles.modalTitle, { color: c.primary }]} numberOfLines={1}>
                  Tickets ({modalMode === 'ALL' ? sortedAllComplaints.length : displayed.length})
                </Text>
                
                <View style={[styles.modalSearchBox, { backgroundColor: c.card, borderColor: c.border, borderWidth: 1.5 }]}>
                  <Feather name="search" size={14} color={c.primary} />
                  <TextInput
                    style={[
                      styles.modalSearchInput,
                      {
                        color: c.primary,
                        height: '100%',
                        paddingVertical: 0,
                        paddingBottom: 3, // Shift up
                        textAlign: 'center',
                      },
                    ]}
                    placeholder="Search..."
                    placeholderTextColor={c.primary + '80'}
                    value={search}
                    onChangeText={setSearch}
                  />
                  {search.length > 0 ? (
                    <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}>
                      <Feather name="x" size={12} color={c.primary} />
                    </TouchableOpacity>
                  ) : null}
                </View>

                {/* Modal Filter Trigger Button */}
                <TouchableOpacity
                  onPress={() => setFilterSheetOpen(true)}
                  style={[
                    styles.modalFilterBtn,
                    {
                      backgroundColor: activeFilterCount > 0 ? c.primary : c.card,
                      borderColor: c.border,
                      borderWidth: 1.5,
                      height: 34,
                      width: 34,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <Feather
                    name="sliders"
                    size={14}
                    color={activeFilterCount > 0 ? c.primaryForeground : c.primary}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowAllModal(false)}
                  style={[
                    styles.modalCloseBtn,
                    {
                      backgroundColor: c.card,
                      borderColor: c.border,
                      borderWidth: 1.5,
                      height: 34,
                      width: 34,
                      borderRadius: 17,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <Feather name="x" size={16} color={c.primary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Scrollable Modal List of Complaints */}
            <FlatList
              data={modalMode === 'ALL' ? sortedAllComplaints : displayed}
              keyExtractor={x => x.complaintID}
              renderItem={renderComplaint}
              contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 40 }}
              ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
              showsVerticalScrollIndicator={true}
            />
          </View>
        </View>
      </Modal>

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
  headerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: 1,
    borderBottomWidth: 3,
    paddingVertical: 8,
    paddingHorizontal: 14,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 10,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  headerBoxLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBoxText: {
    gap: 1,
  },
  headerBoxLabel: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    lineHeight: 14,
  },
  headerBoxValue: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    lineHeight: 17,
  },
  headerBoxRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  gridContainer: {
    borderRadius: 32,
    padding: 26,
    marginVertical: 8,
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 6,
    borderRightWidth: 6,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  grid: {
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 14,
  },
  card: {
    flex: 1,
    borderRadius: 24, // highly rounded corners for premium widget feel
    borderWidth: 1,
    borderBottomWidth: 4, // distinct 3D bottom bevel
    paddingVertical: 26,
    paddingHorizontal: 22,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06, // subtle warm ambient glow
    shadowRadius: 10,
    elevation: 3,
    gap: 12,
  },
  label: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12, // rounded-square tile
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 32, // ultra-bold and readable metric value
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: -0.5,
  },
});

const styles = StyleSheet.create({
  root: { flex: 1 },

  header: {
    gap: 14,
    paddingBottom: 4,
    paddingHorizontal: 0,
  },

  // ── Hero strip ──
  heroStrip: {
    borderRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 7,
  },
  heroGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
    overflow: 'hidden',
    borderRadius: 22,
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
    paddingHorizontal: 0,
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
  summaryContainer: {
    gap: 10,
    marginBottom: 6,
  },
  summarySubRow: {
    flexDirection: 'row',
    gap: 8,
  },
  resultsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  sectionAccent: {
    width: 4,
    height: 16,
    borderRadius: 2,
  },
  periodHint: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },

  // ── Modal / Pop Window ──
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(18, 14, 16, 0.45)', // dim overlay
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    height: '82%',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 20,
  },
  modalDragBar: {
    width: 38,
    height: 5,
    borderRadius: 2.5,
    alignSelf: 'center',
  },
  modalHeader: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 10,
  },
  modalHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSearchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 10,
    borderWidth: 1,
    marginLeft: 8,
    marginRight: 6,
    paddingHorizontal: 8,
    height: 34,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    paddingVertical: 0,
  },
  modalFilterBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
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
    gap: 5,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: -2,
    marginBottom: 6,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    position: 'relative',
  },
  sevCornerBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardDivider: {
    width: 1,
    alignSelf: 'stretch',
    marginVertical: 4,
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
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    lineHeight: 16,
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

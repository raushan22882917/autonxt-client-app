import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  RefreshControl,
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
  const { filteredComplaints, isLoading, refresh } = useApp();
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


  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ComplaintFilterValues>(DEFAULT_COMPLAINT_FILTERS);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [showAllModal, setShowAllModal] = useState(false);

  const { period, customMonth, statusTab, severity, breakdownOnly } = filters;
  const activeFilterCount = countActiveComplaintFilters(filters);

  const handleBoxPress = (type: 'RAISED' | 'CRITICAL' | 'OPEN' | 'BREAKDOWN') => {
    setFilters(prev => {
      switch (type) {
        case 'RAISED':
          return {
            ...prev,
            statusTab: 'ALL',
            severity: 'ALL',
            breakdownOnly: false,
          };
        case 'CRITICAL':
          return {
            ...prev,
            statusTab: 'ALL',
            severity: 'CRITICAL',
            breakdownOnly: false,
          };
        case 'OPEN':
          return {
            ...prev,
            statusTab: 'OPEN',
            severity: 'ALL',
            breakdownOnly: false,
          };
        case 'BREAKDOWN':
          return {
            ...prev,
            statusTab: 'ALL',
            severity: 'ALL',
            breakdownOnly: true,
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
        onPress={() => {
          setShowAllModal(false);
          router.push(`/complaint/${item.complaintID}`);
        }}
        accessibilityRole="button"
      >
        {/* Accent stripe — 5px */}
        <View style={[styles.sevStripe, { backgroundColor: c.primary }]} />

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
    <View style={[styles.header, { paddingTop: topPad + 16 }]}>

      {/* ── Unified Search & Filter Bar ── */}
      <View style={styles.controlArea}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: c.card,
            borderColor: c.border,
            borderWidth: 1.5,
            borderRadius: 14,
            height: 48,
            paddingHorizontal: 12,
            marginBottom: 6,
            shadowColor: c.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          {/* Left Side: Distinct Inner Search Bar */}
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: c.surfaceAlt, // distinct search bar background
              borderRadius: 10,
              height: 34,
              paddingHorizontal: 10,
              marginRight: 12,
            }}
          >
            <Feather name="search" size={14} color={c.mutedForeground} style={{ marginRight: 6 }} />
            <TextInput
              style={[
                styles.searchInput,
                {
                  color: c.foreground,
                  height: '100%',
                  fontSize: 13,
                  paddingVertical: 0,
                  flex: 1,
                },
              ]}
              placeholder="Search..."
              placeholderTextColor={c.mutedForeground + '88'}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}>
                <Feather name="x" size={14} color={c.mutedForeground} />
              </TouchableOpacity>
            )}
          </View>

          {/* Right Side: Clickable Filter Icon + Date Period Text */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              height: '100%',
            }}
            activeOpacity={0.7}
            onPress={() => setFilterSheetOpen(true)}
          >


            {/* Filter icon with badge on top-right */}
            <View style={{ position: 'relative' }}>
              <Feather name="sliders" size={15} color={c.primary} />
              {activeFilterCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: -5,
                    right: -7,
                    backgroundColor: c.primary,
                    borderRadius: 6,
                    minWidth: 12,
                    height: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 2,
                  }}
                >
                  <Text style={{ fontSize: 7, fontFamily: 'Inter_700Bold', color: c.primaryForeground }}>
                    {activeFilterCount}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Parent container wrapping the parent 3D box and its overlapping capsule */}
        <View style={{ position: 'relative', marginTop: 18, marginBottom: 20 }}>
          
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
              {/* Brick background pattern (faint white brick lines for mini scale) */}
              <View style={[StyleSheet.absoluteFillObject, { borderRadius: 20, overflow: 'hidden' }]} pointerEvents="none">
                {/* Horizontal row in middle */}
                <View style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
                
                {/* Vertical joints (alternating brick pattern) */}
                <View style={{ position: 'absolute', top: 0, bottom: '50%', left: '33%', width: 1, backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
                <View style={{ position: 'absolute', top: 0, bottom: '50%', left: '66%', width: 1, backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
                
                <View style={{ position: 'absolute', top: '50%', bottom: 0, left: '16%', width: 1, backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
                <View style={{ position: 'absolute', top: '50%', bottom: 0, left: '50%', width: 1, backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
                <View style={{ position: 'absolute', top: '50%', bottom: 0, left: '83%', width: 1, backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
              </View>

              <Feather name="calendar" size={12} color="#FFFFFF" />
              <Text style={{ fontSize: 11, fontFamily: 'Inter_700Bold', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 0.4 }}>
                {periodLabel}
              </Text>
            </LinearGradient>
          </View>

          {/* Parent 3D container card with colorless background and brick texture */}
          <View
            style={{
              borderRadius: 28,
              borderWidth: 0,
              borderColor: 'transparent',
              paddingTop: parentPadding + 14,
              paddingBottom: parentPadding,
              paddingHorizontal: parentPadding,
              overflow: 'visible', // Allow capsule to overlap top border
              backgroundColor: c.background,
              // Protrusion 3D effect with increased depth (from all four sides)
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.42,
              shadowRadius: 48,
              elevation: 24,
            }}
          >
            {/* Brick background pattern (faint neutral brick lines) */}
            <View style={[StyleSheet.absoluteFillObject, { borderRadius: 28, overflow: 'hidden' }]} pointerEvents="none">
            {/* Horizontal rows */}
            <View style={{ position: 'absolute', top: '20%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(18, 14, 16, 0.04)' }} />
            <View style={{ position: 'absolute', top: '40%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(18, 14, 16, 0.04)' }} />
            <View style={{ position: 'absolute', top: '60%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(18, 14, 16, 0.04)' }} />
            <View style={{ position: 'absolute', top: '80%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(18, 14, 16, 0.04)' }} />
            
            {/* Vertical joints (alternating brick pattern) */}
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
 
          {/* Individual cards inside the parent view, in a 2x2 grid layout */}
          <View style={{ gap: childGap }}>
            {/* Row 1 */}
            <View style={{ flexDirection: 'row', gap: childGap }}>
              {/* Box 1: Raised */}
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: c.card,
                  borderRadius: 16,
                  borderWidth: 1.5,
                  borderColor: c.border,
                  borderBottomWidth: 5,
                  borderBottomColor: c.border,
                  paddingHorizontal: childPaddingH,
                  paddingVertical: childPaddingV,
                  gap: 8 * scaleFactor,
                  shadowColor: c.shadow,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.05,
                  shadowRadius: 6,
                  elevation: 2,
                }}
                activeOpacity={0.7}
                onPress={() => handleBoxPress('RAISED')}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ width: dotSize, height: dotSize, borderRadius: dotSize / 2, backgroundColor: '#3B82F6', marginRight: 8 * scaleFactor }} />
                  <Text style={{ fontSize: labelFontSize, fontFamily: 'Inter_600SemiBold', color: c.foreground }}>
                    Raised Complaints
                  </Text>
                </View>
                <Text style={{ fontSize: numberFontSize, fontFamily: 'SpaceMono_700Bold', color: c.foreground }}>
                  {raisedCount}
                </Text>
              </TouchableOpacity>
 
              {/* Box 2: Critical */}
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: c.card,
                  borderRadius: 16,
                  borderWidth: 1.5,
                  borderColor: c.border,
                  borderBottomWidth: 5,
                  borderBottomColor: c.border,
                  paddingHorizontal: childPaddingH,
                  paddingVertical: childPaddingV,
                  gap: 8 * scaleFactor,
                  shadowColor: c.shadow,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.05,
                  shadowRadius: 6,
                  elevation: 2,
                }}
                activeOpacity={0.7}
                onPress={() => handleBoxPress('CRITICAL')}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ width: dotSize, height: dotSize, borderRadius: dotSize / 2, backgroundColor: '#EF4444', marginRight: 8 * scaleFactor }} />
                  <Text style={{ fontSize: labelFontSize, fontFamily: 'Inter_600SemiBold', color: c.foreground }}>
                    Critical Tickets
                  </Text>
                </View>
                <Text style={{ fontSize: numberFontSize, fontFamily: 'SpaceMono_700Bold', color: '#EF4444' }}>
                  {critCount}
                </Text>
              </TouchableOpacity>
            </View>
 
            {/* Row 2 */}
            <View style={{ flexDirection: 'row', gap: childGap }}>
              {/* Box 3: Open */}
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: c.card,
                  borderRadius: 16,
                  borderWidth: 1.5,
                  borderColor: c.border,
                  borderBottomWidth: 5,
                  borderBottomColor: c.border,
                  paddingHorizontal: childPaddingH,
                  paddingVertical: childPaddingV,
                  gap: 8 * scaleFactor,
                  shadowColor: c.shadow,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.05,
                  shadowRadius: 6,
                  elevation: 2,
                }}
                activeOpacity={0.7}
                onPress={() => handleBoxPress('OPEN')}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ width: dotSize, height: dotSize, borderRadius: dotSize / 2, backgroundColor: '#E2A93E', marginRight: 8 * scaleFactor }} />
                  <Text style={{ fontSize: labelFontSize, fontFamily: 'Inter_600SemiBold', color: c.foreground }}>
                    Awaiting Resolution
                  </Text>
                </View>
                <Text style={{ fontSize: numberFontSize, fontFamily: 'SpaceMono_700Bold', color: '#E2A93E' }}>
                  {openCount}
                </Text>
              </TouchableOpacity>
 
              {/* Box 4: Breakdown */}
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: c.card,
                  borderRadius: 16,
                  borderWidth: 1.5,
                  borderColor: c.border,
                  borderBottomWidth: 5,
                  borderBottomColor: c.border,
                  paddingHorizontal: childPaddingH,
                  paddingVertical: childPaddingV,
                  gap: 8 * scaleFactor,
                  shadowColor: c.shadow,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.05,
                  shadowRadius: 6,
                  elevation: 2,
                }}
                activeOpacity={0.7}
                onPress={() => handleBoxPress('BREAKDOWN')}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ width: dotSize, height: dotSize, borderRadius: dotSize / 2, backgroundColor: '#7E152F', marginRight: 8 * scaleFactor }} />
                  <Text style={{ fontSize: labelFontSize, fontFamily: 'Inter_600SemiBold', color: c.foreground }}>
                    Breakdowns Reported
                  </Text>
                </View>
                <Text style={{ fontSize: numberFontSize, fontFamily: 'SpaceMono_700Bold', color: '#7E152F' }}>
                  {breakdownRaised}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

        {/* Results count + period */}
        <View style={styles.resultsRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={[styles.sectionAccent, { backgroundColor: c.primary }]} />
            <Text style={[styles.periodHint, { color: c.foreground }]}>
              Tickets <Text style={{ color: c.mutedForeground, fontSize: 12, fontFamily: 'Inter_500Medium' }}>({displayed.length > 2 ? `Showing 2 of ${displayed.length}` : displayed.length})</Text>
            </Text>
          </View>
          {displayed.length > 2 && (
            <TouchableOpacity onPress={() => setShowAllModal(true)} activeOpacity={0.7}>
              <Text style={[styles.seeAllText, { color: c.primary }]}>See All</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <FlatList
        data={displayed.slice(0, 2)}
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
              style={[styles.emptyFilterBtn, { borderColor: c.primary + '44', backgroundColor: c.redSoft }]}
              onPress={() => setFilterSheetOpen(true)}
            >
              <Feather name="sliders" size={15} color={c.primary} />
              <Text style={[styles.emptyFilterText, { color: c.primary }]}>Adjust filters</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Pop Window / Bottom Sheet for See All scrollable tickets */}
      <Modal
        visible={showAllModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAllModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { backgroundColor: '#FAF5F0' }]}>
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
                  Tickets ({displayed.length})
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
              data={displayed}
              keyExtractor={x => x.complaintID}
              renderItem={renderComplaint}
              contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 40 }}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
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
    height: '80%',
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

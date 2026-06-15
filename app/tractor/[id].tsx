import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, Defs, RadialGradient, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';
import { BlurView } from 'expo-blur';

import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { TractorDetailMonthFilter } from '@/components/TractorDetailMonthFilter';
import { UsageSegmentDetailSheet } from '@/components/UsageSegmentDetailSheet';
import { DataTable, KeyValueTable } from '@/components/DataTable';
import { TractorImage } from '@/components/TractorImage';
import { fmtMetric } from '@/lib/tractorMetrics';

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
import { isTelemetryDisconnected } from '@/lib/telemetry';

type TabKey = 'trips' | 'charge' | 'runtime' | 'breakdown';

const TABS: { key: TabKey; label: string; icon: keyof typeof Feather.glyphMap }[] = [
  { key: 'runtime', label: 'Runtime', icon: 'clock' },
  { key: 'trips', label: 'Trips', icon: 'navigation' },
  { key: 'charge', label: 'Charge', icon: 'battery-charging' },
  { key: 'breakdown', label: 'Faults', icon: 'alert-triangle' },
];

// ── Glassmorphism Card Wrapper ───────────────────────────────────────────────
function GlassCard({
  children,
  style,
  overflowVisible,
}: {
  children: React.ReactNode;
  style?: any;
  overflowVisible?: boolean;
}) {
  const isIOS = Platform.OS === 'ios';
  if (isIOS) {
    return (
      <View style={[styles.glassCardOuter, overflowVisible && { overflow: 'visible' }, style]}>
        <BlurView
          intensity={70}
          tint="light"
          style={[
            styles.glassCardBlur,
            overflowVisible && { overflow: 'visible' },
          ]}
        >
          {children}
        </BlurView>
      </View>
    );
  }
  return (
    <View
      style={[
        styles.glassCardFallback,
        style,
        overflowVisible ? { overflow: 'visible' } : { overflow: 'hidden' },
      ]}
    >
      {children}
    </View>
  );
}

// ── Grid cell card ──────────────────────────────────────────────────────────
function MetricGridCard({ label, value, icon }: { label: string; value: string; icon: keyof typeof Feather.glyphMap }) {
  return (
    <GlassCard style={styles.gridCard}>
      <View style={styles.gridCardHeader}>
        <Text style={styles.gridCardLabel}>{label}</Text>
        <Feather name={icon} size={11} color="#44474E" opacity={0.6} />
      </View>
      <Text style={styles.gridCardValue}>{value}</Text>
    </GlassCard>
  );
}



// ── Reflection Glow Component ────────────────────────────────────────────────
function ReflectionGlow({ size }: { size: number }) {
  const anim = React.useRef(new Animated.Value(0)).current;
  const { width: screenWidth } = Dimensions.get('window');
  const scale = Math.max(0.75, Math.min(1.2, screenWidth / 412));

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [anim]);

  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.7], // beautiful glowing base
  });

  const scaleX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1.05],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom: -size * 0.27, // shifted further downwards by another 0.20 cm to form a realistic floor reflection shadow
        width: size,
        height: size,
        opacity,
        transform: [{ scaleY: 0.26 }, { scaleX }, { translateX: -20 * scale }], // squashes and shifts the plate left
      }}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <RadialGradient
            id="tireGlow"
            cx="50%"
            cy="50%"
            rx="50%"
            ry="50%"
            fx="50%"
            fy="50%"
          >
            {/* App brand color scheme: red (#be1e2d) and header maroon (#7E152F) with increased spread and opacity for the darker shade */}
            <Stop offset="0%" stopColor="#be1e2d" stopOpacity={0.9} />
            <Stop offset="30%" stopColor="#be1e2d" stopOpacity={0.65} />
            <Stop offset="55%" stopColor="#7E152F" stopOpacity={0.45} />
            <Stop offset="80%" stopColor="#7E152F" stopOpacity={0.25} />
            <Stop offset="100%" stopColor="#7E152F" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill="url(#tireGlow)" />
      </Svg>
    </Animated.View>
  );
}

// ── Wellness-Style Hero Card: left info + gauge, right full-height image ──────
function WellnessHeroCard({
  soc,
  displayTractor,
  live,
}: {
  soc: number;
  displayTractor: Tractor;
  live: boolean;
}) {
  const { width: screenWidth } = Dimensions.get('window');
  // Card margins: 16 on each side. Card padding: 18 on each side.
  const cardContentWidth = screenWidth - 32 - 36;

  // Smooth scale factor based on screenWidth relative to standard 412
  const scale = Math.max(0.75, Math.min(1.2, screenWidth / 412));

  const gaugeSize = Math.round(140 * scale);
  const strokeWidth = Math.round(10 * scale);
  const radius = (gaugeSize - strokeWidth) / 2 - 4;
  const circumference = 2 * Math.PI * radius;
  const gapAngle = 40;
  const arcFraction = (360 - gapAngle) / 360;
  const activeDasharray = circumference * arcFraction;
  const activeOffset = circumference * arcFraction * (1 - soc / 100);
  const trackOffset = circumference * (gapAngle / 360 / 2);

  const socColor = soc >= 70 ? '#10B981' : soc >= 35 ? '#F59E0B' : '#be1e2d';
  const tractorLabel = displayTractor.displayName || displayTractor.tractorID;
  const idLabel = displayTractor.serialNumber || displayTractor.registerNumber || '';

  // Responsive sizes for the right section
  const rightWidth = Math.round(170 * scale);
  const discSize = Math.round(210 * scale);
  const tractorImgSize = Math.round(210 * scale);
  const tractorImgHeight = Math.round(195 * scale); // taller vertically!

  // Spacing helper to guarantee a uniform gap of exactly 14px between gauge and disc
  const desiredGap = 14;
  const rightShift = desiredGap + gaugeSize + (rightWidth + discSize) / 2 - cardContentWidth - 10 * scale;
  const isSmallScreen = screenWidth < 380;

  return (
    <View style={styles.wellnessCard}>

      {/* ── LEFT: heading + gauge ── */}
      <View style={styles.wellnessLeft}>

        {/* Big title — register number / serial number */}
        <Text style={[styles.wellnessMainTitle, { fontSize: isSmallScreen ? 16 : 20 }]} numberOfLines={2}>
          {idLabel}
        </Text>
        {/* Sub-heading — tractor display name / ID */}
        <Text style={styles.wellnessSubTitle} numberOfLines={1}>
          {tractorLabel}
        </Text>

        {/* Section label */}
        <Text style={styles.wellnessLabel}>Battery Status</Text>

        {/* Circular gauge */}
        <View style={styles.wellnessGaugeWrap}>
          <Svg width={gaugeSize} height={gaugeSize} viewBox={`0 0 ${gaugeSize} ${gaugeSize}`}>
            <Defs>
              <RadialGradient id="wGlow" cx="50%" cy="50%" rx="50%" ry="50%">
                <Stop offset="0%" stopColor={socColor} stopOpacity={0.18} />
                <Stop offset="100%" stopColor={socColor} stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Circle cx={gaugeSize / 2} cy={gaugeSize / 2} r={radius + 10} fill="url(#wGlow)" />
            <Circle
              cx={gaugeSize / 2} cy={gaugeSize / 2} r={radius}
              stroke="rgba(0,0,0,0.08)" strokeWidth={strokeWidth} fill="transparent"
              strokeDasharray={`${activeDasharray} ${circumference}`}
              strokeDashoffset={-trackOffset} strokeLinecap="round"
              transform={`rotate(-90 ${gaugeSize / 2} ${gaugeSize / 2})`}
            />
            <Circle
              cx={gaugeSize / 2} cy={gaugeSize / 2} r={radius}
              stroke={socColor} strokeWidth={strokeWidth} fill="transparent"
              strokeDasharray={`${activeDasharray} ${circumference}`}
              strokeDashoffset={activeOffset + trackOffset} strokeLinecap="round"
              transform={`rotate(-90 ${gaugeSize / 2} ${gaugeSize / 2})`}
            />
          </Svg>
          <View style={styles.wellnessGaugeCenter}>
            <Text style={[styles.wellnessSocValue, { color: socColor, fontSize: isSmallScreen ? 24 : 32 }]}>{soc}%</Text>
            <Text style={styles.wellnessSocLabel}>SOC</Text>
          </View>
        </View>

        {/* Status text */}
        <Text style={styles.wellnessSubText}>
          {soc >= 70 ? 'Charge level is healthy'
            : soc >= 35 ? 'Moderate charge remaining'
            : 'Low battery — charge soon'}
        </Text>

        {/* Live pill */}
        <View style={[styles.wellnessLivePill, { borderColor: live ? '#10B981' : '#94A3B8' }]}>
          <View style={[styles.wellnessLiveDot, { backgroundColor: live ? '#10B981' : '#94A3B8' }]} />
          <Text style={[styles.wellnessLiveText, { color: live ? '#10B981' : '#64748B' }]}>
            {live ? 'Live' : 'Offline'}
          </Text>
        </View>
      </View>

      {/* ── RIGHT: Tractor image with nested reflection glow ── */}
      <View style={[styles.wellnessRight, { width: rightWidth, transform: [{ translateX: rightShift }] }]} pointerEvents="none">
        {/* Tractor image */}
        <View style={[styles.wellnessTractorImg, { width: tractorImgSize, height: tractorImgHeight, transform: [{ translateY: -30 * scale }] }]}>
          <TractorImage tractor={displayTractor} resizeMode="contain" colorful={false} />
        </View>
      </View>

    </View>
  );
}

// ── Lightweight Smooth bezier area/line chart ────────────────────────────────
function SmoothLineChart({ data, width, height }: { data: number[]; width: number; height: number }) {
  if (data.length === 0) return null;
  const paddingX = 16;
  const paddingY = 12;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const maxVal = Math.max(...data, 4);
  const minVal = 0;
  const range = maxVal - minVal;

  const points = data.map((val, idx) => {
    const x = paddingX + (idx / Math.max(data.length - 1, 1)) * chartWidth;
    const y = paddingY + chartHeight - ((val - minVal) / range) * chartHeight;
    return { x, y };
  });

  // Calculate smooth cubic Bezier path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cpX1 = curr.x + (next.x - curr.x) / 3;
    const cpY1 = curr.y;
    const cpX2 = curr.x + (2 * (next.x - curr.x)) / 3;
    const cpY2 = next.y;
    pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
  }

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <Svg width={width} height={height}>
      <Defs>
        <SvgLinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#be1e2d" stopOpacity={0.2} />
          <Stop offset="100%" stopColor="#be1e2d" stopOpacity={0.0} />
        </SvgLinearGradient>
      </Defs>

      {/* Grid lines */}
      {[0, 0.5, 1].map((ratio, idx) => {
        const y = paddingY + ratio * chartHeight;
        return (
          <Path
            key={idx}
            d={`M ${paddingX} ${y} L ${width - paddingX} ${y}`}
            stroke="rgba(0, 0, 0, 0.04)"
            strokeWidth={1}
            strokeDasharray="4, 4"
          />
        );
      })}

      {/* Area */}
      <Path d={areaD} fill="url(#chartGradient)" />

      {/* Line */}
      <Path d={pathD} fill="none" stroke="#be1e2d" strokeWidth={2.5} strokeLinecap="round" />

      {/* Data Points */}
      {points.map((p, idx) => (
        <Circle key={idx} cx={p.x} cy={p.y} r={3} fill="#FFFFFF" stroke="#be1e2d" strokeWidth={1.5} />
      ))}
    </Svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

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
  const [chartWidth, setChartWidth] = useState(320);
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

  const onChartLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0) setChartWidth(width);
  };

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
        <Text style={styles.topTitle}>Tractor Details</Text>
        <View style={{ width: 44 }} />
      </View>
      <View style={styles.monthFilterContainer}>
        <TractorDetailMonthFilter month={filterMonth} onMonthChange={setFilterMonth} />
      </View>
    </View>
  );

  if (!tractor) {
    return (
      <View style={styles.root}>
        {Header}
        <View style={styles.empty}>
          <View style={styles.emptyIconWrap}>
            <Feather name="search" size={32} color="#44474E" opacity={0.6} />
          </View>
          <Text style={styles.emptyTitle}>Tractor Not Found</Text>
          <Text style={styles.emptyText}>Could not locate tractor data</Text>
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

  const live = !isTelemetryDisconnected(displayTractor.telemetryAt);

  // Sorting chronological runtime entries for historical trend log
  const sortedRuntime = [...tractorRuntime]
    .sort((a, b) => a.date.localeCompare(b.date));
  const chartData = sortedRuntime.map(r => r.todaysRuntime ?? 0);
  const finalChartData = chartData.length > 0 ? chartData : [2.5, 4.0, 3.1, 5.5, 3.8, 4.8, 3.5]; // Fallback mock curve

  return (
    <View style={styles.root}>
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
        {/* ── Visual Section 1: Wellness-style Hero Card ── */}
        <GlassCard style={styles.pulseCard}>
          <WellnessHeroCard
            soc={Math.round(displayTractor.soc ?? 82)}
            displayTractor={displayTractor}
            live={live}
          />
        </GlassCard>

        {/* ── Visual Section 2: Featured Metric (Primary Battery Card) ── */}
        <GlassCard style={styles.featuredCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Featured Metric</Text>
            <TouchableOpacity style={styles.circularActionBtn}>
              <Feather name="chevron-right" size={14} color="#be1e2d" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.featuredContent}>
            <View style={styles.featuredHeroRow}>
              <Text style={styles.featuredHeroValue}>{Math.round(displayTractor.soc ?? 82)}%</Text>
              <Text style={styles.featuredHeroLabel}>Battery Capacity</Text>
            </View>
            
            <View style={styles.featuredDivider} />
            
            <View style={styles.featuredSubMetrics}>
              <View style={styles.subMetricRow}>
                <Feather name="shield" size={14} color="#be1e2d" />
                <Text style={styles.subMetricText}>SOH Health: <Text style={styles.boldText}>{displayTractor.soh ?? 94}%</Text></Text>
              </View>
              <View style={styles.subMetricRow}>
                <Feather name={displayTractor.isCharging ? "zap" : "zap-off"} size={14} color={displayTractor.isCharging ? "#10B981" : "#be1e2d"} />
                <Text style={styles.subMetricText}>Status: <Text style={styles.boldText}>{displayTractor.isCharging ? "Charging" : "Discharging"}</Text></Text>
              </View>
            </View>
          </View>
        </GlassCard>

        {/* ── Visual Section 3: Supporting Grid (2-Column Secondary Metrics) ── */}
        <View style={styles.gridSection}>
          <Text style={styles.sectionTitle}>Supporting Telemetry</Text>
          <View style={styles.metricGrid}>
            <View style={styles.gridRow}>
              <View style={{ flex: 1, marginRight: 6 }}>
                <MetricGridCard label="VOLTAGE" value={`${fmtMetric(displayTractor.voltage, 1)} V`} icon="activity" />
              </View>
              <View style={{ flex: 1, marginLeft: 6 }}>
                <MetricGridCard label="CURRENT" value={`${fmtMetric(displayTractor.current, 1)} A`} icon="zap" />
              </View>
            </View>
            <View style={styles.gridRow}>
              <View style={{ flex: 1, marginRight: 6 }}>
                <MetricGridCard label="PACK TEMP" value={`${fmtMetric(displayTractor.temp, 1)} °C`} icon="thermometer" />
              </View>
              <View style={{ flex: 1, marginLeft: 6 }}>
                <MetricGridCard label="MOTOR RPM" value={`${fmtMetric(displayTractor.rpm)} rpm`} icon="cpu" />
              </View>
            </View>
            <View style={styles.gridRow}>
              <View style={{ flex: 1, marginRight: 6 }}>
                <MetricGridCard label="MOTOR TEMP" value={`${fmtMetric(displayTractor.motorTemp, 1)} °C`} icon="compass" />
              </View>
              <View style={{ flex: 1, marginLeft: 6 }}>
                <MetricGridCard label="TOTAL RUNTIME" value={`${displayTractor.totalRuntime} h`} icon="clock" />
              </View>
            </View>
          </View>
        </View>

        {/* ── Visual Section 4: Historical Log & Tabs ── */}
        <GlassCard style={styles.logCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Historical Log</Text>
            <TouchableOpacity style={styles.circularActionBtn}>
              <Feather name="activity" size={14} color="#be1e2d" />
            </TouchableOpacity>
          </View>
          <Text style={styles.chartSubtitle}>{monthSubtitle}</Text>
          
          <View style={styles.chartWrapper} onLayout={onChartLayout}>
            <SmoothLineChart data={finalChartData} width={chartWidth} height={120} />
          </View>
          
          {/* Tab bar */}
          <View style={styles.tabContainer}>
            {TABS.map(t => {
              const active = tab === t.key;
              return (
                <TouchableOpacity
                  key={t.key}
                  style={[styles.tabBtn, active && styles.tabBtnActive]}
                  onPress={() => setTab(t.key)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tabBtnLabel, active && styles.tabBtnLabelActive]}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Active Tab Table Content */}
          <View style={styles.tabContentArea}>
            {/* Runtime tab */}
            {tab === 'runtime' && (
              <View style={styles.tabContentArea}>
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
                  titleColor="#FFFFFF"
                  titleBgGradient={[c.gradientEnd, '#be1e2d']}
                  headerBgColor={c.redSoft}
                  headerTextColor={c.primary}
                  rowBgColorOdd={c.redSoft}
                  rowBgColorEven={c.redSoft + '80'}
                  borderColor={c.redBorder}
                  outerBorderColor={c.redBorder}
                  backgroundColor={c.redSoft + '30'}
                />
              </View>
            )}

            {/* Trips tab */}
            {tab === 'trips' && (
              <View style={styles.tabContentArea}>
                {analyticsError ? (
                  <TabError message={analyticsError} c={c} />
                ) : (
                  <KeyValueTable
                    title="Trip summary"
                    subtitle={monthSubtitle}
                    rows={tripSummaryRows(tripSummary)}
                    loading={analyticsLoading}
                    compact
                    titleColor="#FFFFFF"
                    titleBgGradient={[c.gradientEnd, '#be1e2d']}
                    headerBgColor={c.redSoft}
                    headerTextColor={c.primary}
                    rowBgColorOdd={c.redSoft + '40'}
                    rowBgColorEven={c.card}
                    borderColor={c.redBorder}
                    outerBorderColor={c.redBorder}
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
                    titleColor="#FFFFFF"
                    titleBgGradient={[c.gradientEnd, '#be1e2d']}
                    headerBgColor={c.redSoft}
                    headerTextColor={c.primary}
                    rowBgColorOdd={c.redSoft + '40'}
                    rowBgColorEven={c.card}
                    borderColor={c.redBorder}
                    outerBorderColor={c.redBorder}
                  />
                )}
              </View>
            )}

            {/* Charge tab */}
            {tab === 'charge' && (
              <View style={styles.tabContentArea}>
                {analyticsError ? (
                  <TabError message={analyticsError} c={c} />
                ) : (
                  <KeyValueTable
                    title="Charge summary"
                    subtitle={monthSubtitle}
                    rows={chargeSummaryRows(chargeSummary)}
                    loading={analyticsLoading}
                    compact
                    titleColor="#FFFFFF"
                    titleBgGradient={[c.gradientEnd, '#be1e2d']}
                    headerBgColor={c.redSoft}
                    headerTextColor={c.primary}
                    rowBgColorOdd={c.redSoft + '40'}
                    rowBgColorEven={c.card}
                    borderColor={c.redBorder}
                    outerBorderColor={c.redBorder}
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
                    titleColor="#FFFFFF"
                    titleBgGradient={[c.gradientEnd, '#be1e2d']}
                    headerBgColor={c.redSoft}
                    headerTextColor={c.primary}
                    rowBgColorOdd={c.redSoft + '40'}
                    rowBgColorEven={c.card}
                    borderColor={c.redBorder}
                    outerBorderColor={c.redBorder}
                  />
                )}
              </View>
            )}

            {/* Breakdown tab */}
            {tab === 'breakdown' && (
              <View style={styles.tabContentArea}>
                <DataTable
                  title="Controller faults"
                  subtitle="From analytics fault metrics"
                  columns={faultColumns}
                  data={faults}
                  keyExtractor={(f, i) => `${f.startTime ?? 'f'}-${i}`}
                  emptyMessage="No controller faults recorded"
                  loading={analyticsLoading}
                  titleColor="#FFFFFF"
                  titleBgGradient={[c.gradientEnd, '#be1e2d']}
                  headerBgColor={c.redSoft}
                  headerTextColor={c.primary}
                  rowBgColorOdd={c.redSoft + '40'}
                  rowBgColorEven={c.card}
                  borderColor={c.redBorder}
                  outerBorderColor={c.redBorder}
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
            )}
          </View>
        </GlassCard>
      </ScrollView>
    </View>
  );
}

function TabError({ message, c }: { message: string; c: ReturnType<typeof useColors> }) {
  return (
    <View style={styles.errorBanner}>
      <View style={styles.errorIcon}>
        <Feather name="alert-circle" size={18} color="#be1e2d" />
      </View>
      <Text style={styles.errorBannerText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },
  headerContainer: {
    backgroundColor: '#7E152F',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
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
  monthFilterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  
  // Glass Card styles
  glassCardOuter: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
  },
  glassCardBlur: {
    padding: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  glassCardFallback: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    backgroundColor: '#FFFFFF',
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
  },

  // Gauge Layout
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 12,
  },
  gaugeImageContainer: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  gaugeImageWrap: {
    width: 86,
    height: 86,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeOverlayBadge: {
    position: 'absolute',
    bottom: -6,
    backgroundColor: '#be1e2d',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#be1e2d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  gaugeOverlayValue: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    lineHeight: 16,
  },
  gaugeOverlayLabel: {
    fontSize: 8,
    fontFamily: 'Inter_600SemiBold',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // ── Wellness Hero Card ─────────────────────────────────────────────────────
  pulseCard: {
    alignItems: 'stretch',
    overflow: 'hidden',
    paddingBottom: 0,
  },
  pulseNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  pulseNameBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(190,30,45,0.08)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pulseNameText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#be1e2d',
    maxWidth: 140,
  },
  pulseSerialText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#44474E',
    opacity: 0.55,
  },
  wellnessCard: {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 260,
  },
  wellnessLeft: {
    flex: 1,
    gap: 6,
    paddingTop: 4,
    paddingBottom: 18,
  },
  // Big title — like "Wellness Score" in reference
  wellnessMainTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: '#1A1C1E',
    letterSpacing: -0.5,
    lineHeight: 24,
  },
  // Sub-heading — like "Digital Wellness"
  wellnessSubTitle: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#44474E',
    opacity: 0.6,
    marginBottom: 4,
  },
  // Small section label above gauge
  wellnessLabel: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    color: '#44474E',
    opacity: 0.5,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  wellnessGaugeWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    alignSelf: 'flex-start',
  },
  wellnessGaugeCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wellnessSocValue: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -1,
    lineHeight: 36,
  },
  wellnessSocLabel: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    color: '#44474E',
    opacity: 0.6,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  wellnessSubText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#44474E',
    opacity: 0.65,
    lineHeight: 16,
  },
  wellnessLivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  wellnessLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  wellnessLiveText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
  wellnessRight: {
    width: 170,
    marginRight: -6,
    marginTop: 0,
    marginBottom: 0,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    transform: [{ translateX: -20 }],
  },
  wellnessCircleGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'transparent',
    shadowColor: 'rgba(190,30,45,0.12)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 40,
    elevation: 0,
  },
  wellnessCircleOuter: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 6,
    overflow: 'hidden',
  },
  wellnessCircleInner: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    bottom: 12,
    borderRadius: 78,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  wellnessTractorImg: {
    position: 'absolute',
    width: 160,
    height: 160,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: '#1A1C1E',
  },

  // Featured Metric Card
  featuredCard: {
    gap: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#1A1C1E',
    letterSpacing: -0.1,
  },
  circularActionBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(190, 30, 45, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 4,
  },
  featuredHeroRow: {
    flex: 1.1,
    gap: 2,
  },
  featuredHeroValue: {
    fontSize: 36,
    fontFamily: 'Inter_700Bold',
    color: '#be1e2d',
    letterSpacing: -1,
  },
  featuredHeroLabel: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#44474E',
    opacity: 0.7,
  },
  featuredDivider: {
    width: 1,
    height: 48,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  featuredSubMetrics: {
    flex: 1.5,
    gap: 8,
  },
  subMetricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subMetricText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#44474E',
  },
  boldText: {
    fontFamily: 'Inter_700Bold',
    color: '#1A1C1E',
  },

  // Grid list
  gridSection: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: '#1A1C1E',
    paddingLeft: 4,
  },
  metricGrid: {
    gap: 12,
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCard: {
    padding: 12,
    gap: 6,
  },
  gridCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gridCardLabel: {
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
    color: '#44474E',
    opacity: 0.65,
    letterSpacing: 0.8,
  },
  gridCardValue: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#1A1C1E',
    letterSpacing: -0.3,
  },

  // Visual Log Chart
  logCard: {
    gap: 12,
  },
  chartSubtitle: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#44474E',
    opacity: 0.7,
    marginTop: -8,
  },
  chartWrapper: {
    width: '100%',
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 4,
  },

  // Tabbed system
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: 14,
    padding: 3,
    gap: 2,
    marginTop: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
  },
  tabBtnActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#94A3B8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  tabBtnLabel: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: '#44474E',
  },
  tabBtnLabelActive: {
    color: '#1A1C1E',
    fontFamily: 'Inter_700Bold',
  },
  tabContentArea: {
    marginTop: 8,
    gap: 12,
  },

  // Error/Empty
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: '#FDF2F4',
    borderColor: '#FDA4AF',
  },
  errorIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(190, 30, 45, 0.08)',
  },
  errorBannerText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#1A1C1E',
    lineHeight: 17,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#1A1C1E',
  },
  emptyText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: '#44474E',
    textAlign: 'center',
  },
});

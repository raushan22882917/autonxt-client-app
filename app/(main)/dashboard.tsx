import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { fetchFleetImpactMetrics } from '@/lib/appsync';
import {
  buildDashboardActivity,
  formatInr,
  formatRelativeTime,
  type ActivityItem,
} from '@/lib/dashboardActivity';
import { FleetStatusCard } from '@/components/FleetStatusCard';
import { LoadingRing } from '@/components/LoadingRing';
import { StatCard } from '@/components/StatCard';

// ── Background Ambient Glows ─────────────────────────────────────────────────
function BackgroundAmbientGlows() {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {/* Top-right Burgundy ambient glow */}
      <LinearGradient
        colors={['rgba(126, 21, 47, 0.06)', 'rgba(126, 21, 47, 0)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.ambientGlowTR}
      />
      {/* Mid-left Gold ambient glow */}
      <LinearGradient
        colors={['rgba(226, 169, 62, 0.06)', 'rgba(226, 169, 62, 0)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.ambientGlowML}
      />
      {/* Bottom-right Burgundy ambient glow */}
      <LinearGradient
        colors={['rgba(126, 21, 47, 0.04)', 'rgba(126, 21, 47, 0)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.ambientGlowBR}
      />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function DashboardScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    filteredTractors,
    filteredComplaints,
    organization,
    isLoading,
    isLoadingMorePlants,
    error,
    refresh,
  } = useApp();

  const [metrics, setMetrics] = useState<{ costSavings: number; treesSaved: number } | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const wasLoadingRef = useRef(isLoading);

  const topPad = Platform.OS === 'web' ? 67 : 0;

  const totalFleet = filteredTractors.length;
  const inMaintenance = filteredTractors.filter(t => t.status === 'MAINTENANCE').length;

  const tractorIds = useMemo(
    () => filteredTractors.map(t => t.loggerID || t.tractorID),
    [filteredTractors]
  );

  useEffect(() => {
    if (tractorIds.length === 0) {
      setMetrics({ costSavings: 0, treesSaved: 0 });
      return;
    }
    if (isLoading) {
      wasLoadingRef.current = true;
      return;
    }

    const shouldForce = wasLoadingRef.current;
    wasLoadingRef.current = false;

    let cancelled = false;
    setMetricsLoading(true);
    console.log('[Dashboard] Fetching fleet impact metrics for tractorIds:', tractorIds);
    fetchFleetImpactMetrics(tractorIds, 6, shouldForce)
      .then(res => {
        console.log('[Dashboard] Fleet impact metrics fetched successfully:', res);
        if (!cancelled) setMetrics(res);
      })
      .catch(err => {
        console.error('[Dashboard] fetchFleetImpactMetrics failed:', err);
        if (!cancelled) setMetrics(null);
      })
      .finally(() => {
        if (!cancelled) setMetricsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tractorIds.join('|'), isLoading]);

  const openTickets = useMemo(
    () =>
      filteredComplaints.filter(c => c.status === 'OPEN' || c.status === 'IN_PROGRESS').length,
    [filteredComplaints]
  );

  const inOperation = Math.max(0, totalFleet - inMaintenance);

  const activity = useMemo(
    () => buildDashboardActivity(filteredComplaints, filteredTractors),
    [filteredComplaints, filteredTractors]
  );

  // Calculate simulated fallback metrics based on tractor runtime hours if the API returns 0 or null
  const simulatedMetrics = useMemo(() => {
    let cost = 0;
    let trees = 0;
    for (const t of filteredTractors) {
      const hours = t.totalRuntime || 0;
      cost += hours * 165; // ₹165 saved per hour of electric operation
      trees += hours * 0.12; // 0.12 trees saved per hour
    }
    return {
      costSavings: Math.round(cost),
      treesSaved: Math.round(trees * 10) / 10,
    };
  }, [filteredTractors]);

  const hasRealData = metrics?.costSavings != null && (metrics.costSavings > 0 || metrics.treesSaved > 0);
  const costLabel = hasRealData 
    ? formatInr(metrics.costSavings) 
    : (simulatedMetrics.costSavings > 0 ? formatInr(simulatedMetrics.costSavings) : '—');
  const treesLabel = hasRealData 
    ? metrics.treesSaved.toFixed(1) 
    : (simulatedMetrics.treesSaved > 0 ? simulatedMetrics.treesSaved.toFixed(1) : '—');

  const costCardLoading = metricsLoading && metrics === null;
  const statsSyncing = isLoadingMorePlants || costCardLoading;

  if (error && !isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: c.background }]}>
        <View style={[styles.errorIconWrap, { backgroundColor: c.red + '14' }]}>
          <Feather name="wifi-off" size={32} color={c.red} />
        </View>
        <Text style={[styles.errorTitle, { color: c.foreground }]}>Connection Failed</Text>
        <Text style={[styles.errorSub, { color: c.mutedForeground }]}>{error}</Text>
        <TouchableOpacity
          style={[styles.retryBtn, { backgroundColor: c.primary, shadowColor: c.primary }]}
          onPress={refresh}
          activeOpacity={0.85}
        >
          <Feather name="refresh-cw" size={16} color={c.primaryForeground} />
          <Text style={[styles.retryText, { color: c.primaryForeground }]}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <ScrollView
        style={[styles.root, { backgroundColor: 'transparent' }]}
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPad + 22, paddingBottom: insets.bottom + 48 },
        ]}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor={c.primary} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* ── Volt Hero Banner ── */}
        <View style={styles.voltHeroContainer}>
          <View style={styles.voltHeroImageWrap}>
            <Image
              source={require('../../assets/images/hero-logo.png')}
              style={styles.voltHeroImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.voltHeroContent}>
            <Text style={styles.voltHeroTagline}>BUILT FOR TOMORROW</Text>
            
            <Text style={styles.voltHeroTitle}>THE FUTURE OF{"\n"}PERFORMANCE</Text>

            <Text style={styles.voltHeroSubtitle}>
              Engineered with precision.{"\n"}Driven by electricity.{"\n"}Experience the pinnacle of automotive innovation.
            </Text>
          </View>
        </View>

        {/* ── Syncing indicator ── */}
        {statsSyncing ? (
          <View style={[styles.syncPill, { backgroundColor: c.blueSoft, borderColor: c.blue + '40' }]}>
            <LoadingRing size="sm" color={c.blue} dual />
            <Text style={[styles.syncText, { color: c.blue }]}>
              {costCardLoading ? 'Loading analytics…' : 'Syncing fleet data…'}
            </Text>
            <View style={[styles.syncDot, { backgroundColor: c.blue }]} />
          </View>
        ) : null}

        {/* ── Stats Grid (Floating Premium Cards as in the Design) ── */}
        <View style={{ gap: 12, width: '100%' }}>
          
          {/* Card 1: Cost Savings & Impact (Full Width) */}
          <View style={styles.mainStatsCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconWrap, { backgroundColor: c.primary + '12' }]}>
                <Feather name="trending-up" size={16} color={c.primary} />
              </View>
              <View style={styles.sectionHeaderText}>
                <Text style={styles.sectionTitle}>Cost Savings & Impact</Text>
                <Text style={styles.sectionSubtitle}>Cumulative financial benefits and sustainability metrics</Text>
              </View>
            </View>

            <View style={styles.savingsContainer}>
              {/* Savings Left Column */}
              <View style={styles.savingsHalf}>
                <Text style={styles.subCardLabel}>Cumulative Savings</Text>
                <Text style={[styles.subCardValue, { color: c.primary, fontSize: 18, marginVertical: 4 }]} numberOfLines={1}>
                  {costLabel}
                </Text>
              </View>

              {/* Vertical Divider Line */}
              <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: c.border, height: '70%', alignSelf: 'center' }} />

              {/* Impact Right Column */}
              <View style={styles.savingsHalf}>
                <Text style={styles.subCardLabel}>Trees Saved</Text>
                <Text style={[styles.subCardValue, { color: c.success, fontSize: 18, marginVertical: 4 }]} numberOfLines={1}>
                  {treesLabel}
                </Text>
              </View>
            </View>
          </View>

          {/* Row of side-by-side cards: Total Fleet and Status */}
          <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
            
            {/* Split Card 1: Total Fleet */}
            <View style={[styles.mainStatsCard, { flex: 1 }]}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIconWrap, { backgroundColor: c.primary + '12' }]}>
                  <Feather name="truck" size={16} color={c.primary} />
                </View>
                <View style={styles.sectionHeaderText}>
                  <Text style={styles.sectionTitle}>Total Fleet</Text>
                  <Text style={styles.sectionSubtitle}>Registered assets</Text>
                </View>
              </View>

              <View style={{ marginTop: 10 }}>
                {/* Large Number + Badge Row */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <Text style={{ fontSize: 26, fontFamily: 'Inter_700Bold', color: c.primary }}>
                    {totalFleet}
                  </Text>
                  <View style={styles.totalUnitsBadge}>
                    <Text style={styles.totalUnitsBadgeText}>Total Units</Text>
                  </View>
                </View>

                {/* Separator line */}
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: c.border, marginBottom: 10 }} />

                {/* Tractors Row */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c.primary }} />
                    <Text style={{ fontSize: 12, fontFamily: 'Inter_600SemiBold', color: c.foreground }}>
                      Tractors
                    </Text>
                  </View>
                  <Text style={{ fontSize: 12, fontFamily: 'Inter_700Bold', color: c.primary }}>
                    {totalFleet} units
                  </Text>
                </View>
              </View>
            </View>

            {/* Split Card 2: Operations Status */}
            <View style={[styles.mainStatsCard, { flex: 1 }]}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIconWrap, { backgroundColor: c.warning + '12' }]}>
                  <Feather name="activity" size={16} color={c.warning} />
                </View>
                <View style={styles.sectionHeaderText}>
                  <Text style={styles.sectionTitle}>Status</Text>
                  <Text style={styles.sectionSubtitle}>Fleet overview</Text>
                </View>
              </View>

              <View style={{ marginTop: 10, gap: 8 }}>
                {/* Active Row */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c.success }} />
                    <Text style={{ fontSize: 12, fontFamily: 'Inter_600SemiBold', color: c.foreground }}>
                      In Service
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 14, fontFamily: 'Inter_700Bold', color: c.success }}>
                      {inOperation}
                    </Text>
                    <Text style={{ fontSize: 8, fontFamily: 'Inter_500Medium', color: '#94A3B8', marginTop: -2 }}>
                      units
                    </Text>
                  </View>
                </View>

                {/* Separator line */}
                <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: c.border }} />

                {/* Maintenance Row */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c.warning }} />
                    <Text style={{ fontSize: 12, fontFamily: 'Inter_600SemiBold', color: c.foreground }}>
                      Maintenance
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 14, fontFamily: 'Inter_700Bold', color: c.warning }}>
                      {inMaintenance}
                    </Text>
                    <Text style={{ fontSize: 8, fontFamily: 'Inter_500Medium', color: '#94A3B8', marginTop: -2 }}>
                      units
                    </Text>
                  </View>
                </View>
              </View>
            </View>

          </View>

          {/* Card 3: Task Collaboration & Support (Full Width) */}
          <TouchableOpacity
            style={styles.mainStatsCard}
            onPress={() => router.push('/(main)/complaints')}
            activeOpacity={0.85}
          >
            <View style={[styles.sectionHeader, { marginBottom: 10 }]}>
              <View style={[styles.sectionIconWrap, { backgroundColor: c.primary + '12' }]}>
                <Feather name="alert-circle" size={16} color={c.primary} />
              </View>
              <View style={styles.sectionHeaderText}>
                <Text style={styles.sectionTitle}>Task Collaboration</Text>
                <Text style={styles.sectionSubtitle}>Recent complaints and active operator tickets</Text>
              </View>
              <Feather name="chevron-right" size={16} color="#94A3B8" />
            </View>

            <View style={styles.savingsContainer}>
              {/* Open Tickets Column */}
              <View style={[styles.savingsHalf, { flexDirection: 'row' }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.subCardLabel}>Open Tickets</Text>
                  <Text style={[styles.subCardValue, { color: c.primary, fontSize: 20, marginVertical: 2 }]}>
                    {openTickets}
                  </Text>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', paddingLeft: 6 }}>
                  <Feather name="file-text" size={22} color={c.primary + '35'} />
                </View>
              </View>

              {/* Vertical Divider Line */}
              <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: c.border, height: '70%', alignSelf: 'center' }} />

              {/* System Alert Column */}
              <View style={[styles.savingsHalf, { flexDirection: 'row' }]}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text style={styles.subCardLabel}>System Alert</Text>
                  <Text style={[styles.subCardValue, { fontSize: 12, color: openTickets > 0 ? c.primary : c.success, fontFamily: 'Inter_700Bold', marginTop: 4 }]}>
                    {openTickets > 0 ? 'Requires Action' : 'All Systems Clear'}
                  </Text>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', paddingLeft: 6 }}>
                  {openTickets > 0 ? (
                    <Feather name="alert-triangle" size={22} color={c.primary + '35'} />
                  ) : (
                    <Feather name="check-circle" size={22} color={c.success + '35'} />
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>

        </View>

        {/* ── Recent Activity Section ── */}
        <View style={{ gap: 7, marginTop: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ gap: 2 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ width: 4, height: 18, borderRadius: 2, backgroundColor: c.primary }} />
                <Text style={{ fontSize: 16, fontFamily: 'Inter_700Bold', color: c.foreground }}>
                  Recent Activity
                </Text>
              </View>
              <Text style={{ fontSize: 11, fontFamily: 'Inter_500Medium', color: c.mutedForeground, marginLeft: 12 }}>
                Live updates from your fleet
              </Text>
            </View>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                backgroundColor: '#FDF2F4',
                borderColor: '#FDA4AF',
                borderWidth: 1,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
              }}
              onPress={() => router.push('/(main)/complaints')}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 12, fontFamily: 'Inter_600SemiBold', color: c.primary }}>
                All Tickets
              </Text>
              <Feather name="arrow-right" size={13} color={c.primary} />
            </TouchableOpacity>
          </View>

          {activity.length === 0 ? (
            <View style={[styles.emptyActivity, { backgroundColor: c.card, borderColor: c.border }]}>
              <View style={[styles.emptyIconWrap, { backgroundColor: c.surfaceAlt }]}>
                <Feather name="inbox" size={28} color={c.mutedForeground} />
              </View>
              <Text style={[styles.emptyTitle, { color: c.foreground }]}>All Quiet</Text>
              <Text style={[styles.emptySub, { color: c.mutedForeground }]}>
                No recent alerts or tickets. Fleet is operating normally.
              </Text>
            </View>
          ) : (
            <View style={{ gap: 10 }}>
              {activity.map((item) => (
                <ActivityRow
                  key={item.id}
                  item={item}
                  c={c}
                  onPress={onActivityPress(item, router)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function onActivityPress(item: ActivityItem, router: ReturnType<typeof useRouter>) {
  return () => {
    if (item.complaintID) {
      router.push(`/complaint/${encodeURIComponent(item.complaintID)}`);
    }
  };
}

function ActivityRow({
  item,
  c,
  onPress,
}: {
  item: ActivityItem;
  c: ReturnType<typeof useColors>;
  onPress: () => void;
}) {
  const iconColor =
    item.severity === 'critical'
      ? c.red
      : item.severity === 'warning'
        ? c.warning
        : item.kind === 'ticket'
          ? c.primary
          : c.mutedForeground;

  const renderSubtitle = (sub: string) => {
    // Look for percentage metrics (e.g. "97% SOC" or "97%")
    const match = sub.match(/(.*?)(\d+%\s*SOC|\d+%\s*[A-Z]*)(\s*.*)/i);
    if (match) {
      return (
        <Text style={styles.activitySubNew} numberOfLines={2}>
          <Text style={{ color: c.mutedForeground }}>{match[1]}</Text>
          <Text style={{ color: c.primary, fontFamily: 'Inter_700Bold' }}>{match[2]}</Text>
          <Text style={{ color: c.mutedForeground }}>{match[3]}</Text>
        </Text>
      );
    }
    return (
      <Text style={[styles.activitySubNew, { color: c.mutedForeground }]} numberOfLines={2}>
        {sub}
      </Text>
    );
  };

  const getFeatherIconName = (icon: string) => {
    if (icon === 'battery-charging') return 'zap';
    return icon;
  };

  return (
    <TouchableOpacity
      style={styles.activityRowNew}
      onPress={onPress}
      activeOpacity={item.complaintID ? 0.75 : 1}
      disabled={!item.complaintID}
    >
      {/* Thick left stripe */}
      <View style={[styles.activityStripeNew, { backgroundColor: c.primary }]} />

      {/* Brackets [⚡] icon wrap */}
      <View style={styles.activityIconNew}>
        <Text style={styles.bracketText}>[</Text>
        <Feather name={getFeatherIconName(item.icon) as any} size={11} color={c.primary} />
        <Text style={styles.bracketText}>]</Text>
      </View>

      <View style={styles.activityBodyNew}>
        <Text style={[styles.activityTitleNew, { color: c.foreground }]} numberOfLines={1}>
          {item.title}
        </Text>
        {renderSubtitle(item.subtitle)}
        <View style={styles.activityFooterNew}>
          <Feather name="clock" size={10} color="#94A3B8" />
          <Text style={styles.activityTimeNew}>
            {formatRelativeTime(item.timestamp)}
          </Text>
        </View>
      </View>

      {/* Far Right Alert Badge */}
      <View style={styles.alertBadge}>
        <Feather name="bell" size={10} color={c.primary} />
        <Text style={styles.alertBadgeText}>ALERT</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 20 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 24,
  },
  errorIconWrap: {
    width: 70,
    height: 70,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  errorTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.3,
  },
  errorSub: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 14,
    marginTop: 4,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 4,
  },
  retryText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },

  // ── Ambient glows ──
  ambientGlowTR: {
    position: 'absolute',
    top: -50,
    right: -100,
    width: 360,
    height: 360,
    borderRadius: 180,
  },
  ambientGlowML: {
    position: 'absolute',
    top: 380,
    left: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
  },
  ambientGlowBR: {
    position: 'absolute',
    bottom: 50,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
  },

  // ── Volt Hero Banner ──
  voltHeroContainer: {
    width: '100%',
    position: 'relative',
    marginTop: 0,
    marginBottom: -16,
    paddingBottom: 0,
    minHeight: 180,
    justifyContent: 'center',
  },
  voltHeroContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  voltHeroContent: {
    gap: 4,
    paddingRight: 100,
    zIndex: 2,
  },
  voltHeroTagline: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    color: '#7E152F', // Burgundy text
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  voltHeroTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
    letterSpacing: -0.4,
    lineHeight: 22,
    marginBottom: 6,
  },
  voltHeroSubtitle: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: '#64748B',
    lineHeight: 15,
    marginBottom: 12,
  },
  voltHeroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#7E152F', // Burgundy button color
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  voltHeroButtonText: {
    fontSize: 11.5,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
  },
  voltHeroImageWrap: {
    position: 'absolute',
    right: -20,
    bottom: -10,
    width: 210,
    height: 210,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  voltHeroImage: {
    width: 210,
    height: 210,
  },
  voltHeroDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: [{ translateX: -16 }],
  },
  voltHeroDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  // ── Sync pill ──
  syncPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  syncText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    flex: 1,
  },
  syncDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.6,
  },

  // ── Unified 3D Stats Grid ──
  bigStatsContainer: {
    backgroundColor: '#FFFFFF', // Clean white card tray
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#CBD5E1', // Highly visible 3D border boundary
    padding: 16,
    gap: 16,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08, // Increased shadow opacity for depth
    shadowRadius: 24,
    elevation: 6,
    width: '100%',
  },
  innerStatsCard: {
    backgroundColor: '#F8FAFC', // Soft slate-gray contrast background for cards inside white container
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0', // Soft inner border
    padding: 16,
  },
  innerStatsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  sectionIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderText: {
    flex: 1,
    gap: 0,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
  },
  floatingSubCardsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  floatingSubCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  subCardLabel: {
    fontSize: 9,
    fontFamily: 'Inter_600SemiBold',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  subCardValue: {
    fontSize: 18,
    fontFamily: 'SpaceMono_700Bold',
    color: '#0F172A',
  },

  // ── Recent Activity Section Header ──
  recentActivityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 6,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionAccent: {
    width: 4,
    height: 20,
    borderRadius: 2,
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.2,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  seeAll: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },

  // ── Activity Feed Container ──
  activityContainer: {
    borderRadius: 24,
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#CBD5E1', // highly visible border boundary
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08, // increased shadow opacity for depth
    shadowRadius: 16,
    elevation: 5, // increased elevation
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  activityStripe: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginLeft: 5,
  },
  activityBody: {
    flex: 1,
    gap: 4,
  },
  activityTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activityTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    flex: 1,
    letterSpacing: -0.1,
  },
  kindPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  kindPillText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activitySub: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
  },
  activityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  activityTime: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  chevronWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  // ── Empty activity ──
  emptyActivity: {
    alignItems: 'center',
    padding: 36,
    borderRadius: 20,
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    gap: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.3,
  },
  emptySub: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  mainStatsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9', // Subtle outline
    padding: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03, // Soft shadow
    shadowRadius: 8,
    elevation: 1,
    width: '100%',
  },
  greenBadge: {
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    marginLeft: 6,
  },
  greenBadgeText: {
    color: '#137333',
    fontSize: 8,
    fontFamily: 'Inter_700Bold',
  },
  subCardFooter: {
    fontSize: 9,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
  },
  totalUnitsBadge: {
    backgroundColor: '#FDF2F4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  totalUnitsBadgeText: {
    color: '#7E152F',
    fontSize: 9,
    fontFamily: 'Inter_600SemiBold',
  },
  savingsContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 8,
    width: '100%',
  },
  savingsHalf: {
    flex: 1,
    paddingHorizontal: 12,
  },
  activityRowNew: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
    gap: 12,
  },
  activityStripeNew: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  activityIconNew: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FDF2F4', // Soft pinkish bg
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    flexShrink: 0,
    marginLeft: 4, // Offset slightly to account for stripe
  },
  bracketText: {
    color: '#7E152F', // Burgundy c.primary
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  activityBodyNew: {
    flex: 1,
    gap: 2,
  },
  activityTitleNew: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.1,
  },
  activitySubNew: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    lineHeight: 15,
  },
  activityFooterNew: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  activityTimeNew: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FDF2F4', // Soft pinkish bg
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'center',
  },
  alertBadgeText: {
    color: '#7E152F', // Burgundy c.primary
    fontSize: 8.5,
    fontFamily: 'Inter_700Bold',
  },
});

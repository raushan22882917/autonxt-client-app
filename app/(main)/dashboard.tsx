import React, { useEffect, useMemo, useState } from 'react';
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
import { fetchFleetTotalCostSavings } from '@/lib/appsync';
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

  const [costSavings, setCostSavings] = useState<number | null>(null);
  const [costLoading, setCostLoading] = useState(false);

  const topPad = Platform.OS === 'web' ? 67 : 0;

  const totalFleet = filteredTractors.length;
  const inMaintenance = filteredTractors.filter(t => t.status === 'MAINTENANCE').length;

  const tractorIds = useMemo(
    () => filteredTractors.map(t => t.tractorID),
    [filteredTractors]
  );

  useEffect(() => {
    if (tractorIds.length === 0) {
      setCostSavings(0);
      return;
    }
    let cancelled = false;
    setCostLoading(true);
    fetchFleetTotalCostSavings(tractorIds)
      .then(sum => {
        if (!cancelled) setCostSavings(sum);
      })
      .catch(() => {
        if (!cancelled) setCostSavings(null);
      })
      .finally(() => {
        if (!cancelled) setCostLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tractorIds.join('|')]);

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

  const costLabel =
    costSavings != null ? formatInr(costSavings) : '—';

  const costCardLoading = costLoading && costSavings === null;
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
      <BackgroundAmbientGlows />
      <ScrollView
        style={[styles.root, { backgroundColor: 'transparent' }]}
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPad + 16, paddingBottom: insets.bottom + 100 },
        ]}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor={c.primary} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* ── Volt Hero Banner ── */}
        <View style={[styles.voltHeroContainer, { backgroundColor: c.card }]}>
          <View style={styles.voltHeroContentRow}>
            <View style={styles.voltHeroContent}>
              <View style={styles.voltHeroHeader}>
                <View style={styles.voltLogoCircle}>
                  <Feather name="zap" size={12} color={c.primary} />
                </View>
                <Text style={[styles.voltBrandText, { color: c.primary }]}>VOLT PRECISION</Text>
              </View>

              <Text style={styles.voltHeroTitle}>THE FUTURE OF PERFORMANCE</Text>

              <Text style={styles.voltHeroSubtitle}>
                Engineered with precision. Driven by electricity. Experience the pinnacle of automotive innovation.
              </Text>

              <TouchableOpacity
                style={[styles.voltHeroButton, { backgroundColor: c.primary, shadowColor: c.primary }]}
                activeOpacity={0.8}
                onPress={() => {
                  router.push('/(main)/tractors');
                }}
              >
                <Text style={styles.voltHeroButtonText}>Experience Volt</Text>
                <Feather name="arrow-right" size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.voltHeroImageWrap}>
              <Image
                source={require('../../assets/images/small-logo-black.png')}
                style={styles.voltHeroImage}
                resizeMode="contain"
              />
            </View>
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

        {/* ── Stats Grid (Retainable Card-on-Card Layout) ── */}
        <View style={styles.statsGrid}>
          {/* Section 1: Cost Savings & Impact (Full Width) */}
          <View style={[styles.mainSectionCard, { backgroundColor: c.card, shadowColor: c.shadowStrong }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconWrap, { backgroundColor: c.accent + '15' }]}>
                <Feather name="trending-up" size={18} color={c.accent} />
              </View>
              <View style={styles.sectionHeaderText}>
                <Text style={styles.sectionTitle}>Cost Savings & Impact</Text>
                <Text style={styles.sectionSubtitle}>Cumulative financial benefits and sustainability metrics</Text>
              </View>
            </View>

            <View style={styles.floatingSubCardsRow}>
              <View style={styles.floatingSubCard}>
                <Text style={styles.subCardLabel}>Cumulative Saved</Text>
                <Text style={styles.subCardValue}>{costLabel}</Text>
              </View>
              <View style={styles.floatingSubCard}>
                <Text style={styles.subCardLabel}>Average per Tractor</Text>
                <Text style={styles.subCardValue}>
                  {costSavings ? formatInr(costSavings / (totalFleet || 1)) : '—'}
                </Text>
              </View>
            </View>
          </View>

          {/* Section 2: Fleet Overview (Split Cards) */}
          <View style={styles.statsRow}>
            {/* Split Card 1: Total Fleet */}
            <View style={[styles.mainSectionCard, { flex: 1, backgroundColor: c.card, shadowColor: c.shadowStrong }]}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIconWrap, { backgroundColor: c.secondary + '15' }]}>
                  <Feather name="truck" size={18} color={c.secondary} />
                </View>
                <View style={styles.sectionHeaderText}>
                  <Text style={styles.sectionTitle}>Total Fleet</Text>
                  <Text style={styles.sectionSubtitle}>Registered assets</Text>
                </View>
              </View>

              <View style={styles.floatingSubCardsRow}>
                <View style={styles.floatingSubCard}>
                  <Text style={styles.subCardLabel}>In Service</Text>
                  <Text style={styles.subCardValue}>{totalFleet}</Text>
                </View>
              </View>
            </View>

            {/* Split Card 2: Operations Status */}
            <View style={[styles.mainSectionCard, { flex: 1, backgroundColor: c.card, shadowColor: c.shadowStrong }]}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIconWrap, { backgroundColor: c.warning + '15' }]}>
                  <Feather name="activity" size={18} color={c.warning} />
                </View>
                <View style={styles.sectionHeaderText}>
                  <Text style={styles.sectionTitle}>Status</Text>
                  <Text style={styles.sectionSubtitle}>Fleet overview</Text>
                </View>
              </View>

              <View style={styles.floatingSubCardsRow}>
                <View style={[styles.floatingSubCard, { borderLeftWidth: 3, borderLeftColor: c.success }]}>
                  <Text style={styles.subCardLabel}>Active</Text>
                  <Text style={[styles.subCardValue, { color: c.success }]}>{inOperation}</Text>
                </View>
                <View style={[styles.floatingSubCard, { borderLeftWidth: 3, borderLeftColor: inMaintenance > 0 ? c.warning : c.border }]}>
                  <Text style={styles.subCardLabel}>Maint</Text>
                  <Text style={[styles.subCardValue, { color: inMaintenance > 0 ? c.warning : c.foreground }]}>{inMaintenance}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Section 3: Task Collaboration & Support (Full Width) */}
          <View style={[styles.mainSectionCard, { backgroundColor: c.card, shadowColor: c.shadowStrong }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconWrap, { backgroundColor: c.primary + '15' }]}>
                <Feather name="alert-circle" size={18} color={c.primary} />
              </View>
              <View style={styles.sectionHeaderText}>
                <Text style={styles.sectionTitle}>Task Collaboration</Text>
                <Text style={styles.sectionSubtitle}>Recent complaints and active operator tickets</Text>
              </View>
            </View>

            <View style={styles.floatingSubCardsRow}>
              <View style={styles.floatingSubCard}>
                <Text style={styles.subCardLabel}>Open Tickets</Text>
                <Text style={[styles.subCardValue, { color: openTickets > 0 ? c.primary : c.success }]}>
                  {openTickets}
                </Text>
              </View>
              <View style={styles.floatingSubCard}>
                <Text style={styles.subCardLabel}>System Alert</Text>
                <Text style={[styles.subCardValue, { fontSize: 13, color: openTickets > 0 ? c.primary : c.success, fontFamily: 'Inter_700Bold' }]}>
                  {openTickets > 0 ? 'Requires Action' : 'All Systems Clear'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Recent Activity Section ── */}
        <View style={styles.recentActivityHeader}>
          <View style={styles.sectionTitleRow}>
            <View style={[styles.sectionAccent, { backgroundColor: c.primary }]} />
            <Text style={[styles.sectionLabel, { color: c.foreground }]}>Recent Activity</Text>
          </View>
          <TouchableOpacity
            style={[styles.seeAllBtn, { backgroundColor: c.primary + '12', borderColor: c.primary + '30' }]}
            onPress={() => router.push('/(main)/complaints')}
            activeOpacity={0.7}
          >
            <Text style={[styles.seeAll, { color: c.primary }]}>All Tickets</Text>
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
          <View style={[styles.activityContainer, { backgroundColor: c.card, borderColor: c.border, shadowColor: c.shadowStrong }]}>
            {activity.map((item, idx) => (
              <ActivityRow
                key={item.id}
                item={item}
                c={c}
                isLast={idx === activity.length - 1}
                onPress={onActivityPress(item, router)}
              />
            ))}
          </View>
        )}
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
  isLast,
  onPress,
}: {
  item: ActivityItem;
  c: ReturnType<typeof useColors>;
  isLast: boolean;
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

  const isTicket = item.kind === 'ticket';
  const isCritical = item.severity === 'critical';

  return (
    <TouchableOpacity
      style={[
        styles.activityRow,
        {
          backgroundColor: c.card,
          borderColor: isCritical ? c.red + '40' : c.border,
          shadowColor: isCritical ? c.red : c.shadowStrong,
          marginBottom: isLast ? 0 : 10,
        },
      ]}
      onPress={onPress}
      activeOpacity={item.complaintID ? 0.75 : 1}
      disabled={!item.complaintID}
    >
      {/* Severity stripe — 5px thick */}
      <View style={[styles.activityStripe, { backgroundColor: iconColor }]} />

      <View style={[styles.activityIcon, { backgroundColor: iconColor + '18', borderColor: iconColor + '25', borderWidth: 1 }]}>
        <Feather name={item.icon} size={19} color={iconColor} />
      </View>

      <View style={styles.activityBody}>
        <View style={styles.activityTop}>
          <Text style={[styles.activityTitle, { color: c.foreground }]} numberOfLines={1}>
            {item.title}
          </Text>
          <View
            style={[
              styles.kindPill,
              {
                backgroundColor: isTicket ? c.primary + '14' : c.surfaceAlt,
                borderColor: isTicket ? c.primary + '30' : c.border,
              },
            ]}
          >
            <Text
              style={[
                styles.kindPillText,
                { color: isTicket ? c.primary : c.mutedForeground },
              ]}
            >
              {isTicket ? 'Ticket' : 'Alert'}
            </Text>
          </View>
        </View>
        <Text style={[styles.activitySub, { color: c.mutedForeground }]} numberOfLines={2}>
          {item.subtitle}
        </Text>
        <View style={styles.activityFooter}>
          <Feather name="clock" size={11} color={c.mutedForeground} />
          <Text style={[styles.activityTime, { color: c.mutedForeground }]}>
            {formatRelativeTime(item.timestamp)}
          </Text>
        </View>
      </View>

      {item.complaintID ? (
        <View style={[styles.chevronWrap, { backgroundColor: c.surfaceAlt }]}>
          <Feather name="chevron-right" size={16} color={c.mutedForeground} />
        </View>
      ) : null}
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
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
    marginBottom: 4,
    overflow: 'hidden',
  },
  voltHeroContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  voltHeroContent: {
    flex: 1,
    gap: 6,
  },
  voltHeroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  voltLogoCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F2F3F8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D73220',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  voltBrandText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: '#D73220',
    letterSpacing: 1.5,
  },
  voltHeroTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
    letterSpacing: -0.5,
    lineHeight: 24,
  },
  voltHeroSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#475569',
    lineHeight: 18,
    marginBottom: 6,
  },
  voltHeroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#BE185D',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
    shadowColor: '#BE185D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 5,
  },
  voltHeroButtonText: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  voltHeroImageWrap: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  voltHeroImage: {
    width: 90,
    height: 90,
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

  // ── Stats Grid ──
  statsGrid: {
    gap: 16,
    width: '100%',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },

  // ── Main Section Canvas Cards (Mockup Style) ──
  mainSectionCard: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 4,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  sectionIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderText: {
    flex: 1,
    gap: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
  },
  floatingSubCardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  floatingSubCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
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
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 4,
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
    borderWidth: 1,
    gap: 10,
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
});

import React, { useEffect, useMemo, useState } from 'react';
import {
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
    <ScrollView
      style={[styles.root, { backgroundColor: c.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad + 16, paddingBottom: insets.bottom + 100 },
      ]}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor={c.primary} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Welcome Banner */}
      <View style={[styles.welcomeBanner, { shadowColor: c.primary }]}>
        <LinearGradient
          colors={[c.primary, c.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.welcomeGradient, { borderRadius: 20 }]}
        >
          <View style={styles.welcomeLeft}>
            <Text style={[styles.welcomeOrg, { color: c.primaryForeground + 'CC' }]}>
              {organization?.name ?? 'Fleet Dashboard'}
            </Text>
            <Text style={[styles.welcomeTitle, { color: c.primaryForeground }]}>
              Fleet Overview
            </Text>
            <Text style={[styles.welcomeSub, { color: c.primaryForeground + 'AA' }]}>
              {totalFleet} tractors · {organization?.location ?? 'Live telemetry'}
            </Text>
          </View>
          <View style={[styles.welcomeIconWrap, { backgroundColor: c.primaryForeground + '14' }]}>
            <Feather name="truck" size={28} color={c.primaryForeground} />
          </View>
        </LinearGradient>
      </View>

      {/* Syncing indicator */}
      {statsSyncing ? (
        <View style={[styles.syncBanner, { backgroundColor: c.blueSoft, borderColor: c.primary + '30' }]}>
          <LoadingRing size="sm" color={c.primary} dual />
          <Text style={[styles.syncText, { color: c.primary }]}>
            {costCardLoading ? 'Loading analytics…' : 'Syncing fleet data…'}
          </Text>
        </View>
      ) : null}

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statsRow}>
          <StatCard
            title="Total Fleet"
            value={totalFleet}
            icon="truck"
            iconColor={c.primary}
            loading={statsSyncing}
          />
          <StatCard
            title="Open Tickets"
            value={openTickets}
            icon="alert-circle"
            iconColor={openTickets > 0 ? c.warning : c.success}
            subtitle={openTickets === 0 ? 'All clear' : 'OPEN & IN_PROGRESS'}
            loading={statsSyncing}
          />
        </View>
        <View style={styles.statsRow}>
          <FleetStatusCard
            inOperation={inOperation}
            inMaintenance={inMaintenance}
            loading={statsSyncing}
          />
          <StatCard
            title="Cost Saved"
            value={costLabel}
            icon="trending-up"
            iconColor={c.success}
            subtitle={costCardLoading ? 'Calculating…' : 'Fleet cumulative'}
            loading={costCardLoading}
          />
        </View>
      </View>

      {/* Section Header */}
      <View style={styles.sectionHeader}>
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
        activity.map((item, idx) => (
          <ActivityRow
            key={item.id}
            item={item}
            c={c}
            isLast={idx === activity.length - 1}
            onPress={onActivityPress(item, router)}
          />
        ))
      )}
    </ScrollView>
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

  return (
    <TouchableOpacity
      style={[
        styles.activityRow,
        {
          backgroundColor: c.card,
          borderColor: item.severity === 'critical' ? c.red + '33' : c.border,
          shadowColor: c.shadowStrong,
          marginBottom: isLast ? 0 : 10,
        },
      ]}
      onPress={onPress}
      activeOpacity={item.complaintID ? 0.75 : 1}
      disabled={!item.complaintID}
    >
      {/* Severity stripe */}
      <View style={[styles.activityStripe, { backgroundColor: iconColor }]} />

      <View style={[styles.activityIcon, { backgroundColor: iconColor + '18' }]}>
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
  content: { paddingHorizontal: 16, gap: 0 },
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
  welcomeBanner: {
    marginBottom: 16,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  welcomeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  welcomeLeft: { flex: 1, gap: 4 },
  welcomeOrg: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  welcomeTitle: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.5,
  },
  welcomeSub: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  welcomeIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  syncText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  statsGrid: {
    gap: 10,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionAccent: {
    width: 4,
    height: 18,
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
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  activityStripe: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginLeft: 3,
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

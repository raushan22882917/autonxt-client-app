import React from 'react';
import {
  ActivityIndicator,
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
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { PlantFilter } from '@/components/PlantFilter';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';

function HeroStat({ label, value, dot }: { label: string; value: number; dot: string }) {
  return (
    <View style={styles.heroStat}>
      <View style={styles.heroStatTop}>
        <View style={[styles.heroStatDot, { backgroundColor: dot }]} />
        <Text style={styles.heroStatValue}>{value}</Text>
      </View>
      <Text style={styles.heroStatLabel}>{label}</Text>
    </View>
  );
}

export default function DashboardScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, isAdmin, signOut } = useAuth();
  const {
    organization,
    plants,
    filteredTractors,
    filteredComplaints,
    isLoading,
    error,
    refresh,
  } = useApp();

  const topPad = Platform.OS === 'web' ? 67 : 0;

  const activeCount = filteredTractors.filter(t => t.status === 'ACTIVE').length;
  const idleCount = filteredTractors.filter(t => t.status === 'IDLE').length;
  const maintenanceCount = filteredTractors.filter(t => t.status === 'MAINTENANCE').length;
  const offlineCount = filteredTractors.filter(t => t.status === 'OFFLINE').length;
  const openComplaints = filteredComplaints.filter(c => c.status === 'OPEN' || c.status === 'IN_PROGRESS').length;
  const criticalComplaints = filteredComplaints.filter(c => c.severity === 'CRITICAL').length;

  const utilization = filteredTractors.length
    ? Math.round((activeCount / filteredTractors.length) * 100)
    : 0;

  const recentTractors = filteredTractors.slice(0, 5);

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: c.background }]}>
        <ActivityIndicator size="large" color={c.primary} />
        <Text style={[styles.loadingText, { color: c.mutedForeground }]}>Loading fleet data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: c.background }]}>
        <Feather name="wifi-off" size={40} color={c.mutedForeground} />
        <Text style={[styles.errorTitle, { color: c.foreground }]}>Failed to load</Text>
        <Text style={[styles.errorSub, { color: c.mutedForeground }]}>{error}</Text>
        <TouchableOpacity style={[styles.retryBtn, { backgroundColor: c.primary }]} onPress={refresh}>
          <Text style={styles.retryText}>Retry</Text>
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
      {/* Org Header */}
      <View style={styles.orgRow}>
        <View style={styles.orgInfo}>
          <Text style={[styles.orgName, { color: c.foreground }]} numberOfLines={1}>
            {organization?.name || 'Fleet Overview'}
          </Text>
          {organization?.location ? (
            <View style={styles.orgMeta}>
              <Feather name="map-pin" size={12} color={c.mutedForeground} />
              <Text style={[styles.orgLocation, { color: c.mutedForeground }]}>{organization.location}</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: c.card, borderColor: c.border }]}
            onPress={() => router.push('/(main)/users')}
            activeOpacity={0.7}
          >
            <Feather name="users" size={18} color={c.foreground} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: c.card, borderColor: c.border }]}
            onPress={signOut}
            activeOpacity={0.7}
          >
            <Feather name="log-out" size={18} color={c.mutedForeground} />
          </TouchableOpacity>
        </View>
      </View>

      {/* User tag */}
      <View style={styles.userTag}>
        <Feather name="user" size={12} color={isAdmin ? c.primary : c.mutedForeground} />
        <Text style={[styles.userTagText, { color: c.mutedForeground }, isAdmin && { color: c.primary }]}>
          {user?.name || user?.email} {isAdmin ? '· Admin' : ''}
        </Text>
      </View>

      {/* Fleet Health hero */}
      <View style={[styles.hero, { backgroundColor: c.foreground, shadowColor: c.shadow }]}>
        <View style={styles.heroTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroLabel}>Fleet Utilization</Text>
            <View style={styles.heroValueRow}>
              <Text style={styles.heroValue}>{utilization}</Text>
              <Text style={styles.heroPct}>%</Text>
            </View>
            <Text style={styles.heroSub}>
              {activeCount} of {filteredTractors.length} tractors active
            </Text>
          </View>
          <View style={styles.heroIcon}>
            <Feather name="activity" size={22} color="#fff" />
          </View>
        </View>

        <View style={styles.heroTrack}>
          <View style={[styles.heroFill, { width: `${utilization}%`, backgroundColor: c.success }]} />
        </View>

        <View style={styles.heroStatsRow}>
          <HeroStat label="Active" value={activeCount} dot={c.success} />
          <HeroStat label="Idle" value={idleCount} dot={c.warning} />
          <HeroStat label="Service" value={maintenanceCount} dot={c.blue} />
          <HeroStat label="Offline" value={offlineCount} dot="#94A3B8" />
        </View>
      </View>

      {/* Plant Filter */}
      <View style={styles.filterWrap}>
        <PlantFilter />
      </View>

      {/* Stats Row 1 */}
      <Text style={[styles.sectionLabel, { color: c.mutedForeground }]}>Fleet Status</Text>
      <View style={styles.statsRow}>
        <StatCard title="Total Tractors" value={filteredTractors.length} icon="truck" iconColor={c.primary} />
        <StatCard title="Active Now" value={activeCount} icon="zap" iconColor={c.success} />
      </View>
      <View style={[styles.statsRow, { marginTop: 10 }]}>
        <StatCard title="In Maintenance" value={maintenanceCount} icon="tool" iconColor={c.blue} />
        <StatCard title="Idle" value={idleCount} icon="pause-circle" iconColor={c.warning} />
      </View>

      {/* Complaints summary */}
      <Text style={[styles.sectionLabel, { color: c.mutedForeground, marginTop: 24 }]}>Complaints</Text>
      <View style={styles.statsRow}>
        <StatCard title="Open Issues" value={openComplaints} icon="alert-circle" iconColor={c.warning} />
        <StatCard title="Critical" value={criticalComplaints} icon="alert-triangle" iconColor={c.red} />
      </View>

      {/* Plants summary */}
      <Text style={[styles.sectionLabel, { color: c.mutedForeground, marginTop: 24 }]}>Plants</Text>
      <View style={styles.statsRow}>
        <StatCard title="Total Plants" value={plants.length} icon="layers" iconColor={c.primary} />
        <StatCard
          title="Hub Warehouses"
          value={plants.filter(p => p.plantType === 'HUB_WAREHOUSE').length}
          icon="home"
          iconColor={c.info}
        />
      </View>

      {/* Recent Tractors */}
      {recentTractors.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionLabel, { color: c.mutedForeground, marginTop: 0, marginBottom: 0 }]}>
              Recent Tractors
            </Text>
            <TouchableOpacity onPress={() => router.push('/(main)/tractors')} activeOpacity={0.7}>
              <Text style={[styles.seeAll, { color: c.primary }]}>See all</Text>
            </TouchableOpacity>
          </View>
          {recentTractors.map(t => (
            <View key={t.tractorID} style={[styles.tractorRow, { backgroundColor: c.card, borderColor: c.border }]}>
              <View style={[styles.tractorIcon, { backgroundColor: c.primary + '14' }]}>
                <Feather name="truck" size={18} color={c.primary} />
              </View>
              <View style={styles.tractorInfo}>
                <Text style={[styles.tractorModel, { color: c.foreground }]}>{t.model}</Text>
                <Text style={[styles.tractorSub, { color: c.mutedForeground }]}>
                  {[t.serialNumber, t.plantName].filter(Boolean).join(' · ')}
                </Text>
              </View>
              <StatusBadge status={t.status} small />
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 16 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginTop: 8,
  },
  errorTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  errorSub: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 8,
  },
  retryText: {
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  orgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  orgInfo: { flex: 1 },
  orgName: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.3,
  },
  orgMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  orgLocation: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 12,
  },
  userTagText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  hero: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    gap: 14,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 4,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  heroLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  heroValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 2,
  },
  heroValue: {
    color: '#fff',
    fontSize: 40,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -1.5,
    lineHeight: 44,
  },
  heroPct: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    marginBottom: 5,
    marginLeft: 2,
  },
  heroSub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.14)',
    overflow: 'hidden',
  },
  heroFill: {
    height: '100%',
    borderRadius: 4,
  },
  heroStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroStat: {
    flex: 1,
    gap: 3,
  },
  heroStatTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroStatDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  heroStatValue: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
  },
  heroStatLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    marginLeft: 13,
  },
  filterWrap: {
    marginHorizontal: -16,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  tractorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  tractorIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tractorInfo: { flex: 1 },
  tractorModel: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  tractorSub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
});

import React from 'react';
import {
  ActivityIndicator,
  FlatList,
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

export default function DashboardScreen() {
  const colors = useColors();
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
  const openComplaints = filteredComplaints.filter(c => c.status === 'OPEN' || c.status === 'IN_PROGRESS').length;
  const criticalComplaints = filteredComplaints.filter(c => c.severity === 'CRITICAL').length;

  const recentTractors = filteredTractors.slice(0, 5);

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: '#0A1628' }]}>
        <ActivityIndicator size="large" color="#F97316" />
        <Text style={styles.loadingText}>Loading fleet data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: '#0A1628' }]}>
        <Feather name="wifi-off" size={40} color="#475569" />
        <Text style={styles.errorTitle}>Failed to load</Text>
        <Text style={styles.errorSub}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={refresh}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: '#0A1628' }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad + 16, paddingBottom: insets.bottom + 100 },
      ]}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor="#F97316" />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Org Header */}
      <View style={styles.orgRow}>
        <View style={styles.orgInfo}>
          <Text style={styles.orgName} numberOfLines={1}>
            {organization?.name || 'Fleet Overview'}
          </Text>
          {organization?.location ? (
            <View style={styles.orgMeta}>
              <Feather name="map-pin" size={12} color="#64748B" />
              <Text style={styles.orgLocation}>{organization.location}</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.usersBtn}
            onPress={() => router.push('/(main)/users')}
            activeOpacity={0.7}
          >
            <Feather name="users" size={18} color="#94A3B8" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.signOutBtn} onPress={signOut} activeOpacity={0.7}>
            <Feather name="log-out" size={18} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* User tag */}
      <View style={styles.userTag}>
        <Feather name="user" size={12} color={isAdmin ? '#F97316' : '#64748B'} />
        <Text style={[styles.userTagText, isAdmin && { color: '#F97316' }]}>
          {user?.name || user?.email} {isAdmin ? '· Admin' : ''}
        </Text>
      </View>

      {/* Plant Filter */}
      <View style={styles.filterWrap}>
        <PlantFilter />
      </View>

      {/* Stats Row 1 */}
      <Text style={styles.sectionLabel}>Fleet Status</Text>
      <View style={styles.statsRow}>
        <StatCard title="Total Tractors" value={filteredTractors.length} icon="truck" iconColor="#F97316" />
        <StatCard title="Active Now" value={activeCount} icon="zap" iconColor="#10B981" />
      </View>
      <View style={[styles.statsRow, { marginTop: 10 }]}>
        <StatCard title="In Maintenance" value={maintenanceCount} icon="tool" iconColor="#3B82F6" />
        <StatCard title="Idle" value={idleCount} icon="pause-circle" iconColor="#F59E0B" />
      </View>

      {/* Complaints summary */}
      <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Complaints</Text>
      <View style={styles.statsRow}>
        <StatCard title="Open Issues" value={openComplaints} icon="alert-circle" iconColor="#EF4444" />
        <StatCard title="Critical" value={criticalComplaints} icon="alert-triangle" iconColor="#DC2626" />
      </View>

      {/* Plants summary */}
      <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Plants</Text>
      <View style={styles.statsRow}>
        <StatCard title="Total Plants" value={plants.length} icon="layers" iconColor="#8B5CF6" />
        <StatCard
          title="Hub Warehouses"
          value={plants.filter(p => p.plantType === 'HUB_WAREHOUSE').length}
          icon="home"
          iconColor="#06B6D4"
        />
      </View>

      {/* Recent Tractors */}
      {recentTractors.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionLabel, { marginTop: 24, marginBottom: 0 }]}>Recent Tractors</Text>
            <TouchableOpacity onPress={() => router.push('/(main)/tractors')} activeOpacity={0.7}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          {recentTractors.map(t => (
            <View key={t.tractorID} style={[styles.tractorRow, { borderColor: '#1E293B' }]}>
              <View style={styles.tractorIcon}>
                <Feather name="truck" size={18} color="#F97316" />
              </View>
              <View style={styles.tractorInfo}>
                <Text style={styles.tractorModel}>{t.model}</Text>
                <Text style={styles.tractorSub}>{t.serialNumber} · {t.plantName}</Text>
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
    color: '#94A3B8',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginTop: 8,
  },
  errorTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  errorSub: {
    color: '#64748B',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: '#F97316',
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
    color: '#F8FAFC',
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
    color: '#64748B',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  usersBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#1E293B',
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
    color: '#64748B',
  },
  filterWrap: {
    marginHorizontal: -16,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#64748B',
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
    color: '#F97316',
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  tractorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  tractorIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F9731618',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tractorInfo: { flex: 1 },
  tractorModel: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#F8FAFC',
  },
  tractorSub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#64748B',
    marginTop: 2,
  },
});

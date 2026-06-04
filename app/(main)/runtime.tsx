import React, { useMemo } from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
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
import { PlantAnalysisCard } from '@/components/PlantAnalysisCard';
import { UptimeMetricCards } from '@/components/UptimeMetricCards';
import { buildPlantSummaries } from '@/lib/plantAnalysis';

export default function PlantAnalysisScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { plants, tractors, complaints, runtimeRecords, isLoading, refresh, organization } = useApp();

  const topPad = Platform.OS === 'web' ? 67 : 0;

  const summaries = useMemo(
    () => buildPlantSummaries(plants, tractors, complaints, runtimeRecords),
    [plants, tractors, complaints, runtimeRecords]
  );

  const fleetTotals = useMemo(() => {
    const totalTractors = summaries.reduce((s, p) => s + p.tractorCount, 0);
    const maintenance = summaries.reduce((s, p) => s + p.maintenance, 0);
    const openTickets = summaries.reduce((s, p) => s + p.openTickets, 0);
    const uptime =
      totalTractors > 0
        ? Math.round(summaries.reduce((s, p) => s + p.uptimePct * p.tractorCount, 0) / totalTractors)
        : 0;
    const repairDays = summaries.reduce((s, p) => s + p.repairDays, 0);
    return { totalTractors, maintenance, openTickets, uptime, repairDays, plantCount: summaries.length };
  }, [summaries]);

  const openPlant = (plantID: string) =>
    router.push(`/plant/${encodeURIComponent(plantID)}`);

  const ListHeader = (
    <View style={[styles.header, { paddingTop: topPad + 14 }]}>
      {/* Hero banner */}
      <View style={[styles.heroBanner, { shadowColor: c.primary }]}>
        <LinearGradient
          colors={[c.primary, c.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroGradient, { borderRadius: 20 }]}
        >
          <View style={styles.heroLeft}>
            <Text style={[styles.heroSuper, { color: c.primaryForeground + 'BB' }]}>
              {organization?.name ?? 'Fleet'}
            </Text>
            <Text style={[styles.heroTitle, { color: c.primaryForeground }]}>Plant Analysis</Text>
            <Text style={[styles.heroSub, { color: c.primaryForeground + '99' }]}>
              {fleetTotals.plantCount} plant{fleetTotals.plantCount !== 1 ? 's' : ''} · {fleetTotals.totalTractors} tractors
            </Text>
          </View>
          <View style={[styles.heroIconWrap, { backgroundColor: c.primaryForeground + '14' }]}>
            <Feather name="home" size={28} color={c.primaryForeground} />
          </View>
        </LinearGradient>
      </View>

      {/* Fleet KPI row */}
      <View style={[styles.kpiRow, { backgroundColor: c.card, borderColor: c.border, shadowColor: c.shadow }]}>
        <KpiItem label="Tractors" value={fleetTotals.totalTractors} color={c.primary} />
        <View style={[styles.kpiDivider, { backgroundColor: c.border }]} />
        <KpiItem label="Maintenance" value={fleetTotals.maintenance} color={c.warning} />
        <View style={[styles.kpiDivider, { backgroundColor: c.border }]} />
        <KpiItem label="Open Tickets" value={fleetTotals.openTickets} color={c.red} />
        <View style={[styles.kpiDivider, { backgroundColor: c.border }]} />
        <KpiItem label="Uptime" value={`${fleetTotals.uptime}%`} color={c.success} />
      </View>

      <UptimeMetricCards
        uptimePct={fleetTotals.uptime}
        downtimePct={Math.max(0, 100 - fleetTotals.uptime)}
        repairDays={fleetTotals.repairDays}
      />

      <View style={styles.sectionRow}>
        <View style={styles.sectionTitleRow}>
          <View style={[styles.sectionAccent, { backgroundColor: c.primary }]} />
          <Text style={[styles.sectionLabel, { color: c.foreground }]}>All Plants</Text>
        </View>
        <Text style={[styles.sectionCount, { color: c.mutedForeground }]}>
          {summaries.length}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <FlatList
        data={summaries}
        keyExtractor={s => s.plant.plantID}
        renderItem={({ item }) => (
          <PlantAnalysisCard summary={item} onPress={() => openPlant(item.plant.plantID)} />
        )}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor={c.primary} />
        }
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        ListEmptyComponent={
          <View style={[styles.empty, { backgroundColor: c.card, borderColor: c.border }]}>
            <View style={[styles.emptyIconWrap, { backgroundColor: c.surfaceAlt }]}>
              <Feather name="home" size={32} color={c.mutedForeground} />
            </View>
            <Text style={[styles.emptyTitle, { color: c.foreground }]}>No Plants Found</Text>
            <Text style={[styles.emptyText, { color: c.mutedForeground }]}>
              {isLoading ? 'Loading plant data…' : 'No plants found for this organization'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

function KpiItem({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <View style={kpiStyles.item}>
      <Text style={[kpiStyles.value, { color }]}>{value}</Text>
      <Text style={kpiStyles.label}>{label}</Text>
    </View>
  );
}

const kpiStyles = StyleSheet.create({
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingVertical: 4,
  },
  value: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.4,
  },
  label: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    color: '#5A6A85',
    textAlign: 'center',
  },
});

const styles = StyleSheet.create({
  root: { flex: 1 },
  list: {
    paddingHorizontal: 16,
  },
  header: {
    gap: 14,
    paddingBottom: 4,
  },
  heroBanner: {
    borderRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  heroGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  heroLeft: { flex: 1, gap: 4 },
  heroSuper: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.5,
  },
  heroSub: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  heroIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  kpiDivider: {
    width: 1,
    height: 36,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  sectionCount: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
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
  },
  emptyText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
});

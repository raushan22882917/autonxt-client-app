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

// ── Icon KPI item ────────────────────────────────────────────────────────────
function KpiItem({
  label,
  value,
  color,
  icon,
  bg,
}: {
  label: string;
  value: number | string;
  color: string;
  icon: string;
  bg: string;
}) {
  return (
    <View style={kpiStyles.item}>
      <View style={[kpiStyles.iconWrap, { backgroundColor: bg }]}>
        <Feather name={icon as any} size={15} color={color} />
      </View>
      <Text style={[kpiStyles.value, { color }]}>{value}</Text>
      <Text style={kpiStyles.label}>{label}</Text>
    </View>
  );
}

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
      {/* ── Mission Control Hero Banner ── */}
      <View style={[styles.heroBanner, { shadowColor: c.primary }]}>
        <LinearGradient
          colors={[c.gradientStart, c.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroGradient, { borderRadius: 22 }]}
        >
          {/* Geometric overlays */}
          <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
            <View style={styles.heroArcTR} />
            <View style={styles.heroArcBL} />
            <View style={styles.heroGridH} />
            <View style={styles.heroGridV} />
            <View style={styles.heroAccentDot1} />
            <View style={styles.heroAccentDot2} />
          </View>

          <View style={styles.heroLeft}>
            <View style={styles.missionRow}>
              <View style={[styles.missionBadge, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
                <Feather name="radio" size={10} color="#FFFFFF" />
                <Text style={styles.missionBadgeText}>MISSION CONTROL</Text>
              </View>
            </View>
            <Text style={[styles.heroTitle, { color: '#FFFFFF' }]}>Plant Analysis</Text>
            <Text style={[styles.heroSub, { color: 'rgba(255,255,255,0.65)' }]}>
              {fleetTotals.plantCount} plant{fleetTotals.plantCount !== 1 ? 's' : ''} · {fleetTotals.totalTractors} tractors
            </Text>
          </View>
          <View style={[styles.heroIconWrap, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <Feather name="home" size={26} color="#FFFFFF" />
          </View>
        </LinearGradient>
      </View>

      {/* ── Fleet KPI Row ── */}
      <View style={[styles.kpiRow, { backgroundColor: c.card, borderColor: c.border, shadowColor: c.shadow }]}>
        <KpiItem
          label="Tractors"
          value={fleetTotals.totalTractors}
          color={c.primary}
          icon="truck"
          bg={c.primary + '14'}
        />
        <View style={[styles.kpiDivider, { backgroundColor: c.border }]} />
        <KpiItem
          label="Maintenance"
          value={fleetTotals.maintenance}
          color={c.warning}
          icon="tool"
          bg={c.warning + '14'}
        />
        <View style={[styles.kpiDivider, { backgroundColor: c.border }]} />
        <KpiItem
          label="Open Tickets"
          value={fleetTotals.openTickets}
          color={c.red}
          icon="alert-circle"
          bg={c.red + '14'}
        />
        <View style={[styles.kpiDivider, { backgroundColor: c.border }]} />
        <KpiItem
          label="Uptime"
          value={`${fleetTotals.uptime}%`}
          color={fleetTotals.uptime >= 80 ? c.success : c.warning}
          icon="activity"
          bg={fleetTotals.uptime >= 80 ? c.success + '14' : c.warning + '14'}
        />
      </View>

      <UptimeMetricCards
        uptimePct={fleetTotals.uptime}
        downtimePct={Math.max(0, 100 - fleetTotals.uptime)}
        repairDays={fleetTotals.repairDays}
      />

      {/* Section header */}
      <View style={styles.sectionRow}>
        <View style={styles.sectionTitleRow}>
          <View style={[styles.sectionAccent, { backgroundColor: c.primary }]} />
          <Text style={[styles.sectionLabel, { color: c.foreground }]}>All Plants</Text>
        </View>
        <View style={[styles.countChip, { backgroundColor: c.primary + '14', borderColor: c.primary + '30' }]}>
          <Text style={[styles.countChipText, { color: c.primary }]}>{summaries.length}</Text>
        </View>
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

const kpiStyles = StyleSheet.create({
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  value: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.4,
  },
  label: {
    fontSize: 9,
    fontFamily: 'Inter_600SemiBold',
    color: '#5A6A85',
    textAlign: 'center',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});

const styles = StyleSheet.create({
  root: { flex: 1 },
  list: { paddingHorizontal: 16 },
  header: {
    gap: 14,
    paddingBottom: 4,
    paddingHorizontal: 16,
  },

  // ── Hero banner ──
  heroBanner: {
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
  },
  // Geometric overlays
  heroArcTR: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    top: -50,
    right: -30,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  heroArcBL: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    bottom: -20,
    left: 80,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  heroGridH: {
    position: 'absolute',
    left: '10%',
    right: '10%',
    top: '60%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  heroGridV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '60%',
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  heroAccentDot1: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.22)',
    bottom: 16,
    left: 24,
  },
  heroAccentDot2: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.14)',
    bottom: 28,
    left: 40,
  },

  heroLeft: { flex: 1, gap: 5 },
  missionRow: { flexDirection: 'row' },
  missionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  missionBadgeText: {
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    letterSpacing: 1.2,
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
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── KPI row ──
  kpiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  kpiDivider: {
    width: 1,
    height: 44,
  },

  // ── Section header ──
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
    height: 20,
    borderRadius: 2,
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.2,
  },
  countChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  countChipText: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
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
  },
  emptyText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
});

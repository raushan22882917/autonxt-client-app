import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { ReportCalendar } from '@/components/ReportCalendar';
import { formatDisplayDate, toDateKey } from '@/lib/dailyReport';
import {
  buildPlantDailyReportCsv,
  PLANT_DAILY_REPORT_HEADERS,
  plantReportFilename,
} from '@/lib/plantDailyReport';
import { fetchDailyManualRuntime, fetchReportFleetData } from '@/lib/appsync';

export default function ReportsScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const {
    organization,
    plants,
    selectedPlantID,
    filteredTractors,
    filteredComplaints,
    filteredRuntimeRecords,
  } = useApp();

  const topPad = Platform.OS === 'web' ? 67 : 0;
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDates, setSelectedDates] = useState<string[]>([toDateKey(new Date())]);
  const [downloading, setDownloading] = useState(false);

  const selectedPlant = selectedPlantID
    ? plants.find(p => p.plantID === selectedPlantID) ?? null
    : null;

  const datesWithData = useMemo(() => {
    const set = new Set<string>();
    filteredRuntimeRecords.forEach(r => set.add(toDateKey(r.date)));
    filteredComplaints.forEach(x => set.add(toDateKey(x.createdAt)));
    return set;
  }, [filteredRuntimeRecords, filteredComplaints]);

  const onToggleDate = useCallback((dateKey: string) => {
    setSelectedDates(prev => {
      const key = toDateKey(dateKey);
      if (prev.includes(key)) return prev.filter(d => d !== key);
      return [...prev, key].sort();
    });
  }, []);

  const handleDownload = async () => {
    if (!organization?.orgID) {
      Alert.alert('No organization', 'Sign in and load fleet data before downloading reports.');
      return;
    }
    if (selectedDates.length === 0) {
      Alert.alert('Select dates', 'Tap one or more days on the calendar to include in the report.');
      return;
    }

    setDownloading(true);
    try {
      const [{ tractors, complaints }, ...runtimeByDate] = await Promise.all([
        fetchReportFleetData(organization.orgID, plants, selectedPlantID),
        ...selectedDates.map(date =>
          fetchDailyManualRuntime(
            organization.orgID,
            date,
            plants,
            filteredTractors,
            selectedPlantID
          )
        ),
      ]);
      const freshRuntime = runtimeByDate.flat();
      const runtimeMap = new Map<string, (typeof freshRuntime)[0]>();
      for (const r of freshRuntime) {
        runtimeMap.set(r.recordID, r);
      }

      const csv = buildPlantDailyReportCsv({
        dates: selectedDates,
        organization,
        plants,
        tractors,
        complaints,
        runtimeRecords: [...runtimeMap.values()],
        plantFilterID: selectedPlantID,
      });

      const name = plantReportFilename(selectedDates, selectedPlant?.name);
      const { downloadCsvFile } = await import('@/lib/downloadCsv');
      await downloadCsvFile(name, csv);

      Alert.alert(
        'Report Ready',
        `Downloaded ${selectedDates.length} day${selectedDates.length > 1 ? 's' : ''} as CSV.`
      );
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Download failed';
      Alert.alert('Download Failed', msg);
    } finally {
      setDownloading(false);
    }
  };

  const canDownload = !downloading && selectedDates.length > 0;
  const hasSelection = selectedDates.length > 0;

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPad + 16, paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Banner ── */}
        <View style={[styles.heroBanner, { shadowColor: c.primary }]}>
          <LinearGradient
            colors={[c.gradientStart, c.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.heroGradient, { borderRadius: 22 }]}
          >
            {/* Geometric decoration */}
            <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
              <View style={styles.heroArcTR} />
              <View style={styles.heroGridH} />
              <View style={styles.heroAccentLine} />
              <View style={styles.heroAccentDot} />
            </View>

            <View style={styles.heroLeft}>
              <View style={styles.heroBadgeRow}>
                <View style={[styles.heroBadge, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
                  <Feather name="bar-chart-2" size={10} color="#FFFFFF" />
                  <Text style={styles.heroBadgeText}>ANALYTICS</Text>
                </View>
              </View>
              <Text style={[styles.heroTitle, { color: '#FFFFFF' }]}>Daily Reports</Text>
              <Text style={[styles.heroSub, { color: 'rgba(255,255,255,0.65)' }]}>
                {selectedPlant?.name ?? organization?.name ?? 'Fleet'} · CSV export
              </Text>
            </View>
            <View style={[styles.heroIconWrap, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              <Feather name="file-text" size={26} color="#FFFFFF" />
            </View>
          </LinearGradient>
        </View>

        {/* ── Calendar Card ── */}
        <View style={[styles.calendarCard, { backgroundColor: c.card, borderColor: c.border, shadowColor: c.shadow }]}>
          <View style={styles.calendarHeader}>
            <View style={styles.calendarTitleRow}>
              <View style={[styles.sectionAccent, { backgroundColor: c.primary }]} />
              <Text style={[styles.calendarTitle, { color: c.foreground }]}>Select Dates</Text>
              {datesWithData.size > 0 && (
                <View style={[styles.dataIndicatorLegend, { backgroundColor: c.blue + '18', borderColor: c.blue + '35' }]}>
                  <View style={[styles.dataIndicatorDot, { backgroundColor: c.blue }]} />
                  <Text style={[styles.dataIndicatorText, { color: c.blue }]}>Has data</Text>
                </View>
              )}
            </View>
            {selectedDates.length > 0 && (
              <TouchableOpacity onPress={() => setSelectedDates([])} hitSlop={8}>
                <Text style={[styles.clearAll, { color: c.red }]}>Clear all</Text>
              </TouchableOpacity>
            )}
          </View>
          <ReportCalendar
            month={calendarMonth}
            selectedDates={selectedDates}
            datesWithData={datesWithData}
            onMonthChange={setCalendarMonth}
            onToggleDate={onToggleDate}
          />
        </View>

        {/* ── Selection summary card ── */}
        <View
          style={[
            styles.selectionCard,
            {
              backgroundColor: hasSelection ? c.elevatedCard : c.card,
              borderColor: hasSelection ? c.primary + '40' : c.border,
              shadowColor: hasSelection ? c.primary : c.shadow,
              shadowOpacity: hasSelection ? 0.1 : 0.04,
            },
          ]}
        >
          <View style={[styles.selectionIcon, { backgroundColor: c.primary + '18' }]}>
            <Feather name="calendar" size={20} color={c.primary} />
          </View>
          <View style={styles.selectionText}>
            <Text style={[styles.selectionTitle, { color: c.foreground }]}>
              {hasSelection ? 'Selected Period' : 'No dates selected'}
            </Text>
            <Text style={[styles.selectionValue, { color: c.mutedForeground }]} numberOfLines={2}>
              {selectedDates.length === 0
                ? 'Tap days on the calendar above'
                : selectedDates.length <= 3
                  ? selectedDates.map(formatDisplayDate).join(', ')
                  : `${selectedDates.slice(0, 2).map(formatDisplayDate).join(', ')} +${selectedDates.length - 2} more`}
            </Text>
          </View>
          {hasSelection && (
            <View style={[styles.countBadge, { backgroundColor: c.primary }]}>
              <Text style={[styles.countText, { color: c.primaryForeground }]}>
                {selectedDates.length}
              </Text>
              <Text style={[styles.countLabel, { color: c.primaryForeground + 'BB' }]}>
                {selectedDates.length === 1 ? 'day' : 'days'}
              </Text>
            </View>
          )}
        </View>

        {/* ── Download CTA ── */}
        <TouchableOpacity
          style={[
            styles.downloadBtn,
            {
              backgroundColor: canDownload ? c.primary : c.surfaceAlt,
              shadowColor: canDownload ? c.primary : 'transparent',
              shadowOpacity: canDownload ? 0.35 : 0,
              borderColor: canDownload ? c.primary : c.border,
            },
          ]}
          onPress={handleDownload}
          disabled={!canDownload}
          activeOpacity={0.85}
        >
          {downloading ? (
            <>
              <ActivityIndicator color={c.primaryForeground} />
              <Text style={[styles.downloadLabel, { color: c.primaryForeground }]}>
                Preparing report…
              </Text>
            </>
          ) : (
            <>
              <View
                style={[
                  styles.downloadIconWrap,
                  { backgroundColor: canDownload ? 'rgba(255,255,255,0.2)' : c.border },
                ]}
              >
                <Feather
                  name="download"
                  size={20}
                  color={canDownload ? '#FFFFFF' : c.mutedForeground}
                />
              </View>
              <Text
                style={[
                  styles.downloadLabel,
                  { color: canDownload ? '#FFFFFF' : c.mutedForeground },
                ]}
              >
                {selectedDates.length === 0
                  ? 'Select dates to download'
                  : `Download ${selectedDates.length} day${selectedDates.length !== 1 ? 's' : ''} as CSV`}
              </Text>
              {canDownload && (
                <Feather name="arrow-right" size={18} color="rgba(255,255,255,0.7)" />
              )}
            </>
          )}
        </TouchableOpacity>

        {/* ── Info card ── */}
        <View style={[styles.infoCard, { backgroundColor: c.card, borderColor: c.border }]}>
          <View style={styles.infoHeader}>
            <View style={[styles.infoIconWrap, { backgroundColor: c.blue + '14' }]}>
              <Feather name="info" size={15} color={c.blue} />
            </View>
            <Text style={[styles.infoTitle, { color: c.foreground }]}>CSV Columns</Text>
          </View>
          <Text style={[styles.infoLine, { color: c.mutedForeground }]} numberOfLines={4}>
            {PLANT_DAILY_REPORT_HEADERS.join(', ')}
          </Text>
          <View style={[styles.infoNote, { backgroundColor: c.surfaceAlt, borderRadius: 12 }]}>
            <Feather name="database" size={12} color={c.mutedForeground} style={{ marginTop: 1 }} />
            <Text style={[styles.infoNoteText, { color: c.mutedForeground }]}>
              One row per plant per selected day. Counts use live API data; tickets from complaints log.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    gap: 16,
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
  heroArcTR: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    top: -45,
    right: -25,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  heroGridH: {
    position: 'absolute',
    left: '5%',
    right: '5%',
    top: '58%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  heroAccentLine: {
    position: 'absolute',
    bottom: 16,
    right: 88,
    width: 28,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  heroAccentDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.22)',
    bottom: 22,
    left: 20,
  },
  heroLeft: { flex: 1, gap: 5 },
  heroBadgeRow: { flexDirection: 'row' },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  heroBadgeText: {
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

  // ── Calendar card ──
  calendarCard: {
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  calendarTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionAccent: {
    width: 4,
    height: 18,
    borderRadius: 2,
  },
  calendarTitle: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.2,
  },
  dataIndicatorLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  dataIndicatorDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  dataIndicatorText: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
  },
  clearAll: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },

  // ── Selection card ──
  selectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },
  selectionIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  selectionText: { flex: 1, gap: 3 },
  selectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.1,
  },
  selectionValue: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
  },
  countBadge: {
    alignItems: 'center',
    minWidth: 44,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  countText: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    lineHeight: 22,
  },
  countLabel: {
    fontSize: 9,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },

  // ── Download button ──
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderRadius: 18,
    paddingVertical: 20,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 6,
  },
  downloadIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadLabel: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.2,
  },

  // ── Info card ──
  infoCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  infoLine: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    lineHeight: 17,
  },
  infoNote: {
    padding: 12,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  infoNoteText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    lineHeight: 17,
    flex: 1,
  },
});

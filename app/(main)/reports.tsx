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

  const selectionLabel =
    selectedDates.length === 0
      ? 'No dates selected'
      : selectedDates.length === 1
        ? formatDisplayDate(selectedDates[0])
        : `${selectedDates.length} days selected`;

  const canDownload = !downloading && selectedDates.length > 0;

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPad + 16, paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
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
                {selectedPlant?.name ?? organization?.name ?? 'Fleet'}
              </Text>
              <Text style={[styles.heroTitle, { color: c.primaryForeground }]}>Daily Reports</Text>
              <Text style={[styles.heroSub, { color: c.primaryForeground + 'AA' }]}>
                Select dates to export plant operations
              </Text>
            </View>
            <View style={[styles.heroIconWrap, { backgroundColor: c.primaryForeground + '14' }]}>
              <Feather name="file-text" size={28} color={c.primaryForeground} />
            </View>
          </LinearGradient>
        </View>

        {/* Calendar */}
        <View style={[styles.calendarCard, { backgroundColor: c.card, borderColor: c.border, shadowColor: c.shadow }]}>
          <View style={styles.calendarHeader}>
            <View style={styles.calendarTitleRow}>
              <View style={[styles.calendarAccent, { backgroundColor: c.primary }]} />
              <Text style={[styles.calendarTitle, { color: c.foreground }]}>Select Dates</Text>
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

        {/* Selection summary */}
        <View
          style={[
            styles.selectionCard,
            {
              backgroundColor: selectedDates.length > 0 ? c.blueSoft : c.card,
              borderColor: selectedDates.length > 0 ? c.primary + '35' : c.border,
            },
          ]}
        >
          <View style={[styles.selectionIcon, { backgroundColor: c.primary + '18' }]}>
            <Feather name="calendar" size={20} color={c.primary} />
          </View>
          <View style={styles.selectionText}>
            <Text style={[styles.selectionTitle, { color: c.foreground }]}>Selected period</Text>
            <Text style={[styles.selectionValue, { color: c.mutedForeground }]} numberOfLines={2}>
              {selectedDates.length === 0
                ? 'No dates selected'
                : selectedDates.length <= 3
                  ? selectedDates.map(formatDisplayDate).join(', ')
                  : `${selectedDates.slice(0, 2).map(formatDisplayDate).join(', ')} +${selectedDates.length - 2} more`}
            </Text>
          </View>
          {selectedDates.length > 0 && (
            <View style={[styles.countBadge, { backgroundColor: c.primary }]}>
              <Text style={[styles.countText, { color: c.primaryForeground }]}>
                {selectedDates.length}
              </Text>
            </View>
          )}
        </View>

        {/* Download button */}
        <TouchableOpacity
          style={[
            styles.downloadBtn,
            { backgroundColor: canDownload ? c.primary : c.muted, shadowColor: canDownload ? c.primary : 'transparent' },
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
              <View style={[styles.downloadIconWrap, { backgroundColor: c.primaryForeground + '20' }]}>
                <Feather name="download" size={20} color={canDownload ? c.primaryForeground : c.mutedForeground} />
              </View>
              <Text
                style={[
                  styles.downloadLabel,
                  { color: canDownload ? c.primaryForeground : c.mutedForeground },
                ]}
              >
                {selectedDates.length === 0
                  ? 'Select dates to download'
                  : `Download ${selectedDates.length} day${selectedDates.length !== 1 ? 's' : ''} as CSV`}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Info card */}
        <View style={[styles.infoCard, { backgroundColor: c.card, borderColor: c.border }]}>
          <View style={styles.infoHeader}>
            <Feather name="info" size={16} color={c.primary} />
            <Text style={[styles.infoTitle, { color: c.foreground }]}>CSV columns</Text>
          </View>
          <Text style={[styles.infoLine, { color: c.mutedForeground }]} numberOfLines={4}>
            {PLANT_DAILY_REPORT_HEADERS.join(', ')}
          </Text>
          <View style={[styles.infoNote, { backgroundColor: c.surfaceAlt, borderRadius: 10 }]}>
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
  calendarCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
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
  calendarAccent: {
    width: 4,
    height: 16,
    borderRadius: 2,
  },
  calendarTitle: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.2,
  },
  clearAll: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  selectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  selectionIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  selectionText: { flex: 1, gap: 3 },
  selectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  selectionValue: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
  },
  countBadge: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  countText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderRadius: 16,
    paddingVertical: 18,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 5,
  },
  downloadIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadLabel: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.2,
  },
  infoCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  },
  infoNoteText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    lineHeight: 17,
  },
});

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
        'Report ready',
        `Downloaded ${selectedDates.length} day${selectedDates.length > 1 ? 's' : ''} as CSV.`
      );
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Download failed';
      Alert.alert('Download failed', msg);
    } finally {
      setDownloading(false);
    }
  };

  const selectionLabel =
    selectedDates.length === 0
      ? 'No dates selected'
      : selectedDates.map(formatDisplayDate).join(', ');

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPad + 16, paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: c.foreground }]}>Daily reports</Text>
        <Text style={[styles.subtitle, { color: c.mutedForeground }]}>
          Select days on the calendar, then download a plant operations CSV (loader, catcher,
          grabber, haulage, pin loader counts, breakdowns, and tickets) from live fleet data.
        </Text>

        <ReportCalendar
          month={calendarMonth}
          selectedDates={selectedDates}
          datesWithData={datesWithData}
          onMonthChange={setCalendarMonth}
          onToggleDate={onToggleDate}
        />

        <View style={[styles.selectionCard, { backgroundColor: c.card, borderColor: c.border }]}>
          <Feather name="calendar" size={18} color={c.primary} />
          <View style={styles.selectionText}>
            <Text style={[styles.selectionTitle, { color: c.foreground }]}>Selected dates</Text>
            <Text style={[styles.selectionValue, { color: c.mutedForeground }]} numberOfLines={3}>
              {selectionLabel}
            </Text>
          </View>
          {selectedDates.length > 0 ? (
            <TouchableOpacity onPress={() => setSelectedDates([])} hitSlop={8}>
              <Text style={[styles.clearBtn, { color: c.primary }]}>Clear</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          style={[
            styles.downloadBtn,
            { backgroundColor: c.primary },
            (downloading || selectedDates.length === 0) && styles.downloadBtnDisabled,
          ]}
          onPress={handleDownload}
          disabled={downloading || selectedDates.length === 0}
          activeOpacity={0.85}
        >
          {downloading ? (
            <ActivityIndicator color={c.primaryForeground} />
          ) : (
            <Feather name="download" size={20} color={c.primaryForeground} />
          )}
          <Text style={[styles.downloadLabel, { color: c.primaryForeground }]}>
            {downloading ? 'Preparing CSV…' : 'Download report (CSV)'}
          </Text>
        </TouchableOpacity>

        <View style={[styles.infoCard, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
          <Text style={[styles.infoTitle, { color: c.foreground }]}>CSV columns</Text>
          <Text style={[styles.infoLine, { color: c.mutedForeground }]} numberOfLines={6}>
            {PLANT_DAILY_REPORT_HEADERS.join(', ')}
          </Text>
          <Text style={[styles.infoNote, { color: c.mutedForeground }]}>
            One row per plant per selected day. Implement counts use API currentImplement and
            serviceStatus; tickets and breakdowns use complaints for that day.
          </Text>
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
  title: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
    marginTop: -8,
  },
  selectionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  selectionText: { flex: 1, gap: 4 },
  selectionTitle: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  selectionValue: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
  },
  clearBtn: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 14,
    paddingVertical: 16,
  },
  downloadBtnDisabled: {
    opacity: 0.55,
  },
  downloadLabel: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  infoCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  infoLine: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    lineHeight: 16,
  },
  infoNote: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    lineHeight: 17,
    marginTop: 6,
  },
});

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/StatusBadge';
import { severityColor, formatDateTime } from '@/lib/complaint';
import { ComplaintDetail, fetchComplaintById } from '@/lib/appsync';

export default function ComplaintDetailScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { complaints, tractors, plants } = useApp();
  const [complaint, setComplaint] = useState<ComplaintDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const cached = complaints.find(x => x.complaintID === id);
    if (cached) setComplaint(cached);

    setLoading(true);
    setError(null);
    fetchComplaintById(id, plants, tractors)
      .then(data => {
        if (!cancelled && data) setComplaint(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load complaint');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, complaints, plants, tractors]);

  const tractor = complaint ? tractors.find(t => t.tractorID === complaint.tractorID) : undefined;

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(main)/complaints');
  };

  const Header = (
    <View style={[styles.topBar, { paddingTop: insets.top + 8, backgroundColor: c.card, borderColor: c.border }]}>
      <TouchableOpacity style={[styles.backBtn, { backgroundColor: c.surfaceAlt }]} onPress={goBack} activeOpacity={0.7}>
        <Feather name="chevron-left" size={22} color={c.foreground} />
      </TouchableOpacity>
      <Text style={[styles.topTitle, { color: c.foreground }]}>Complaint Details</Text>
      <View style={{ width: 38 }} />
    </View>
  );

  if (loading && !complaint) {
    return (
      <View style={[styles.root, { backgroundColor: c.background }]}>
        {Header}
        <View style={styles.empty}>
          <ActivityIndicator size="large" color={c.primary} />
        </View>
      </View>
    );
  }

  if (!complaint) {
    return (
      <View style={[styles.root, { backgroundColor: c.background }]}>
        {Header}
        <View style={styles.empty}>
          <Feather name="search" size={40} color={c.border} />
          <Text style={[styles.emptyText, { color: c.mutedForeground }]}>
            {error || 'Complaint not found'}
          </Text>
        </View>
      </View>
    );
  }

  const sev = severityColor(complaint.severity, c);
  const isResolved = complaint.status === 'RESOLVED' || complaint.status === 'CLOSED';

  const meta: { icon: keyof typeof Feather.glyphMap; label: string; value: string }[] = [
    { icon: 'truck', label: 'Tractor', value: complaint.tractorModel || complaint.tractorID || '—' },
    { icon: 'map-pin', label: 'Plant', value: complaint.plantName || complaint.location || '—' },
    { icon: 'user', label: 'Reported by', value: complaint.reportedBy || '—' },
    { icon: 'calendar', label: 'Reported on', value: formatDateTime(complaint.createdAt) },
  ];
  if (complaint.assigneeUserID) {
    meta.push({ icon: 'user-check', label: 'Assignee', value: complaint.assigneeUserID });
  }
  if (complaint.slaDeadline) {
    meta.push({ icon: 'clock', label: 'SLA deadline', value: formatDateTime(complaint.slaDeadline) });
  }
  if (complaint.breakdownDate) {
    meta.push({ icon: 'alert-circle', label: 'Breakdown date', value: formatDateTime(complaint.breakdownDate) });
  }
  if (complaint.resolvedAt) {
    meta.push({ icon: 'check-circle', label: 'Resolved on', value: formatDateTime(complaint.resolvedAt) });
  }

  const telemetry = tractor
    ? [
        { icon: 'battery-charging' as const, label: 'Battery', value: tractor.soc === undefined ? '—' : `${Math.round(tractor.soc)}%` },
        { icon: 'thermometer' as const, label: 'Temp', value: tractor.temp === undefined ? '—' : `${tractor.temp.toFixed(1)}°C` },
        { icon: 'rotate-cw' as const, label: 'RPM', value: tractor.rpm === undefined ? '—' : String(Math.round(tractor.rpm)) },
        { icon: 'zap' as const, label: 'Voltage', value: tractor.voltage === undefined ? '—' : `${tractor.voltage.toFixed(1)}V` },
        { icon: 'activity' as const, label: 'Current', value: tractor.current === undefined ? '—' : `${tractor.current.toFixed(1)}A` },
      ]
    : [];

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      {Header}
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: c.card, borderColor: c.border, shadowColor: c.shadow }]}>
          <View style={[styles.heroIcon, { backgroundColor: sev + '18' }]}>
            <Feather name="alert-triangle" size={26} color={sev} />
          </View>
          <Text style={[styles.heroTitle, { color: c.foreground }]}>{complaint.title}</Text>
          <View style={styles.badgeRow}>
            <StatusBadge status={complaint.severity} />
            <StatusBadge status={complaint.status} />
          </View>
        </View>

        {/* Description */}
        <Text style={[styles.sectionLabel, { color: c.mutedForeground }]}>Description</Text>
        <View style={[styles.block, { backgroundColor: c.card, borderColor: c.border }]}>
          <Text style={[styles.description, { color: c.foreground }]}>{complaint.description}</Text>
        </View>

        {/* Details */}
        <Text style={[styles.sectionLabel, { color: c.mutedForeground }]}>Details</Text>
        <View style={[styles.block, { backgroundColor: c.card, borderColor: c.border, paddingVertical: 4 }]}>
          {meta.map((m, i) => (
            <View
              key={m.label}
              style={[styles.metaRow, i < meta.length - 1 && { borderBottomWidth: 1, borderBottomColor: c.hairline }]}
            >
              <View style={[styles.metaIcon, { backgroundColor: c.surfaceAlt }]}>
                <Feather name={m.icon} size={15} color={c.primary} />
              </View>
              <Text style={[styles.metaLabel, { color: c.mutedForeground }]}>{m.label}</Text>
              <Text style={[styles.metaValue, { color: c.foreground }]} numberOfLines={1}>
                {m.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Live telemetry of related tractor */}
        {tractor ? (
          <>
            <Text style={[styles.sectionLabel, { color: c.mutedForeground }]}>Tractor Telemetry</Text>
            <View style={styles.telemetryGrid}>
              {telemetry.map(t => (
                <View key={t.label} style={[styles.telemetryChip, { backgroundColor: c.card, borderColor: c.border }]}>
                  <Feather name={t.icon} size={15} color={c.primary} />
                  <Text style={[styles.telemetryValue, { color: c.foreground }]}>{t.value}</Text>
                  <Text style={[styles.telemetryLabel, { color: c.mutedForeground }]}>{t.label}</Text>
                </View>
              ))}
            </View>
          </>
        ) : null}

        {/* Status banner */}
        <View
          style={[
            styles.statusBanner,
            { backgroundColor: isResolved ? c.successSoft : sev + '14', borderColor: isResolved ? c.success + '55' : sev + '40' },
          ]}
        >
          <Feather
            name={isResolved ? 'check-circle' : 'clock'}
            size={16}
            color={isResolved ? c.success : sev}
          />
          <Text style={[styles.statusBannerText, { color: isResolved ? c.success : sev }]}>
            {isResolved ? 'This complaint has been resolved.' : 'This complaint is awaiting resolution.'}
          </Text>
        </View>

        {complaint.events && complaint.events.length > 0 ? (
          <>
            <Text style={[styles.sectionLabel, { color: c.mutedForeground }]}>Timeline</Text>
            <View style={[styles.block, { backgroundColor: c.card, borderColor: c.border, paddingVertical: 4 }]}>
              {complaint.events.map((event, i) => (
                <View
                  key={`${event.ts}-${event.type}-${i}`}
                  style={[
                    styles.metaRow,
                    i < complaint.events!.length - 1 && { borderBottomWidth: 1, borderBottomColor: c.hairline },
                  ]}
                >
                  <View style={[styles.metaIcon, { backgroundColor: c.surfaceAlt }]}>
                    <Feather name="activity" size={15} color={c.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.metaValue, { color: c.foreground }]}>{event.type}</Text>
                    {event.note ? (
                      <Text style={[styles.metaLabel, { color: c.mutedForeground }]}>{event.note}</Text>
                    ) : null}
                    <Text style={[styles.metaLabel, { color: c.mutedForeground }]}>
                      {formatDateTime(event.ts)}
                      {event.by ? ` · ${event.by}` : ''}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  content: {
    padding: 16,
    gap: 8,
  },
  hero: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 12,
    marginBottom: 6,
  },
  block: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  metaIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaLabel: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  metaValue: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    marginLeft: 'auto',
    flexShrink: 1,
    textAlign: 'right',
  },
  telemetryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  telemetryChip: {
    flexBasis: '18%',
    flexGrow: 1,
    minWidth: 60,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 11,
    alignItems: 'center',
    gap: 3,
  },
  telemetryValue: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
  },
  telemetryLabel: {
    fontSize: 9,
    fontFamily: 'Inter_500Medium',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginTop: 16,
  },
  statusBannerText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    flex: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});

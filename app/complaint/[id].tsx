import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/StatusBadge';
import { severityColor, formatDateTime } from '@/lib/complaint';
import { FleetLoader } from '@/components/FleetLoader';
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

  const TopBar = (
    <View
      style={[
        styles.topBar,
        {
          paddingTop: insets.top + 10,
          backgroundColor: '#7E152F',
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.backBtn, { backgroundColor: 'rgba(255, 255, 255, 0.18)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)' }]}
        onPress={goBack}
        activeOpacity={0.7}
      >
        <Feather name="arrow-left" size={20} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={[styles.topTitle, { color: '#FFFFFF' }]}>Ticket Details</Text>
      <View style={{ width: 40 }} />
    </View>
  );

  if (loading && !complaint) {
    return (
      <View style={[styles.root, { backgroundColor: c.background }]}>
        {TopBar}
        <View style={styles.empty}>
          <FleetLoader visible inline title="Ticket details" message="Loading issue information…" />
        </View>
      </View>
    );
  }

  if (!complaint) {
    return (
      <View style={[styles.root, { backgroundColor: c.background }]}>
        {TopBar}
        <View style={styles.empty}>
          <View style={[styles.emptyIconWrap, { backgroundColor: c.surfaceAlt }]}>
            <Feather name="search" size={32} color={c.mutedForeground} />
          </View>
          <Text style={[styles.emptyTitle, { color: c.foreground }]}>Not Found</Text>
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
        { icon: 'battery-charging' as const, label: 'Battery', value: tractor.soc === undefined ? '—' : `${Math.round(tractor.soc)}%`, color: c.success },
        { icon: 'thermometer' as const, label: 'Temp', value: tractor.temp === undefined ? '—' : `${tractor.temp.toFixed(1)}°C`, color: c.warning },
        { icon: 'rotate-cw' as const, label: 'RPM', value: tractor.rpm === undefined ? '—' : String(Math.round(tractor.rpm)), color: c.primary },
        { icon: 'zap' as const, label: 'Voltage', value: tractor.voltage === undefined ? '—' : `${tractor.voltage.toFixed(1)}V`, color: c.info },
        { icon: 'activity' as const, label: 'Current', value: tractor.current === undefined ? '—' : `${tractor.current.toFixed(1)}A`, color: c.accent },
      ]
    : [];

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      {TopBar}
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={[styles.heroCard, { shadowColor: sev }]}>
          <LinearGradient
            colors={[sev + '18', sev + '06']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.heroGradient, { borderRadius: 20, borderWidth: 1, borderColor: sev + '33' }]}
          >
            <View style={[styles.heroIconWrap, { backgroundColor: sev + '1C' }]}>
              <Feather name="alert-triangle" size={28} color={sev} />
            </View>
            <Text style={[styles.heroTitle, { color: c.foreground }]}>{complaint.title}</Text>
            <View style={styles.badgeRow}>
              <StatusBadge status={complaint.severity} />
              <StatusBadge status={complaint.status} />
            </View>
          </LinearGradient>
        </View>

        {/* Description */}
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionAccent, { backgroundColor: c.primary }]} />
          <Text style={[styles.sectionLabel, { color: c.foreground }]}>Description</Text>
        </View>
        <View style={[styles.block, { backgroundColor: c.card, borderColor: c.border }]}>
          <Text style={[styles.description, { color: c.foreground }]}>{complaint.description}</Text>
        </View>

        {/* Status banner */}
        <View
          style={[
            styles.statusBanner,
            {
              backgroundColor: isResolved ? c.successSoft : sev + '12',
              borderColor: isResolved ? c.successBorder : sev + '35',
            },
          ]}
        >
          <View style={[styles.bannerIcon, { backgroundColor: isResolved ? c.success + '18' : sev + '18' }]}>
            <Feather
              name={isResolved ? 'check-circle' : 'clock'}
              size={18}
              color={isResolved ? c.success : sev}
            />
          </View>
          <Text style={[styles.bannerText, { color: isResolved ? c.success : sev }]}>
            {isResolved
              ? 'This complaint has been resolved.'
              : 'This complaint is awaiting resolution.'}
          </Text>
        </View>

        {/* Details */}
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionAccent, { backgroundColor: c.primary }]} />
          <Text style={[styles.sectionLabel, { color: c.foreground }]}>Details</Text>
        </View>
        <View style={[styles.block, { backgroundColor: c.card, borderColor: c.border }]}>
          {meta.map((m, i) => (
            <View
              key={m.label}
              style={[
                styles.metaRow,
                i < meta.length - 1 && { borderBottomWidth: 1, borderBottomColor: c.hairline },
              ]}
            >
              <View style={[styles.metaIcon, { backgroundColor: c.primary + '12' }]}>
                <Feather name={m.icon} size={15} color={c.primary} />
              </View>
              <Text style={[styles.metaLabel, { color: c.mutedForeground }]}>{m.label}</Text>
              <Text style={[styles.metaValue, { color: c.foreground }]} numberOfLines={2}>
                {m.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Live telemetry */}
        {tractor ? (
          <>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionAccent, { backgroundColor: c.primary }]} />
              <Text style={[styles.sectionLabel, { color: c.foreground }]}>Live Telemetry</Text>
            </View>
            <View style={styles.telemetryGrid}>
              {telemetry.map(t => (
                <View
                  key={t.label}
                  style={[
                    styles.telemetryChip,
                    { backgroundColor: c.card, borderColor: t.color + '30' },
                  ]}
                >
                  <View style={[styles.teleIcon, { backgroundColor: t.color + '14' }]}>
                    <Feather name={t.icon} size={14} color={t.color} />
                  </View>
                  <Text style={[styles.telemetryValue, { color: c.foreground }]}>{t.value}</Text>
                  <Text style={[styles.telemetryLabel, { color: c.mutedForeground }]}>{t.label}</Text>
                </View>
              ))}
            </View>
          </>
        ) : null}

        {/* Timeline */}
        {complaint.events && complaint.events.length > 0 ? (
          <>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionAccent, { backgroundColor: c.primary }]} />
              <Text style={[styles.sectionLabel, { color: c.foreground }]}>Timeline</Text>
            </View>
            <View style={[styles.block, { backgroundColor: c.card, borderColor: c.border, paddingVertical: 4 }]}>
              {complaint.events.map((event, i) => (
                <View
                  key={`${event.ts}-${event.type}-${i}`}
                  style={[
                    styles.metaRow,
                    i < complaint.events!.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: c.hairline,
                    },
                  ]}
                >
                  <View style={[styles.metaIcon, { backgroundColor: c.primary + '12' }]}>
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
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.2,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    padding: 24,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  heroCard: {
    borderRadius: 20,
    marginBottom: 4,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 4,
  },
  heroGradient: {
    padding: 24,
    alignItems: 'center',
    gap: 14,
  },
  heroIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  sectionAccent: {
    width: 4,
    height: 16,
    borderRadius: 2,
  },
  sectionLabel: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.2,
  },
  block: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 16,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 22,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  bannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  bannerText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    flex: 1,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  metaIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  metaLabel: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    width: 100,
    flexShrink: 0,
  },
  metaValue: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    flex: 1,
    textAlign: 'right',
  },
  telemetryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  telemetryChip: {
    flex: 1,
    flexBasis: '18%',
    minWidth: 64,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 5,
  },
  teleIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  telemetryValue: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.3,
  },
  telemetryLabel: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});

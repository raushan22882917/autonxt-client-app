import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Svg, { Circle, RadialGradient, Stop, Defs } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/StatusBadge';
import { severityColor, formatDateTime } from '@/lib/complaint';
import { FleetLoader } from '@/components/FleetLoader';
import { ComplaintDetail, fetchComplaintById } from '@/lib/appsync';
import { getTractorListRowImageSource, defaultTractorImage } from '@/lib/tractorImages';
import { isBreakdownComplaint } from '@/lib/isBreakdownComplaint';

// ── Reflection Glow Component (White Scale) ──
function ReflectionGlow({ size }: { size: number }) {
  const anim = React.useRef(new Animated.Value(0)).current;
  const { width: screenWidth } = Dimensions.get('window');
  const scale = Math.max(0.75, Math.min(1.2, screenWidth / 412));

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [anim]);

  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.7], // beautiful glowing base
  });

  const scaleX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1.05],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom: -size * 0.27,
        width: size,
        height: size,
        opacity,
        transform: [
          { scaleY: 0.26 },
          { scaleX },
          { translateX: -2 * scale },
          { translateY: 70 * scale },
          { rotate: '-20deg' }
        ],
      }}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <RadialGradient
            id="whiteTireGlow"
            cx="50%"
            cy="50%"
            rx="50%"
            ry="50%"
            fx="50%"
            fy="50%"
          >
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.9} />
            <Stop offset="30%" stopColor="#FFFFFF" stopOpacity={0.65} />
            <Stop offset="55%" stopColor="#FFFFFF" stopOpacity={0.45} />
            <Stop offset="80%" stopColor="#FFFFFF" stopOpacity={0.25} />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill="url(#whiteTireGlow)" />
      </Svg>
    </Animated.View>
  );
}

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

  if (loading && !complaint) {
    return (
      <View style={[styles.root, { backgroundColor: c.background }]}>
        <View style={{
          backgroundColor: '#7E152F',
          paddingTop: insets.top + 2,
          paddingBottom: 12,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
        }} />
        <View style={styles.empty}>
          <FleetLoader visible inline title="Ticket details" message="Loading issue information…" />
        </View>
      </View>
    );
  }

  if (!complaint) {
    return (
      <View style={[styles.root, { backgroundColor: c.background }]}>
        <View style={{
          backgroundColor: '#7E152F',
          paddingTop: insets.top + 2,
          paddingBottom: 12,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
        }} />
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

  const getDamageColor = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
      case 'HIGH':
        return '#DC2626'; // Vibrant Red
      case 'MEDIUM':
        return '#EAB308'; // Vibrant Yellow
      case 'LOW':
        return '#10B981'; // Green
      default:
        return c.mutedForeground;
    }
  };
  const sev = getDamageColor(complaint.severity);
  const isResolved = complaint.status === 'RESOLVED' || complaint.status === 'CLOSED';
  const bannerColor = isResolved ? c.success : sev;
  const bannerBg = isResolved ? c.successSoft : sev + '12';
  const bannerBorder = isResolved ? c.successBorder : sev + '35';

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
      {/* Redesigned Header Block with solid Burgundy background */}
      <View style={{
        backgroundColor: '#7E152F',
        paddingTop: insets.top + 2,
        paddingBottom: 24,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
      }}>
        {/* Hero Info inside the header */}
        <View style={{ position: 'relative', paddingHorizontal: 16, paddingRight: 160, paddingTop: 2, paddingBottom: 8 }}>


          <Text style={[styles.heroTitle, { color: '#FFFFFF', textAlign: 'left', fontSize: 18, lineHeight: 24, marginTop: 12 }]}>
            {complaint.title}
          </Text>
          
          <Text style={{ fontSize: 12, fontFamily: 'Inter_500Medium', color: 'rgba(255, 255, 255, 0.7)', marginTop: 4 }}>
            {[complaint.tractorModel, complaint.plantName || complaint.location].filter(Boolean).join(' · ')}
          </Text>

          <View style={[styles.badgeRow, { justifyContent: 'flex-start', marginTop: 10 }]}>
            <StatusBadge status={complaint.severity} small />
            <StatusBadge status={complaint.status} small />
            {isBreakdownComplaint(complaint) && (
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 20,
                borderWidth: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
              }}>
                <Feather name="alert-octagon" size={9} color="#FFFFFF" />
                <Text style={{ fontSize: 10, fontFamily: 'Inter_700Bold', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 0.2 }}>
                  Breakdown
                </Text>
              </View>
            )}
          </View>

          {/* Tractor illustration positioned at top right */}
          <View style={{ position: 'absolute', top: 2, right: 0, width: 160, height: 114, overflow: 'visible' }}>
            <ReflectionGlow size={160} />
            <Image
              source={tractor ? getTractorListRowImageSource(tractor) || defaultTractorImage : defaultTractorImage}
              style={{
                width: 160,
                height: 114,
              }}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1, marginTop: -20 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Details Overlapping Card */}
        <View style={{
          backgroundColor: c.card,
          borderRadius: 24,
          padding: 16,
          // 3D elevated card shadow
          shadowColor: '#120E10',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 3,
          marginBottom: 16,
        }}>
          {/* Description & Info Box (Search bar styling) */}
          <View style={{
            backgroundColor: '#F5F6F8',
            borderRadius: 16,
            borderLeftWidth: 4,
            borderLeftColor: sev,
            padding: 14,
            paddingLeft: 12,
            marginBottom: 16,
          }}>
            {/* Top row with Type and Severity (Damage) */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Feather name="tool" size={14} color="#7E152F" />
                <Text style={{ fontSize: 12, fontFamily: 'Inter_600SemiBold', color: '#120E10' }}>
                  Type: {isBreakdownComplaint(complaint) ? 'Breakdown' : 'General'}
                </Text>
              </View>
              {isBreakdownComplaint(complaint) && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Feather name="alert-triangle" size={14} color={sev} />
                  <Text style={{ fontSize: 12, fontFamily: 'Inter_600SemiBold', color: sev }}>
                    Damage: {complaint.severity}
                  </Text>
                </View>
              )}
            </View>

            {/* Separator line */}
            <View style={{ height: 1, backgroundColor: '#E2E8F0', marginBottom: 10 }} />

            <Text style={[styles.description, { color: c.foreground }]}>{complaint.description}</Text>
          </View>

          {/* Details list inside the same card */}
          <View style={{ gap: 2 }}>
            {meta.map((m, i) => (
              <View
                key={m.label}
                style={[
                  styles.metaRow,
                  i < meta.length - 1 && { borderBottomWidth: 1, borderBottomColor: c.hairline },
                ]}
              >
                <View style={[styles.metaIcon, { backgroundColor: c.primary + '12' }]}>
                  {m.icon === 'map-pin' ? (
                    <Image source={require('@/assets/images/LogoLocation.png')} style={{ width: 20, height: 20 }} resizeMode="contain" />
                  ) : (
                    <Feather name={m.icon} size={15} color={c.primary} />
                  )}
                </View>
                <Text style={[styles.metaLabel, { color: c.mutedForeground }]}>{m.label}</Text>
                <Text style={[styles.metaValue, { color: c.foreground }]} numberOfLines={2}>
                  {m.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Status banner */}
        <View
          style={[
            styles.statusBanner,
            {
              backgroundColor: bannerBg,
              borderColor: bannerBorder,
              marginBottom: 16,
            },
          ]}
        >
          <View style={[styles.bannerIcon, { backgroundColor: bannerColor + '18' }]}>
            <Feather
              name={isResolved ? 'check-circle' : 'clock'}
              size={18}
              color={bannerColor}
            />
          </View>
          <Text style={[styles.bannerText, { color: bannerColor }]}>
            {isResolved
              ? 'This complaint has been resolved.'
              : 'This complaint is awaiting resolution.'}
          </Text>
        </View>

        {/* Live telemetry */}
        {tractor ? (
          <>
            <View style={[styles.sectionHeader, { marginTop: 16 }]}>
              <View style={[styles.sectionAccent, { backgroundColor: c.primary }]} />
              <Text style={[styles.sectionLabel, { color: c.foreground }]}>Live Telemetry</Text>
            </View>
            <View style={[styles.telemetryGrid, { marginTop: 8 }]}>
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
            <View style={[styles.sectionHeader, { marginTop: 16 }]}>
              <View style={[styles.sectionAccent, { backgroundColor: c.primary }]} />
              <Text style={[styles.sectionLabel, { color: c.foreground }]}>Timeline</Text>
            </View>
            <View style={[styles.block, { backgroundColor: c.card, borderColor: c.border, paddingVertical: 4, marginTop: 8 }]}>
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
                    <Text style={[styles.metaValue, { color: c.foreground, textAlign: 'left' }]}>{event.type}</Text>
                    {event.note ? (
                      <Text style={[styles.metaLabel, { color: c.mutedForeground, width: 'auto' }]}>{event.note}</Text>
                    ) : null}
                    <Text style={[styles.metaLabel, { color: c.mutedForeground, width: 'auto', marginTop: 2 }]}>
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
    width: 44,
    height: 44,
    borderRadius: 14,
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
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
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

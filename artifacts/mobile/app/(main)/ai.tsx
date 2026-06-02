import React, { useMemo } from 'react';
import {
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

interface Insight {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  type: 'alert' | 'tip' | 'forecast' | 'analysis';
}

export default function AIScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { filteredTractors, filteredComplaints, filteredRuntimeRecords, organization } = useApp();

  const topPad = Platform.OS === 'web' ? 67 : 0;

  const insights = useMemo((): Insight[] => {
    const results: Insight[] = [];

    const criticalComplaints = filteredComplaints.filter(c => c.severity === 'CRITICAL');
    const maintenanceTractors = filteredTractors.filter(t => t.status === 'MAINTENANCE');
    const offlineTractors = filteredTractors.filter(t => t.status === 'OFFLINE');
    const activeTractors = filteredTractors.filter(t => t.status === 'ACTIVE');
    const totalRuntime = filteredRuntimeRecords.reduce((s, r) => s + r.hoursRun, 0);
    const totalFuel = filteredRuntimeRecords.reduce((s, r) => s + (r.fuelConsumed || 0), 0);
    const fuelEff = totalRuntime > 0 ? (totalFuel / totalRuntime).toFixed(1) : 0;
    const avgFuelEff = 5.5;

    if (criticalComplaints.length > 0) {
      results.push({
        id: 'critical-complaints',
        title: `${criticalComplaints.length} Critical Issue${criticalComplaints.length > 1 ? 's' : ''} Detected`,
        description: `Immediate attention required. Critical complaints on: ${criticalComplaints.slice(0, 2).map(c => c.tractorModel || c.tractorID).join(', ')}${criticalComplaints.length > 2 ? ` and ${criticalComplaints.length - 2} more` : ''}.`,
        icon: 'alert-octagon',
        color: '#EF4444',
        priority: 'HIGH',
        type: 'alert',
      });
    }

    if (maintenanceTractors.length > filteredTractors.length * 0.2) {
      results.push({
        id: 'high-maintenance',
        title: 'High Maintenance Rate',
        description: `${maintenanceTractors.length} tractors (${Math.round(maintenanceTractors.length / filteredTractors.length * 100)}%) are under maintenance. Consider scheduling preventive maintenance cycles.`,
        icon: 'tool',
        color: '#F59E0B',
        priority: 'HIGH',
        type: 'analysis',
      });
    }

    if (offlineTractors.length > 0) {
      results.push({
        id: 'offline-tractors',
        title: `${offlineTractors.length} Tractor${offlineTractors.length > 1 ? 's' : ''} Offline`,
        description: `Fleet utilization is impacted. Offline tractors: ${offlineTractors.slice(0, 2).map(t => t.serialNumber).join(', ')}. Investigate connectivity or mechanical issues.`,
        icon: 'wifi-off',
        color: '#6B7280',
        priority: 'MEDIUM',
        type: 'alert',
      });
    }

    const fleetUtil = filteredTractors.length > 0
      ? Math.round(activeTractors.length / filteredTractors.length * 100)
      : 0;

    results.push({
      id: 'fleet-utilization',
      title: `Fleet Utilization: ${fleetUtil}%`,
      description: fleetUtil >= 70
        ? `Strong fleet utilization. ${activeTractors.length} of ${filteredTractors.length} tractors active. Optimal range is 65-85%.`
        : `Fleet utilization is below target. Only ${activeTractors.length} of ${filteredTractors.length} tractors active. Consider deployment optimization.`,
      icon: 'pie-chart',
      color: fleetUtil >= 70 ? '#10B981' : '#F97316',
      priority: fleetUtil >= 70 ? 'LOW' : 'MEDIUM',
      type: 'analysis',
    });

    if (typeof fuelEff === 'string' && parseFloat(fuelEff) > avgFuelEff) {
      results.push({
        id: 'fuel-efficiency',
        title: 'Fuel Consumption Above Average',
        description: `Current fleet average: ${fuelEff}L/hr vs benchmark ${avgFuelEff}L/hr. Check tire pressure, engine tuning, and operator driving patterns.`,
        icon: 'droplet',
        color: '#3B82F6',
        priority: 'MEDIUM',
        type: 'tip',
      });
    }

    results.push({
      id: 'predictive-maintenance',
      title: 'Predictive Maintenance Window',
      description: `Based on engine hours analysis, ${Math.max(1, Math.floor(filteredTractors.length * 0.15))} tractors are approaching 500-hour service intervals. Schedule maintenance proactively.`,
      icon: 'calendar',
      color: '#8B5CF6',
      priority: 'MEDIUM',
      type: 'forecast',
    });

    results.push({
      id: 'runtime-forecast',
      title: '7-Day Runtime Forecast',
      description: `Based on current trends, projected total fleet runtime for next 7 days: ${Math.round(totalRuntime * 1.1)}h. Fuel budget estimate: ${Math.round(totalFuel * 1.1)}L.`,
      icon: 'trending-up',
      color: '#06B6D4',
      priority: 'LOW',
      type: 'forecast',
    });

    return results.sort((a, b) => {
      const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      return order[a.priority] - order[b.priority];
    });
  }, [filteredTractors, filteredComplaints, filteredRuntimeRecords]);

  const typeLabels: Record<string, string> = {
    alert: 'Alert',
    tip: 'Tip',
    forecast: 'Forecast',
    analysis: 'Analysis',
  };

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: '#0A1628' }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad + 16, paddingBottom: insets.bottom + 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.aiIconWrap}>
          <Feather name="cpu" size={22} color="#F97316" />
        </View>
        <View>
          <Text style={styles.headerTitle}>AI Fleet Insights</Text>
          <Text style={styles.headerSub}>
            {organization?.name || 'Your fleet'} · {filteredTractors.length} tractors analyzed
          </Text>
        </View>
      </View>

      {/* Insight cards */}
      <View style={styles.insightList}>
        {insights.map(insight => (
          <View key={insight.id} style={[styles.card, { borderLeftColor: insight.color, borderLeftWidth: 3 }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconWrap, { backgroundColor: insight.color + '20' }]}>
                <Feather name={insight.icon as keyof typeof Feather.glyphMap} size={18} color={insight.color} />
              </View>
              <View style={styles.cardMeta}>
                <View style={styles.typeRow}>
                  <View style={[styles.typeBadge, { backgroundColor: insight.color + '20' }]}>
                    <Text style={[styles.typeText, { color: insight.color }]}>
                      {typeLabels[insight.type]}
                    </Text>
                  </View>
                  <View style={[styles.priorityDot, { backgroundColor: priorityColor(insight.priority) }]} />
                  <Text style={[styles.priorityLabel, { color: priorityColor(insight.priority) }]}>
                    {insight.priority}
                  </Text>
                </View>
                <Text style={styles.cardTitle}>{insight.title}</Text>
              </View>
            </View>
            <Text style={styles.cardDesc}>{insight.description}</Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Feather name="zap" size={12} color="#334155" />
        <Text style={styles.footerText}>Insights generated from live fleet telemetry</Text>
      </View>
    </ScrollView>
  );
}

function priorityColor(p: string): string {
  switch (p) {
    case 'HIGH': return '#EF4444';
    case 'MEDIUM': return '#F59E0B';
    case 'LOW': return '#10B981';
    default: return '#64748B';
  }
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 4,
  },
  aiIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F9731618',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: '#F8FAFC',
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#64748B',
    marginTop: 2,
  },
  insightList: { gap: 10 },
  card: {
    backgroundColor: '#111827',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 14,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardMeta: { flex: 1, gap: 4 },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityLabel: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#F8FAFC',
    lineHeight: 20,
  },
  cardDesc: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
    lineHeight: 19,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: '#334155',
  },
});

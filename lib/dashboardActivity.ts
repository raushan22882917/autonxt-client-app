import type { Complaint, Tractor } from '@/lib/appsync';
import { isBreakdownComplaint } from '@/lib/isBreakdownComplaint';

export type ActivityKind = 'ticket' | 'notification';

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  title: string;
  subtitle: string;
  timestamp: string;
  icon: 'alert-circle' | 'alert-triangle' | 'tool' | 'wifi-off' | 'battery-charging' | 'bell' | 'check-circle';
  severity?: 'info' | 'warning' | 'critical';
  complaintID?: string;
  tractorID?: string;
}

function parseTime(iso: string): number {
  const t = new Date(iso).getTime();
  return Number.isNaN(t) ? 0 : t;
}

export function formatRelativeTime(iso: string): string {
  const t = parseTime(iso);
  if (!t) return '—';
  const sec = Math.floor((Date.now() - t) / 1000);
  if (sec < 60) return 'Just now';
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  if (sec < 604800) return `${Math.floor(sec / 86400)}d ago`;
  return new Date(t).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function buildDashboardActivity(
  complaints: Complaint[],
  tractors: Tractor[],
  limit = 12
): ActivityItem[] {
  const items: ActivityItem[] = [];

  for (const c of complaints) {
    const isBreakdown = isBreakdownComplaint(c);
    const sev =
      c.severity === 'CRITICAL' ? 'critical' : c.severity === 'HIGH' ? 'warning' : 'info';
    items.push({
      id: `ticket-${c.complaintID}`,
      kind: 'ticket',
      title: isBreakdown ? 'Breakdown ticket raised' : 'Ticket raised',
      subtitle: `${c.title}${c.breakdownType ? ` · ${c.breakdownType}` : ''} · ${c.tractorModel || c.tractorID}${c.plantName ? ` · ${c.plantName}` : ''}`,
      timestamp: c.createdAt,
      icon: isBreakdown || c.severity === 'CRITICAL' ? 'alert-triangle' : 'alert-circle',
      severity: sev,
      complaintID: c.complaintID,
      tractorID: c.tractorID || undefined,
    });
  }

  for (const t of tractors) {
    if (t.status === 'MAINTENANCE') {
      items.push({
        id: `maint-${t.tractorID}`,
        kind: 'notification',
        title: 'In maintenance',
        subtitle: `${t.model || t.displayName}${t.serviceStatusLabel ? ` · ${t.serviceStatusLabel}` : ''}`,
        timestamp: t.telemetryAt || t.updatedAt || t.createdAt || new Date(0).toISOString(),
        icon: 'tool',
        severity: 'warning',
        tractorID: t.tractorID,
      });
    } else if (t.status === 'OFFLINE') {
      items.push({
        id: `offline-${t.tractorID}`,
        kind: 'notification',
        title: 'Tractor offline',
        subtitle: `${t.model || t.displayName}${t.plantName ? ` · ${t.plantName}` : ''}`,
        timestamp: t.telemetryAt || t.updatedAt || new Date(0).toISOString(),
        icon: 'wifi-off',
        severity: 'warning',
        tractorID: t.tractorID,
      });
    } else if (t.isCharging) {
      items.push({
        id: `charge-${t.tractorID}`,
        kind: 'notification',
        title: 'Charging',
        subtitle: `${t.model || t.displayName}${t.soc != null ? ` · ${Math.round(t.soc)}% SOC` : ''}`,
        timestamp: t.telemetryAt || new Date(0).toISOString(),
        icon: 'battery-charging',
        severity: 'info',
        tractorID: t.tractorID,
      });
    }
  }

  const openCritical = complaints.filter(
    c => c.severity === 'CRITICAL' && (c.status === 'OPEN' || c.status === 'IN_PROGRESS')
  );
  for (const c of openCritical.slice(0, 5)) {
    items.push({
      id: `alert-${c.complaintID}`,
      kind: 'notification',
      title: 'Critical alert',
      subtitle: c.title,
      timestamp: c.createdAt,
      icon: 'alert-triangle',
      severity: 'critical',
      complaintID: c.complaintID,
      tractorID: c.tractorID || undefined,
    });
  }

  const resolved = complaints
    .filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED')
    .slice(0, 3);
  for (const c of resolved) {
    items.push({
      id: `resolved-${c.complaintID}`,
      kind: 'notification',
      title: 'Ticket resolved',
      subtitle: c.title,
      timestamp: c.resolvedAt || c.createdAt,
      icon: 'check-circle',
      severity: 'info',
      complaintID: c.complaintID,
      tractorID: c.tractorID || undefined,
    });
  }

  const seen = new Set<string>();
  return items
    .sort((a, b) => parseTime(b.timestamp) - parseTime(a.timestamp))
    .filter(item => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    })
    .slice(0, limit);
}

export function formatInr(amount: number): string {
  if (amount <= 0) return '₹0';
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

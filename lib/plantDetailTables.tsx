import React from 'react';
import { View } from 'react-native';
import type { DataTableColumn } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import type { Complaint, RuntimeRecord } from '@/lib/appsync';
import { formatDate } from '@/lib/complaint';
import { formatPct, type TractorPlantMetrics } from '@/lib/plantAnalysis';
import { manualRuntimeDayHours } from '@/lib/tractorRuntime';

export type PlantRuntimeLogRow = RuntimeRecord & {
  tractorLabel: string;
  dayHours: number;
};

export function plantTractorColumns(): DataTableColumn<TractorPlantMetrics>[] {
  return [
    {
      key: 'tractor',
      label: 'Tractor',
      flex: 1.35,
      minWidth: 99,
      render: m => m.tractor.displayName || m.tractor.model || m.tractor.tractorID,
    },
    {
      key: 'status',
      label: 'Status',
      flex: 1,
      minWidth: 72,
      render: m => (
        <View style={{ alignSelf: 'flex-start' }}>
          <StatusBadge status={m.tractor.status} small />
        </View>
      ),
    },
    {
      key: 'uptime',
      label: 'Uptime',
      flex: 0.75,
      minWidth: 52,
      align: 'right',
      render: m => formatPct(m.uptimePct),
    },
    {
      key: 'downtime',
      label: 'Down',
      flex: 0.75,
      minWidth: 48,
      align: 'right',
      render: m => formatPct(m.downtimePct),
    },
    {
      key: 'repair',
      label: 'Repair',
      flex: 0.7,
      minWidth: 44,
      align: 'right',
      render: m => (m.repairDays > 0 ? `${m.repairDays}d` : '—'),
    },
    {
      key: 'hours',
      label: 'Hours',
      flex: 0.75,
      minWidth: 48,
      align: 'right',
      render: m => (m.manualHours > 0 ? `${m.manualHours.toFixed(1)}h` : '—'),
    },
    {
      key: 'tickets',
      label: 'Open',
      flex: 0.55,
      minWidth: 40,
      align: 'right',
      render: m => (m.openTickets > 0 ? String(m.openTickets) : '—'),
    },
  ];
}

export function plantComplaintTableColumns(): DataTableColumn<Complaint>[] {
  return [
    {
      key: 'date',
      label: 'Raised',
      flex: 1,
      minWidth: 72,
      render: row => formatDate(row.createdAt),
    },
    {
      key: 'title',
      label: 'Title',
      flex: 1.4,
      minWidth: 80,
      render: row => row.title,
    },
    {
      key: 'tractor',
      label: 'Tractor',
      flex: 1,
      minWidth: 64,
      render: row => row.tractorModel || row.tractorID || '—',
    },
    {
      key: 'severity',
      label: 'Severity',
      flex: 0.95,
      minWidth: 68,
      render: row => (
        <View style={{ alignSelf: 'flex-start' }}>
          <StatusBadge status={row.severity} small />
        </View>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      flex: 0.95,
      minWidth: 72,
      render: row => (
        <View style={{ alignSelf: 'flex-start' }}>
          <StatusBadge status={row.status} small />
        </View>
      ),
    },
  ];
}

export function plantRuntimeLogColumns(): DataTableColumn<PlantRuntimeLogRow>[] {
  return [
    {
      key: 'date',
      label: 'Date',
      flex: 1,
      minWidth: 72,
      render: r => formatDate(r.date),
    },
    {
      key: 'tractor',
      label: 'Tractor',
      flex: 1.2,
      minWidth: 72,
      render: r => r.tractorLabel,
    },
    {
      key: 'hours',
      label: 'Hours',
      flex: 0.7,
      minWidth: 48,
      align: 'right',
      render: r => (r.dayHours > 0 ? r.dayHours.toFixed(1) : '—'),
    },
    {
      key: 'start',
      label: 'Start',
      flex: 0.85,
      minWidth: 52,
      align: 'right',
      render: r =>
        r.startCumulativeRuntime != null ? String(r.startCumulativeRuntime) : '—',
    },
    {
      key: 'end',
      label: 'End',
      flex: 0.85,
      minWidth: 52,
      align: 'right',
      render: r =>
        r.endCumulativeRuntime != null ? String(r.endCumulativeRuntime) : '—',
    },
  ];
}

/** Runtime tab: per-tractor summary with log count. */
export function plantRuntimeTractorColumns(
  logCountByTractor: Map<string, number>
): DataTableColumn<TractorPlantMetrics>[] {
  return [
    {
      key: 'tractor',
      label: 'Tractor',
      flex: 1.35,
      minWidth: 99,
      render: m => m.tractor.displayName || m.tractor.model,
    },
    {
      key: 'uptime',
      label: 'Uptime',
      flex: 0.75,
      minWidth: 52,
      align: 'right',
      render: m => formatPct(m.uptimePct),
    },
    {
      key: 'downtime',
      label: 'Down',
      flex: 0.75,
      minWidth: 48,
      align: 'right',
      render: m => formatPct(m.downtimePct),
    },
    {
      key: 'repair',
      label: 'Repair',
      flex: 0.65,
      minWidth: 44,
      align: 'right',
      render: m => (m.repairDays > 0 ? `${m.repairDays}d` : '—'),
    },
    {
      key: 'logged',
      label: 'Hours',
      flex: 0.75,
      minWidth: 48,
      align: 'right',
      render: m => (m.manualHours > 0 ? `${m.manualHours.toFixed(1)}h` : '—'),
    },
    {
      key: 'logs',
      label: 'Logs',
      flex: 0.55,
      minWidth: 40,
      align: 'right',
      render: m => {
        const n = logCountByTractor.get(m.tractor.tractorID) ?? 0;
        return n > 0 ? String(n) : '—';
      },
    },
  ];
}

export function buildPlantRuntimeLogRows(
  records: RuntimeRecord[],
  tractorLabel: (tractorID: string, fallback?: string) => string
): PlantRuntimeLogRow[] {
  return [...records]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(r => ({
      ...r,
      tractorLabel: tractorLabel(r.tractorID, r.tractorModel),
      dayHours: manualRuntimeDayHours(r),
    }));
}

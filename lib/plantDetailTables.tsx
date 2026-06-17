import React from 'react';
import { Text } from 'react-native';
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
      key: 'alias',
      label: 'Alias',
      flex: 1.2,
      minWidth: 100,
      render: m => m.tractor.alias || '—',
    },
    {
      key: 'createdAt',
      label: 'Created',
      flex: 1,
      minWidth: 100,
      align: 'right',
      render: m => m.tractor.createdAt ? formatDate(m.tractor.createdAt) : '—',
    },
  ];
}

export function plantRuntimeLogColumns(): DataTableColumn<PlantRuntimeLogRow>[] {
  return [
    {
      key: 'alias',
      label: 'Alias',
      flex: 1.2,
      minWidth: 100,
      render: r => r.tractorLabel || '—',
    },
    {
      key: 'date',
      label: 'Date',
      flex: 1,
      minWidth: 80,
      render: r => formatDate(r.date),
    },
    {
      key: 'start',
      label: 'Start Cum.',
      flex: 1,
      minWidth: 80,
      align: 'right',
      render: r => r.startCumulativeRuntime != null ? String(r.startCumulativeRuntime) : '—',
    },
    {
      key: 'end',
      label: 'End Cum.',
      flex: 1,
      minWidth: 80,
      align: 'right',
      render: r => r.endCumulativeRuntime != null ? String(r.endCumulativeRuntime) : '—',
    },
    {
      key: 'today',
      label: 'Today Cum.',
      flex: 1,
      minWidth: 80,
      align: 'right',
      render: r => r.dayHours != null ? String(r.dayHours) : '—',
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

export function plantComplaintTableColumns(): DataTableColumn<Complaint>[] {
  return [
    {
      key: 'tractor',
      label: 'Tractor',
      flex: 1,
      minWidth: 100,
      render: c => c.tractorModel || c.tractorID,
    },
    {
      key: 'status',
      label: 'Status',
      flex: 0.8,
      minWidth: 90,
      render: c => <StatusBadge status={c.status} />,
    },
    {
      key: 'date',
      label: 'Date',
      flex: 0.7,
      minWidth: 80,
      render: c => formatDate(c.createdAt),
    },
  ];
}

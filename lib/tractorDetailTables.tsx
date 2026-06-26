import React from 'react';
import { View } from 'react-native';
import type { DataTableColumn } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import type {
  AnalyticsBucket,
  Complaint,
  RawManualRuntimeEntry,
  UsageSegment,
} from '@/lib/appsync';
import { formatDate, formatDateTime } from '@/lib/complaint';
import { faultDetailLines, faultTitle } from '@/lib/tractorMetrics';
import type { FaultValues } from '@/graphql/API';
import { SegmentType } from '@/graphql/API';

function fmtNum(v: number | null | undefined, digits = 0): string {
  if (v === null || v === undefined || Number.isNaN(v)) return '—';
  return (Math.round(v * 10 ** digits) / 10 ** digits).toLocaleString();
}

function fmtDuration(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined || Number.isNaN(seconds) || seconds <= 0) return '—';
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function fmtUnit(v: number | null | undefined, unit: string, digits = 1): string {
  if (v === null || v === undefined || Number.isNaN(v)) return '—';
  return `${fmtNum(v, digits)} ${unit}`;
}

import {
  type DailySegmentGroup,
  formatSegmentTableTime,
  socRange,
} from '@/lib/usageSegmentDetail';

export function tripSummaryRows(bucket: AnalyticsBucket | null | undefined): { label: string; value: string }[] {
  if (!bucket) return [];
  return [
    { label: 'Total trips', value: fmtNum(bucket.totalCount) },
    { label: 'Run time', value: fmtDuration(bucket.totalDuration) },
    { label: 'Distance', value: fmtUnit(bucket.totalDistance, 'km') },
    { label: 'Energy used', value: fmtUnit(bucket.totalKwhDelivered, 'kWh') },
    {
      label: 'Cost savings',
      value:
        bucket.totalCostSavings == null ? '—' : `₹${fmtNum(bucket.totalCostSavings)}`,
    },
    { label: 'Trees saved', value: fmtNum(bucket.totalTreesSaved, 1) },
  ];
}

export function chargeSummaryRows(bucket: AnalyticsBucket | null | undefined): { label: string; value: string }[] {
  if (!bucket) return [];
  return [
    { label: 'Charge sessions', value: fmtNum(bucket.totalCount) },
    { label: 'Charge time', value: fmtDuration(bucket.totalDuration) },
    { label: 'Energy added', value: fmtUnit(bucket.totalKwhCharged, 'kWh') },
    { label: 'Disconnects', value: fmtNum(bucket.totalDisconnectCount) },
  ];
}

function fmtGroupDuration(sec: number): string {
  return fmtDuration(sec > 0 ? sec : null);
}

/** Trip / charge list — one row per day; tap for all records that day */
export const tripDayColumns: DataTableColumn<DailySegmentGroup>[] = [
  {
    key: 'start',
    label: 'Start',
    flex: 1.1,
    render: g => formatSegmentTableTime(g.startTime),
  },
  {
    key: 'end',
    label: 'End',
    flex: 1.1,
    render: g => formatSegmentTableTime(g.endTime),
  },
  {
    key: 'duration',
    label: 'Duration',
    flex: 0.9,
    render: g =>
      g.count > 1 ? `${fmtGroupDuration(g.durationSec)} · ${g.count}×` : fmtGroupDuration(g.durationSec),
  },
  {
    key: 'soc',
    label: 'SOC',
    flex: 0.8,
    align: 'right',
    render: g => socRange(g.initialSOC, g.finalSOC),
  },
];

export const chargeDayColumns: DataTableColumn<DailySegmentGroup>[] = tripDayColumns;

/** Show API value exactly — no units, rounding, or unit conversion. */
export function exactApiValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return String(value);
}

export const runtimeColumns: DataTableColumn<RawManualRuntimeEntry>[] = [
  {
    key: 'date',
    label: 'Date',
    flex: 1.05,
    minWidth: 82,
    render: r => exactApiValue(r.date),
  },
  {
    key: 'startCumulativeRuntime',
    label: 'Start',
    flex: 1,
    minWidth: 68,
    align: 'right',
    render: r => exactApiValue(r.startCumulativeRuntime),
  },
  {
    key: 'endCumulativeRuntime',
    label: 'End',
    flex: 1,
    minWidth: 68,
    align: 'right',
    render: r => exactApiValue(r.endCumulativeRuntime),
  },
  {
    key: 'todaysRuntime',
    label: 'Total',
    flex: 0.85,
    minWidth: 56,
    align: 'right',
    render: r => exactApiValue(r.todaysRuntime),
  },
];

export function manualRuntimeRowKey(r: RawManualRuntimeEntry): string {
  return `${r.loggerID}-${r.date}`;
}

export const faultColumns: DataTableColumn<FaultValues>[] = [
  {
    key: 'time',
    label: 'Time',
    width: 130,
    render: f =>
      f.startTime
        ? `${formatDateTime(f.startTime)}${f.endTime ? `\n→ ${formatDateTime(f.endTime)}` : ''}`
        : '—',
  },
  {
    key: 'fault',
    label: 'Fault',
    width: 120,
    render: f => faultTitle(f),
  },
  {
    key: 'details',
    label: 'Details',
    width: 160,
    render: f => faultDetailLines(f).join(' · ') || '—',
  },
];

export function complaintColumns(): DataTableColumn<Complaint>[] {
  return [
    {
      key: 'date',
      label: 'Raised',
      width: 110,
      render: row => formatDateTime(row.createdAt),
    },
    {
      key: 'title',
      label: 'Title',
      width: 140,
      render: row => row.title,
    },
    {
      key: 'type',
      label: 'Type',
      width: 100,
      render: row =>
        row.breakdownType || row.maintenanceType || row.problemSubType || '—',
    },
    {
      key: 'severity',
      label: 'Severity',
      width: 100,
      render: row => (
        <View style={{ alignSelf: 'flex-start' }}>
          <StatusBadge status={row.severity} small />
        </View>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: 110,
      render: row => (
        <View style={{ alignSelf: 'flex-start' }}>
          <StatusBadge status={row.status} small />
        </View>
      ),
    },
  ];
}

export function segmentKey(seg: UsageSegment): string {
  return `${seg.type}-${seg.startTime}-${seg.endTime ?? ''}`;
}

export {
  groupSegmentsByDay,
  dailyGroupKey,
  type DailySegmentGroup,
} from '@/lib/usageSegmentDetail';

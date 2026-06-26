import type { UsageSegment } from '@/lib/appsync';
import { formatDateTime } from '@/lib/complaint';
import { formatDisplayDate, toDateKey } from '@/lib/dailyReport';
import { segmentTypeLabel } from '@/lib/tractorRuntime';

function fmtNum(v: number | null | undefined, digits = 1): string {
  if (v == null || Number.isNaN(v)) return '—';
  return digits > 0 ? v.toFixed(digits) : String(Math.round(v));
}

function fmtDuration(seconds: number | null | undefined, formatted?: string | null): string {
  if (formatted?.trim()) return formatted;
  if (seconds == null || Number.isNaN(seconds) || seconds <= 0) return '—';
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function socRange(initial?: number | null, final?: number | null): string {
  if (initial == null && final == null) return '—';
  if (initial != null && final != null) return `${Math.round(initial)}→${Math.round(final)}%`;
  if (final != null) return `${Math.round(final)}%`;
  return `${Math.round(initial!)}%`;
}

/** Compact for table cells */
export function formatSegmentTableTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export type DetailField = { label: string; value: string };

/** One table row per calendar day; detail sheet lists every segment that day. */
export interface DailySegmentGroup {
  dateKey: string;
  dateLabel: string;
  count: number;
  segments: UsageSegment[];
  startTime: string;
  endTime: string | null;
  durationSec: number;
  initialSOC: number | null;
  finalSOC: number | null;
}

function parseTime(iso: string): number {
  const t = new Date(iso).getTime();
  return Number.isNaN(t) ? 0 : t;
}

export function groupSegmentsByDay(segments: UsageSegment[]): DailySegmentGroup[] {
  const byDay = new Map<string, UsageSegment[]>();

  for (const seg of segments) {
    if (!seg.startTime) continue;
    const key = toDateKey(seg.startTime);
    const list = byDay.get(key) ?? [];
    list.push(seg);
    byDay.set(key, list);
  }

  const groups: DailySegmentGroup[] = [];

  for (const [dateKey, daySegments] of byDay.entries()) {
    const sorted = [...daySegments].sort((a, b) => parseTime(a.startTime) - parseTime(b.startTime));
    let durationSec = 0;
    for (const s of sorted) {
      if (s.durationSec != null && !Number.isNaN(s.durationSec)) {
        durationSec += s.durationSec;
      }
    }

    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    let endTime: string | null = last.endTime ?? null;
    let latestEnd = parseTime(endTime ?? '');
    for (const s of sorted) {
      if (s.endTime && parseTime(s.endTime) > latestEnd) {
        latestEnd = parseTime(s.endTime);
        endTime = s.endTime;
      }
    }

    groups.push({
      dateKey,
      dateLabel: formatDisplayDate(dateKey),
      count: sorted.length,
      segments: sorted,
      startTime: first.startTime,
      endTime,
      durationSec,
      initialSOC: first.initialSOC ?? null,
      finalSOC: last.finalSOC ?? null,
    });
  }

  return groups.sort((a, b) => b.dateKey.localeCompare(a.dateKey));
}

export function dailyGroupKey(group: DailySegmentGroup): string {
  return group.dateKey;
}

export function tripDetailFields(seg: UsageSegment): DetailField[] {
  return [
    { label: 'Type', value: segmentTypeLabel(seg.type) },
    { label: 'Start', value: formatDateTime(seg.startTime) },
    { label: 'End', value: seg.endTime ? formatDateTime(seg.endTime) : '—' },
    {
      label: 'Duration',
      value: fmtDuration(seg.durationSec, seg.durationFormatted),
    },
    { label: 'SOC', value: socRange(seg.initialSOC, seg.finalSOC) },
    {
      label: 'Distance',
      value: seg.distanceTravelled != null ? `${fmtNum(seg.distanceTravelled)} km` : '—',
    },
    {
      label: 'Energy used',
      value: seg.kwhConsumed != null ? `${fmtNum(seg.kwhConsumed)} kWh` : '—',
    },
    {
      label: 'Cost savings',
      value: seg.costSavings != null ? `₹${fmtNum(seg.costSavings, 0)}` : '—',
    },
    {
      label: 'Trees saved',
      value: seg.treesSaved != null ? fmtNum(seg.treesSaved, 1) : '—',
    },
    {
      label: 'Disconnects',
      value: fmtNum(seg.disconnects?.totalCount, 0),
    },
    { label: 'Tractor / device', value: seg.tractorID || '—' },
  ];
}

export function chargeDetailFields(seg: UsageSegment): DetailField[] {
  return [
    { label: 'Type', value: segmentTypeLabel(seg.type) },
    { label: 'Start', value: formatDateTime(seg.startTime) },
    { label: 'End', value: seg.endTime ? formatDateTime(seg.endTime) : '—' },
    {
      label: 'Duration',
      value: fmtDuration(seg.durationSec, seg.durationFormatted),
    },
    { label: 'SOC', value: socRange(seg.initialSOC, seg.finalSOC) },
    {
      label: 'Energy added',
      value: seg.kwhCharged != null ? `${fmtNum(seg.kwhCharged)} kWh` : '—',
    },
    {
      label: 'Disconnects',
      value: fmtNum(seg.disconnects?.totalCount, 0),
    },
    {
      label: 'Disconnect duration',
      value: fmtDuration(seg.disconnects?.totalDuration ?? null),
    },
    { label: 'Tractor / device', value: seg.tractorID || '—' },
  ];
}

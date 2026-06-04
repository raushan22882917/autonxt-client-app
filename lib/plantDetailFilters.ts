import type { Complaint, RuntimeRecord, Tractor } from '@/lib/appsync';
import {
  type ComplaintPeriod,
  type SeverityFilter,
  complaintPeriodLabel,
  isActiveComplaint,
  isComplaintInPeriod,
  startOfWeek,
} from '@/lib/complaintFilters';
import { isBreakdownComplaint } from '@/lib/isBreakdownComplaint';
import { isDateKeyInMonth, startOfMonth } from '@/lib/periodFilter';
import { toDateKey } from '@/lib/dailyReport';
import {
  repairDaysForComplaint,
  statusDowntimePct,
  statusUptimePct,
  type TractorPlantMetrics,
} from '@/lib/plantAnalysis';
import { manualRuntimeDayHours } from '@/lib/tractorRuntime';
import type { PlantRuntimeLogRow } from '@/lib/plantDetailTables';

export type TractorStatusFilter = 'ALL' | Tractor['status'];

export type PlantDetailFilterValues = {
  period: ComplaintPeriod;
  customMonth: Date;
  tractorStatus: TractorStatusFilter;
  tractorID: string | null;
  severity: SeverityFilter;
  breakdownOnly: boolean;
  search: string;
};

export const DEFAULT_PLANT_DETAIL_FILTERS: PlantDetailFilterValues = {
  period: 'MONTH',
  customMonth: startOfMonth(new Date()),
  tractorStatus: 'ALL',
  tractorID: null,
  severity: 'ALL',
  breakdownOnly: false,
  search: '',
};

export const TRACTOR_STATUS_OPTIONS: { key: TractorStatusFilter; label: string }[] = [
  { key: 'ALL', label: 'All statuses' },
  { key: 'ACTIVE', label: 'Active' },
  { key: 'IDLE', label: 'Idle' },
  { key: 'MAINTENANCE', label: 'Maintenance' },
  { key: 'OFFLINE', label: 'Offline' },
];

function matchesSearch(hay: string, q: string): boolean {
  if (!q) return true;
  return hay.toLowerCase().includes(q.trim().toLowerCase());
}

export function isRuntimeInPeriod(
  dateIso: string,
  period: ComplaintPeriod,
  customMonth?: Date
): boolean {
  if (period === 'ALL') return true;
  const dateKey = toDateKey(dateIso);
  const now = new Date();
  const todayKey = toDateKey(now);

  switch (period) {
    case 'WEEK': {
      const weekStart = toDateKey(startOfWeek(now));
      return dateKey >= weekStart && dateKey <= todayKey;
    }
    case 'MONTH':
      return isDateKeyInMonth(dateIso, now);
    case 'LAST_MONTH': {
      const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return isDateKeyInMonth(dateIso, last);
    }
    case 'CUSTOM':
      return isDateKeyInMonth(dateIso, customMonth ?? now);
    default:
      return true;
  }
}

export function filterComplaintsByPeriod(
  rows: Complaint[],
  period: ComplaintPeriod,
  customMonth?: Date
): Complaint[] {
  if (period === 'ALL') return rows;
  return rows.filter(c => isComplaintInPeriod(c, period, customMonth));
}

export function filterRuntimeRecordsByPeriod(
  rows: RuntimeRecord[],
  period: ComplaintPeriod,
  customMonth?: Date
): RuntimeRecord[] {
  if (period === 'ALL') return rows;
  return rows.filter(r => isRuntimeInPeriod(r.date, period, customMonth));
}

/** Tractor IDs with a ticket raised or runtime log in the selected period. */
export function tractorIdsActiveInPeriod(
  plantComplaints: Complaint[],
  plantRuntime: RuntimeRecord[],
  period: ComplaintPeriod,
  customMonth?: Date
): Set<string> {
  const ids = new Set<string>();
  if (period === 'ALL') return ids;
  for (const c of plantComplaints) {
    if (isComplaintInPeriod(c, period, customMonth)) ids.add(c.tractorID);
  }
  for (const r of plantRuntime) {
    if (isRuntimeInPeriod(r.date, period, customMonth)) ids.add(r.tractorID);
  }
  return ids;
}

/** Rebuild per-tractor stats using only data inside the date range. */
export function applyPeriodToTractorMetrics(
  metrics: TractorPlantMetrics[],
  plantComplaints: Complaint[],
  plantRuntime: RuntimeRecord[],
  period: ComplaintPeriod,
  customMonth?: Date
): TractorPlantMetrics[] {
  if (period === 'ALL') return metrics;

  const activeIds = tractorIdsActiveInPeriod(
    plantComplaints,
    plantRuntime,
    period,
    customMonth
  );

  return metrics
    .filter(m => activeIds.has(m.tractor.tractorID))
    .map(m => {
      const tid = m.tractor.tractorID;
      const periodComplaints = plantComplaints.filter(
        c => c.tractorID === tid && isComplaintInPeriod(c, period, customMonth)
      );
      const periodRuntime = plantRuntime.filter(
        r => r.tractorID === tid && isRuntimeInPeriod(r.date, period, customMonth)
      );
      const manualHours = periodRuntime.reduce(
        (sum, r) => sum + manualRuntimeDayHours(r),
        0
      );
      const openTickets = periodComplaints.filter(isActiveComplaint).length;
      const breakdowns = periodComplaints.filter(isBreakdownComplaint);
      const repairDays = breakdowns
        .filter(isActiveComplaint)
        .reduce((sum, c) => sum + repairDaysForComplaint(c), 0);

      return {
        tractor: m.tractor,
        manualHours,
        uptimePct: statusUptimePct(m.tractor.status),
        downtimePct: statusDowntimePct(m.tractor.status),
        repairDays,
        openTickets,
        breakdownCount: breakdowns.length,
      };
    });
}

export function filterTractorMetrics(
  rows: TractorPlantMetrics[],
  filters: PlantDetailFilterValues
): TractorPlantMetrics[] {
  const q = filters.search.trim().toLowerCase();
  return rows.filter(m => {
    if (filters.tractorID && m.tractor.tractorID !== filters.tractorID) return false;
    if (filters.tractorStatus !== 'ALL' && m.tractor.status !== filters.tractorStatus)
      return false;
    const hay = [
      m.tractor.displayName,
      m.tractor.model,
      m.tractor.tractorID,
      m.tractor.registerNumber,
    ]
      .filter(Boolean)
      .join(' ');
    return matchesSearch(hay, q);
  });
}

export function filterPlantComplaints(
  rows: Complaint[],
  filters: PlantDetailFilterValues
): Complaint[] {
  const q = filters.search.trim().toLowerCase();
  return rows.filter(c => {
    if (filters.tractorID && c.tractorID !== filters.tractorID) return false;
    if (!isComplaintInPeriod(c, filters.period, filters.customMonth)) return false;
    if (filters.severity !== 'ALL' && c.severity !== filters.severity) return false;
    if (filters.breakdownOnly && !isBreakdownComplaint(c)) return false;
    const hay = [c.title, c.description, c.tractorModel, c.tractorID, c.reportedBy]
      .filter(Boolean)
      .join(' ');
    return matchesSearch(hay, q);
  });
}

export function filterRuntimeLogs(
  rows: PlantRuntimeLogRow[],
  filters: PlantDetailFilterValues
): PlantRuntimeLogRow[] {
  const q = filters.search.trim().toLowerCase();
  return rows.filter(r => {
    if (filters.tractorID && r.tractorID !== filters.tractorID) return false;
    if (!isRuntimeInPeriod(r.date, filters.period, filters.customMonth)) return false;
    const hay = [r.tractorLabel, r.tractorID, r.date].filter(Boolean).join(' ');
    return matchesSearch(hay, q);
  });
}

export function countActivePlantDetailFilters(filters: PlantDetailFilterValues): number {
  let n = 0;
  if (filters.tractorStatus !== 'ALL') n += 1;
  if (filters.tractorID) n += 1;
  if (filters.severity !== 'ALL') n += 1;
  if (filters.breakdownOnly) n += 1;
  if (filters.search.trim()) n += 1;
  return n;
}

export function isPeriodFilterActive(period: ComplaintPeriod): boolean {
  return period !== 'ALL';
}

export function plantDetailFilterSummary(
  filters: PlantDetailFilterValues,
  tractorOptions: { id: string; label: string }[]
): string {
  const parts: string[] = [
    complaintPeriodLabel(
      filters.period,
      filters.period === 'CUSTOM' ? filters.customMonth : undefined
    ),
  ];
  if (filters.tractorID) {
    const t = tractorOptions.find(o => o.id === filters.tractorID);
    parts.push(t?.label ?? 'Tractor');
  }
  if (filters.tractorStatus !== 'ALL') parts.push(filters.tractorStatus);
  if (filters.severity !== 'ALL') parts.push(filters.severity);
  if (filters.breakdownOnly) parts.push('Breakdown');
  if (filters.search.trim()) parts.push(`"${filters.search.trim()}"`);
  return parts.join(' · ');
}

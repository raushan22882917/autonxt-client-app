import type { Complaint } from '@/lib/appsync';
import { toDateKey } from '@/lib/dailyReport';
import { isDateKeyInMonth, monthLabel, startOfMonth } from '@/lib/periodFilter';
import { isBreakdownComplaint } from '@/lib/isBreakdownComplaint';

export const COMPLAINT_PERIOD_OPTIONS = [
  { key: 'ALL', label: 'All time' },
  { key: 'WEEK', label: 'This week' },
  { key: 'MONTH', label: 'This month' },
  { key: 'LAST_MONTH', label: 'Last month' },
  { key: 'CUSTOM', label: 'Pick month' },
] as const;

export type ComplaintPeriod = (typeof COMPLAINT_PERIOD_OPTIONS)[number]['key'];

export type ComplaintFilterValues = {
  period: ComplaintPeriod;
  customMonth: Date;
  statusTab: ComplaintStatusTab;
  severity: SeverityFilter;
  breakdownOnly: boolean;
};

export const DEFAULT_COMPLAINT_FILTERS: ComplaintFilterValues = {
  period: 'MONTH',
  customMonth: startOfMonth(new Date()),
  statusTab: 'OPEN',
  severity: 'ALL',
  breakdownOnly: false,
};

export function countActiveComplaintFilters(filters: ComplaintFilterValues): number {
  let n = 0;
  if (filters.period !== DEFAULT_COMPLAINT_FILTERS.period) n += 1;
  if (filters.statusTab !== DEFAULT_COMPLAINT_FILTERS.statusTab) n += 1;
  if (filters.severity !== DEFAULT_COMPLAINT_FILTERS.severity) n += 1;
  if (filters.breakdownOnly) n += 1;
  return n;
}

/** Monday-start week containing `ref`. */
export function startOfWeek(ref: Date): Date {
  const d = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
  const day = d.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + mondayOffset);
  return d;
}

export function complaintCreatedDateKey(c: Complaint): string {
  return toDateKey(c.createdAt);
}

export function isComplaintInPeriod(
  c: Complaint,
  period: ComplaintPeriod,
  customMonth?: Date
): boolean {
  if (period === 'ALL') return true;
  const createdKey = complaintCreatedDateKey(c);
  const now = new Date();
  const todayKey = toDateKey(now);

  switch (period) {
    case 'WEEK': {
      const weekStart = toDateKey(startOfWeek(now));
      return createdKey >= weekStart && createdKey <= todayKey;
    }
    case 'MONTH':
      return isDateKeyInMonth(c.createdAt, now);
    case 'LAST_MONTH': {
      const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return isDateKeyInMonth(c.createdAt, last);
    }
    case 'CUSTOM': {
      const month = customMonth ?? now;
      return isDateKeyInMonth(c.createdAt, month);
    }
    default:
      return true;
  }
}

export function complaintPeriodLabel(period: ComplaintPeriod, customMonth?: Date): string {
  switch (period) {
    case 'ALL':
      return 'All time';
    case 'WEEK':
      return 'This week';
    case 'MONTH':
      return monthLabel(new Date());
    case 'LAST_MONTH': {
      const last = new Date();
      last.setMonth(last.getMonth() - 1);
      return monthLabel(startOfMonth(last));
    }
    case 'CUSTOM':
      return customMonth ? monthLabel(customMonth) : 'Selected month';
    default:
      return 'All time';
  }
}

export function filterComplaintsByPeriod(
  complaints: Complaint[],
  period: ComplaintPeriod,
  customMonth?: Date
): Complaint[] {
  return complaints.filter(c => isComplaintInPeriod(c, period, customMonth));
}

/** Matches GraphQL ComplaintState; OPEN = all non-terminal tickets (default). */
export type ComplaintStatusTab =
  | 'OPEN'
  | 'PENDING'
  | 'ACCEPTED'
  | 'RESOLVING'
  | 'RESOLVED'
  | 'CLOSED'
  | 'CANCELLED'
  | 'ALL';

export const COMPLAINT_STATUS_TABS: { key: ComplaintStatusTab; label: string }[] = [
  { key: 'OPEN', label: 'Open' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'ACCEPTED', label: 'Accepted' },
  { key: 'RESOLVING', label: 'Resolving' },
  { key: 'RESOLVED', label: 'Resolved' },
  { key: 'CLOSED', label: 'Closed' },
  { key: 'CANCELLED', label: 'Cancelled' },
  { key: 'ALL', label: 'All' },
];

export const SEVERITY_FILTERS = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const;
export type SeverityFilter = (typeof SEVERITY_FILTERS)[number];

const ACTIVE_STATES = new Set(['PENDING', 'ACCEPTED', 'RESOLVING']);

export function resolveComplaintState(c: Complaint): string {
  if (c.state?.trim()) return c.state.toUpperCase();
  switch (c.status) {
    case 'OPEN':
      return 'PENDING';
    case 'IN_PROGRESS':
      return 'ACCEPTED';
    case 'RESOLVED':
      return 'RESOLVED';
    case 'CLOSED':
      return 'CLOSED';
    default:
      return 'PENDING';
  }
}

export function isActiveComplaint(c: Complaint): boolean {
  const state = resolveComplaintState(c);
  if (ACTIVE_STATES.has(state)) return true;
  return c.status === 'OPEN' || c.status === 'IN_PROGRESS';
}

export function matchesStatusTab(c: Complaint, tab: ComplaintStatusTab): boolean {
  if (tab === 'ALL') return true;
  if (tab === 'OPEN') return isActiveComplaint(c);
  return resolveComplaintState(c) === tab;
}

export function countByStatusTab(complaints: Complaint[], tab: ComplaintStatusTab): number {
  return complaints.filter(c => matchesStatusTab(c, tab)).length;
}

export interface ComplaintListFilters {
  statusTab: ComplaintStatusTab;
  severity: SeverityFilter;
  breakdownOnly: boolean;
  search: string;
  period: ComplaintPeriod;
  customMonth?: Date;
}

export function filterComplaintList(
  complaints: Complaint[],
  filters: ComplaintListFilters
): Complaint[] {
  const q = filters.search.trim().toLowerCase();
  return complaints
    .filter(c => isComplaintInPeriod(c, filters.period, filters.customMonth))
    .filter(c => matchesStatusTab(c, filters.statusTab))
    .filter(c => filters.severity === 'ALL' || c.severity === filters.severity)
    .filter(c => !filters.breakdownOnly || isBreakdownComplaint(c))
    .filter(c => {
      if (!q) return true;
      const hay = [
        c.title,
        c.description,
        c.tractorModel,
        c.tractorID,
        c.plantName,
        c.reportedBy,
        c.problemSubType,
        c.breakdownType,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function emptyMessageForTab(
  tab: ComplaintStatusTab,
  breakdownOnly: boolean,
  periodLabel?: string
): string {
  const suffix = periodLabel && periodLabel !== 'All time' ? ` in ${periodLabel}` : '';
  if (breakdownOnly) return `No breakdown tickets${suffix}`;
  switch (tab) {
    case 'OPEN':
      return `No open tickets${suffix}`;
    case 'PENDING':
      return `No pending tickets${suffix}`;
    case 'ACCEPTED':
      return `No accepted tickets${suffix}`;
    case 'RESOLVING':
      return `No tickets in resolving${suffix}`;
    case 'RESOLVED':
      return `No resolved tickets${suffix}`;
    case 'CLOSED':
      return `No closed tickets${suffix}`;
    case 'CANCELLED':
      return `No cancelled tickets${suffix}`;
    default:
      return `No complaints found${suffix}`;
  }
}

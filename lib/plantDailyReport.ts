import {
  isCommissionedTractor,
  type Complaint,
  type Organization,
  type Plant,
  type RuntimeRecord,
  type Tractor,
} from '@/lib/appsync';
import { rowsToCsv } from '@/lib/csv';
import { isOnDate, toDateKey } from '@/lib/dailyReport';
import { manualRuntimeDayHours } from '@/lib/tractorRuntime';

/** CSV columns for plant daily export (matches fleet operations spreadsheet). */
export const PLANT_DAILY_REPORT_HEADERS = [
  'plant_name',
  'org_name',
  'on_site',
  'commisioned',
  'uncommisioned',
  'loader',
  'loader_vor',
  'loader_available',
  'loader_operational',
  'catcher',
  'catcher_vor',
  'catcher_availability',
  'catcher_operational',
  'grabber',
  'grabber_vor',
  'grabber_availability',
  'grabber_operational',
  'haulage',
  'haulage_vor',
  'haulage_availability',
  'haulage_operational',
  'pin_loader',
  'pin_loader_vor',
  'pin_loader_availability',
  'pin_loader_operational',
  'ftd_breakdowns',
  'ftd_operational',
  'ftd_average_operational',
  'mtd_averge_operational',
  'total_tickets_raised',
  'total_breakdown_tractors',
] as const;

export type ImplementCategory = 'loader' | 'catcher' | 'grabber' | 'haulage' | 'pin_loader';

const IMPLEMENT_CATEGORIES: ImplementCategory[] = [
  'loader',
  'catcher',
  'grabber',
  'haulage',
  'pin_loader',
];

/** Map API `currentImplement` to report implement family. */
export function classifyImplement(currentImplement?: string | null): ImplementCategory | null {
  const t = (currentImplement || '').toLowerCase();
  if (!t.trim()) return null;
  if (/\bpin\s*loader\b|\bdouble\s*pin\b/.test(t)) return 'pin_loader';
  if (/\bhaulage\b/.test(t)) return 'haulage';
  if (/\bcatcher\b/.test(t)) return 'catcher';
  if (/\b(?:grabber|graber)\b/.test(t)) return 'grabber';
  if (/\bloader\b/.test(t)) return 'loader';
  return null;
}

function isVorTractor(t: Tractor): boolean {
  const raw = `${t.serviceStatus || ''} ${t.serviceStatusLabel || ''}`.toUpperCase();
  return /\bVOR\b/.test(raw) || (t.status === 'MAINTENANCE' && /VOR|BREAKDOWN|REPAIR/.test(raw));
}

function isAvailableTractor(t: Tractor): boolean {
  return isCommissionedTractor(t) && !isVorTractor(t) && t.status !== 'OFFLINE';
}

function isOperationalTractor(t: Tractor): boolean {
  return isAvailableTractor(t) && t.status === 'ACTIVE';
}

function isBreakdownComplaint(c: Complaint): boolean {
  const text = `${c.title} ${c.description}`.toLowerCase();
  return (
    /breakdown|break down|off road|vor/.test(text) ||
    c.severity === 'CRITICAL' ||
    c.severity === 'HIGH'
  );
}

type ImplementCounts = {
  total: number;
  vor: number;
  available: number;
  operational: number;
};

function emptyImplementCounts(): ImplementCounts {
  return { total: 0, vor: 0, available: 0, operational: 0 };
}

function countByImplement(tractors: Tractor[]): Record<ImplementCategory, ImplementCounts> {
  const counts = Object.fromEntries(
    IMPLEMENT_CATEGORIES.map(k => [k, emptyImplementCounts()])
  ) as Record<ImplementCategory, ImplementCounts>;

  for (const t of tractors) {
    const cat = classifyImplement(t.currentImplement);
    if (!cat) continue;
    const bucket = counts[cat];
    bucket.total += 1;
    if (isVorTractor(t)) bucket.vor += 1;
    if (isAvailableTractor(t)) bucket.available += 1;
    if (isOperationalTractor(t)) bucket.operational += 1;
  }
  return counts;
}

function monthPrefix(dateKey: string): string {
  return dateKey.slice(0, 7);
}

function mtdComplaints(complaints: Complaint[], reportDateKey: string): Complaint[] {
  const prefix = monthPrefix(reportDateKey);
  return complaints.filter(c => {
    const dk = toDateKey(c.createdAt);
    return dk.startsWith(prefix) && dk <= reportDateKey;
  });
}

function mtdRuntimeDays(runtimeRecords: RuntimeRecord[], reportDateKey: string): string[] {
  const prefix = monthPrefix(reportDateKey);
  const days = new Set<string>();
  for (const r of runtimeRecords) {
    const dk = toDateKey(r.date);
    if (dk.startsWith(prefix) && dk <= reportDateKey && manualRuntimeDayHours(r) > 0) {
      days.add(dk);
    }
  }
  return [...days];
}

export interface PlantDailyReportInput {
  reportDate: string;
  organization: Organization | null;
  plants: Plant[];
  tractors: Tractor[];
  complaints: Complaint[];
  runtimeRecords: RuntimeRecord[];
}

export type PlantDailyReportRow = Record<(typeof PLANT_DAILY_REPORT_HEADERS)[number], string | number>;

export function buildPlantDailyReportRow(input: {
  reportDate: string;
  plant: Plant;
  organization: Organization | null;
  tractors: Tractor[];
  complaints: Complaint[];
  runtimeRecords: RuntimeRecord[];
}): PlantDailyReportRow {
  const { reportDate, plant, organization, tractors, complaints, runtimeRecords } = input;
  const dateKey = toDateKey(reportDate);
  const plantTractors = tractors.filter(t => t.plantID === plant.plantID);
  const plantComplaints = complaints.filter(c => c.plantID === plant.plantID);
  const ftdComplaints = plantComplaints.filter(c => isOnDate(c.createdAt, dateKey));
  const ftdBreakdowns = ftdComplaints.filter(isBreakdownComplaint);
  const breakdownTractors = new Set(
    ftdBreakdowns.map(c => c.tractorID).filter(Boolean)
  );

  const commissioned = plantTractors.filter(isCommissionedTractor);
  const uncommissioned = plantTractors.filter(t => !isCommissionedTractor(t));
  const impl = countByImplement(plantTractors);

  const ftdOperational = plantTractors.filter(isOperationalTractor).length;
  const onSite = plantTractors.length;
  const ftdAvgPct =
    onSite > 0 ? Math.round((ftdOperational / onSite) * 1000) / 10 : 0;

  const mtdComplaintsList = mtdComplaints(plantComplaints, dateKey);
  const mtdDays = mtdRuntimeDays(
    runtimeRecords.filter(r => r.plantID === plant.plantID),
    dateKey
  );
  const mtdOperationalDaily: number[] = [];
  for (const day of mtdDays) {
    const dayComplaints = mtdComplaintsList.filter(c => isOnDate(c.createdAt, day));
    const vorIds = new Set(dayComplaints.filter(isBreakdownComplaint).map(c => c.tractorID));
    const operational = plantTractors.filter(
      t => isOperationalTractor(t) && !vorIds.has(t.tractorID)
    ).length;
    mtdOperationalDaily.push(operational);
  }
  const mtdAvgOperational =
    mtdOperationalDaily.length > 0
      ? Math.round(
          (mtdOperationalDaily.reduce((a, b) => a + b, 0) / mtdOperationalDaily.length) * 10
        ) / 10
      : ftdAvgPct;

  const loader = impl.loader;
  const catcher = impl.catcher;
  const grabber = impl.grabber;
  const haulage = impl.haulage;
  const pinLoader = impl.pin_loader;

  return {
    plant_name: plant.name,
    org_name: organization?.name ?? organization?.orgID ?? plant.orgID,
    on_site: onSite,
    commisioned: commissioned.length,
    uncommisioned: uncommissioned.length,
    loader: loader.total,
    loader_vor: loader.vor,
    loader_available: loader.available,
    loader_operational: loader.operational,
    catcher: catcher.total,
    catcher_vor: catcher.vor,
    catcher_availability: catcher.available,
    catcher_operational: catcher.operational,
    grabber: grabber.total,
    grabber_vor: grabber.vor,
    grabber_availability: grabber.available,
    grabber_operational: grabber.operational,
    haulage: haulage.total,
    haulage_vor: haulage.vor,
    haulage_availability: haulage.available,
    haulage_operational: haulage.operational,
    pin_loader: pinLoader.total,
    pin_loader_vor: pinLoader.vor,
    pin_loader_availability: pinLoader.available,
    pin_loader_operational: pinLoader.operational,
    ftd_breakdowns: ftdBreakdowns.length,
    ftd_operational: ftdOperational,
    ftd_average_operational: ftdAvgPct,
    mtd_averge_operational: mtdAvgOperational,
    total_tickets_raised: ftdComplaints.length,
    total_breakdown_tractors: breakdownTractors.size,
  };
}

export function buildPlantDailyReportCsv(input: {
  dates: string[];
  organization: Organization | null;
  plants: Plant[];
  tractors: Tractor[];
  complaints: Complaint[];
  runtimeRecords: RuntimeRecord[];
  plantFilterID?: string | null;
}): string {
  const targetPlants = input.plantFilterID
    ? input.plants.filter(p => p.plantID === input.plantFilterID)
    : input.plants;

  const rows: (string | number)[][] = [];

  for (const date of [...input.dates].map(toDateKey).sort()) {
    for (const plant of targetPlants) {
      const reportRow = buildPlantDailyReportRow({
        reportDate: date,
        plant,
        organization: input.organization,
        tractors: input.tractors,
        complaints: input.complaints,
        runtimeRecords: input.runtimeRecords,
      });
      rows.push(PLANT_DAILY_REPORT_HEADERS.map(h => reportRow[h]));
    }
  }

  return rowsToCsv([...PLANT_DAILY_REPORT_HEADERS], rows);
}

export function plantReportFilename(dates: string[], plantName?: string): string {
  const sorted = [...dates].map(toDateKey).sort();
  const range =
    sorted.length === 1
      ? sorted[0]
      : `${sorted[0]}_to_${sorted[sorted.length - 1]}`;
  const plant = plantName ? `_${plantName.replace(/\s+/g, '-')}` : '';
  return `plant-daily-report${plant}_${range}.csv`;
}

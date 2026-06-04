import type { Complaint, Plant, RuntimeRecord, Tractor } from '@/lib/appsync';
import { isActiveComplaint } from '@/lib/complaintFilters';
import { isBreakdownComplaint } from '@/lib/isBreakdownComplaint';
import { manualRuntimeDayHours } from '@/lib/tractorRuntime';

export const PLANT_CARD_THEMES = [
  { bg: '#E8EFFD', border: '#1456E0', accent: '#1456E0', icon: 'home' as const },
  { bg: '#E7F6EC', border: '#16A34A', accent: '#127A38', icon: 'map-pin' as const },
  { bg: '#FCF1E2', border: '#D97706', accent: '#9A6206', icon: 'layers' as const },
  { bg: '#FDECEC', border: '#C1121F', accent: '#A30E18', icon: 'package' as const },
  { bg: '#E2F4F7', border: '#0E7490', accent: '#0E7490', icon: 'grid' as const },
  { bg: '#F3E8FF', border: '#7C3AED', accent: '#6D28D9', icon: 'box' as const },
];

export interface PlantSummary {
  plant: Plant;
  theme: (typeof PLANT_CARD_THEMES)[number];
  tractorCount: number;
  active: number;
  idle: number;
  maintenance: number;
  offline: number;
  inOperation: number;
  openTickets: number;
  breakdownOpen: number;
  breakdownRaised: number;
  uptimePct: number;
  downtimePct: number;
  repairDays: number;
  runtimeHours: number;
}

export interface TractorPlantMetrics {
  tractor: Tractor;
  manualHours: number;
  uptimePct: number;
  downtimePct: number;
  repairDays: number;
  openTickets: number;
  breakdownCount: number;
}

function daysBetween(isoStart: string, isoEnd: Date = new Date()): number {
  const start = new Date(isoStart);
  if (Number.isNaN(start.getTime())) return 0;
  const ms = isoEnd.getTime() - start.getTime();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export function repairDaysForComplaint(c: Complaint): number {
  const anchor = c.breakdownDate || c.createdAt;
  if (!isBreakdownComplaint(c)) return 0;
  if (!isActiveComplaint(c)) return 0;
  return Math.max(1, daysBetween(anchor));
}

export function statusUptimePct(status: Tractor['status']): number {
  switch (status) {
    case 'ACTIVE':
      return 100;
    case 'IDLE':
      return 75;
    case 'MAINTENANCE':
      return 0;
    case 'OFFLINE':
      return 0;
    default:
      return 50;
  }
}

export function statusDowntimePct(status: Tractor['status']): number {
  return Math.max(0, Math.min(100, 100 - statusUptimePct(status)));
}

export function buildTractorPlantMetrics(
  tractor: Tractor,
  complaints: Complaint[],
  runtimeRecords: RuntimeRecord[]
): TractorPlantMetrics {
  const tractorComplaints = complaints.filter(c => c.tractorID === tractor.tractorID);
  const openTickets = tractorComplaints.filter(isActiveComplaint).length;
  const breakdowns = tractorComplaints.filter(isBreakdownComplaint);
  const repairDays = breakdowns
    .filter(isActiveComplaint)
    .reduce((sum, c) => sum + repairDaysForComplaint(c), 0);
  const manualHours = runtimeRecords
    .filter(r => r.tractorID === tractor.tractorID)
    .reduce((sum, r) => sum + manualRuntimeDayHours(r), 0);

  return {
    tractor,
    manualHours: manualHours > 0 ? manualHours : tractor.totalRuntime,
    uptimePct: statusUptimePct(tractor.status),
    downtimePct: statusDowntimePct(tractor.status),
    repairDays,
    openTickets,
    breakdownCount: breakdowns.length,
  };
}

export function buildPlantSummary(
  plant: Plant,
  tractors: Tractor[],
  complaints: Complaint[],
  runtimeRecords: RuntimeRecord[],
  colorIndex: number
): PlantSummary {
  const plantTractors = tractors.filter(t => t.plantID === plant.plantID);
  const plantComplaints = complaints.filter(c => c.plantID === plant.plantID);
  const plantRuntime = runtimeRecords.filter(r => r.plantID === plant.plantID);

  const active = plantTractors.filter(t => t.status === 'ACTIVE').length;
  const idle = plantTractors.filter(t => t.status === 'IDLE').length;
  const maintenance = plantTractors.filter(t => t.status === 'MAINTENANCE').length;
  const offline = plantTractors.filter(t => t.status === 'OFFLINE').length;
  const total = plantTractors.length;

  const openTickets = plantComplaints.filter(isActiveComplaint).length;
  const breakdownOpen = plantComplaints.filter(
    c => isBreakdownComplaint(c) && isActiveComplaint(c)
  ).length;
  const breakdownRaised = plantComplaints.filter(isBreakdownComplaint).length;

  const uptimePct =
    total > 0
      ? Math.round(
          plantTractors.reduce((s, t) => s + statusUptimePct(t.status), 0) / total
        )
      : 0;
  const downtimePct = total > 0 ? Math.max(0, 100 - uptimePct) : 0;

  const repairDays = plantComplaints
    .filter(c => isBreakdownComplaint(c) && isActiveComplaint(c))
    .reduce((sum, c) => sum + repairDaysForComplaint(c), 0);

  const runtimeHours = plantRuntime.reduce((s, r) => s + manualRuntimeDayHours(r), 0);

  return {
    plant,
    theme: PLANT_CARD_THEMES[colorIndex % PLANT_CARD_THEMES.length],
    tractorCount: total,
    active,
    idle,
    maintenance,
    offline,
    inOperation: active + idle,
    openTickets,
    breakdownOpen,
    breakdownRaised,
    uptimePct,
    downtimePct,
    repairDays,
    runtimeHours: runtimeHours > 0 ? runtimeHours : plantTractors.reduce((s, t) => s + t.totalRuntime, 0),
  };
}

export function buildPlantSummaries(
  plants: Plant[],
  tractors: Tractor[],
  complaints: Complaint[],
  runtimeRecords: RuntimeRecord[]
): PlantSummary[] {
  return plants
    .map((plant, i) => buildPlantSummary(plant, tractors, complaints, runtimeRecords, i))
    .sort((a, b) => b.tractorCount - a.tractorCount);
}

export function getPlantFleet(
  plantID: string,
  tractors: Tractor[],
  complaints: Complaint[],
  runtimeRecords: RuntimeRecord[]
) {
  const plantTractors = tractors.filter(t => t.plantID === plantID);
  const plantComplaints = complaints.filter(c => c.plantID === plantID);
  const plantRuntime = runtimeRecords.filter(r => r.plantID === plantID);
  const tractorMetrics = plantTractors.map(t =>
    buildTractorPlantMetrics(t, complaints, runtimeRecords)
  );
  return { plantTractors, plantComplaints, plantRuntime, tractorMetrics };
}

export function formatPct(n: number): string {
  return `${Math.round(Math.max(0, Math.min(100, n)))}%`;
}

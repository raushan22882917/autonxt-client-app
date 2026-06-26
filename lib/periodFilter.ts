import type { AnalyticsBucket, UsageSegment } from '@/lib/appsync';
import { SegmentType } from '@/graphql/API';
import { toDateKey } from '@/lib/dailyReport';

/** First day of month (local). */
export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/** `YYYY-MM` for getAnalytics MONTHLY timeSegment. */
export function monthTimeSegment(month: Date): string {
  const y = month.getFullYear();
  const m = String(month.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export function monthLabel(month: Date): string {
  return month.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

/** Inclusive calendar range for the month (date keys). */
export function monthDateKeys(month: Date): { startKey: string; endKey: string } {
  const start = startOfMonth(month);
  const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
  return { startKey: toDateKey(start), endKey: toDateKey(end) };
}

/** ISO bounds for listUsageSegments (inclusive month, UTC day boundaries). */
export function monthIsoRange(month: Date): { startTime: string; endTime: string } {
  const start = startOfMonth(month);
  const end = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59, 999);
  return {
    startTime: `${toDateKey(start)}T00:00:00.000Z`,
    endTime: `${toDateKey(end)}T23:59:59.999Z`,
  };
}

export function isDateKeyInMonth(dateKey: string, month: Date): boolean {
  const { startKey, endKey } = monthDateKeys(month);
  const k = toDateKey(dateKey);
  return k >= startKey && k <= endKey;
}

export function segmentInMonth(seg: UsageSegment, month: Date): boolean {
  if (!seg.startTime) return false;
  return isDateKeyInMonth(seg.startTime, month);
}

export function filterSegmentsForMonth(segments: UsageSegment[], month: Date): UsageSegment[] {
  return segments.filter(s => segmentInMonth(s, month));
}

export function filterTrips(segments: UsageSegment[]): UsageSegment[] {
  return segments.filter(s => String(s.type).toUpperCase() === SegmentType.TRIP);
}

export function filterCharges(segments: UsageSegment[]): UsageSegment[] {
  return segments.filter(s => String(s.type).toUpperCase() === SegmentType.CHARGE);
}

/** Build summary bucket from segment rows when analytics bucket is empty. */
export function summarizeSegments(segments: UsageSegment[]): AnalyticsBucket {
  let totalDuration = 0;
  let totalDistance = 0;
  let totalKwhDelivered = 0;
  let totalKwhCharged = 0;
  let totalCostSavings = 0;
  let totalTreesSaved = 0;
  let totalDisconnectCount = 0;

  for (const s of segments) {
    if (s.durationSec != null) totalDuration += s.durationSec;
    if (s.distanceTravelled != null) totalDistance += s.distanceTravelled;
    if (s.kwhConsumed != null) totalKwhDelivered += s.kwhConsumed;
    if (s.kwhCharged != null) totalKwhCharged += s.kwhCharged;
    if (s.costSavings != null) totalCostSavings += s.costSavings;
    if (s.treesSaved != null) totalTreesSaved += s.treesSaved;
    if (s.disconnects?.totalCount != null) totalDisconnectCount += s.disconnects.totalCount;
  }

  return {
    totalCount: segments.length,
    totalDuration: totalDuration || null,
    totalDistance: totalDistance || null,
    totalKwhDelivered: totalKwhDelivered || null,
    totalKwhCharged: totalKwhCharged || null,
    totalCostSavings: totalCostSavings || null,
    totalTreesSaved: totalTreesSaved || null,
    totalDisconnectCount: totalDisconnectCount || null,
  };
}

export function mergeAnalyticsBucket(
  primary: AnalyticsBucket | null | undefined,
  fallback: AnalyticsBucket
): AnalyticsBucket {
  if (!primary) return fallback;
  const hasPrimary =
    (primary.totalCount ?? 0) > 0 ||
    (primary.totalDuration ?? 0) > 0 ||
    (primary.totalDistance ?? 0) > 0;
  if (hasPrimary) return primary;
  return {
    ...primary,
    totalCount: fallback.totalCount ?? primary.totalCount,
    totalDuration: primary.totalDuration ?? fallback.totalDuration,
    totalDistance: primary.totalDistance ?? fallback.totalDistance,
    totalKwhDelivered: primary.totalKwhDelivered ?? fallback.totalKwhDelivered,
    totalKwhCharged: primary.totalKwhCharged ?? fallback.totalKwhCharged,
    totalCostSavings: primary.totalCostSavings ?? fallback.totalCostSavings,
    totalTreesSaved: primary.totalTreesSaved ?? fallback.totalTreesSaved,
    totalDisconnectCount: primary.totalDisconnectCount ?? fallback.totalDisconnectCount,
  };
}

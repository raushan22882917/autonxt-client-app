import { SegmentType } from '@/graphql/API';
import { cumulativeRuntimeToHours } from '@/lib/telemetry';

/** Subset of manual runtime fields (avoids importing appsync — prevents circular deps). */
export type ManualRuntimeLike = {
  hoursRun: number;
  todaysRuntime?: number | null;
  startCumulativeRuntime?: number | null;
  endCumulativeRuntime?: number | null;
};

/** Format API cumulative-runtime counter (same encoding as telemetry). */
export function formatCumulativeRuntime(value: number | null | undefined): string {
  const hours = cumulativeRuntimeToHours(value);
  if (hours != null) return `${hours.toLocaleString()}h`;
  if (value == null || Number.isNaN(value)) return '—';
  return `${Math.round(value * 10) / 10}`;
}

/** Hours logged for a single manual runtime day entry. */
export function manualRuntimeDayHours(record: ManualRuntimeLike): number {
  if (record.todaysRuntime != null && !Number.isNaN(record.todaysRuntime)) {
    return Math.max(0, record.todaysRuntime);
  }
  if (
    record.startCumulativeRuntime != null &&
    record.endCumulativeRuntime != null &&
    !Number.isNaN(record.startCumulativeRuntime) &&
    !Number.isNaN(record.endCumulativeRuntime)
  ) {
    return Math.max(0, record.endCumulativeRuntime - record.startCumulativeRuntime);
  }
  return record.hoursRun;
}

export function segmentTypeLabel(type: SegmentType | string | null | undefined): string {
  switch (type) {
    case SegmentType.TRIP:
      return 'Trip';
    case SegmentType.CHARGE:
      return 'Charge';
    case SegmentType.STANDBY:
      return 'Standby';
    case SegmentType.DISCONNECT:
      return 'Disconnect';
    case SegmentType.ANOMALY:
      return 'Anomaly';
    case SegmentType.ERROR:
      return 'Error';
    default:
      return type ? String(type) : 'Segment';
  }
}

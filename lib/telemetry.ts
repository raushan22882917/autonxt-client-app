/**
 * Telemetry helpers aligned with analytics-webapp
 * (`useTelemetry`, `useTractorTelemetryQueries`).
 */

export interface TelemetryRow {
  timestamp?: string | null;
  status?: string | null;
  Lat?: string | null;
  Long?: string | null;
  SOC?: number | null;
  SOH?: number | null;
  Charge?: number | null;
  LimpMode?: number | null;
  BatteryV?: number | null;
  BatteryI?: number | null;
  BatteryT?: number | null;
  MaxRPM?: number | null;
  MotorT?: number | null;
  CumulativeRuntime?: number | null;
  Ecode?: number | null;
  FaultDiag?: number | null;
  tractorID?: string | null;
}

/** API returns an array — take the newest sample by timestamp. */
export function pickLatestTelemetry(
  rows: TelemetryRow[] | null | undefined
): TelemetryRow | null {
  if (!rows?.length) return null;
  let latest = rows[0];
  for (const row of rows) {
    if (!row?.timestamp) continue;
    if (!latest?.timestamp || new Date(row.timestamp) > new Date(latest.timestamp)) {
      latest = row;
    }
  }
  return latest ?? null;
}

export function isTelemetryDisconnected(
  timestamp?: string | null,
  nowMs = Date.now()
): boolean {
  if (!timestamp?.trim()) return true;
  let cleaned = timestamp.trim();
  // Ensure the date is parsed in UTC to prevent timezone offsets
  if (cleaned.includes(' ') && !cleaned.includes('+') && !cleaned.includes('-')) {
    cleaned = cleaned.replace(' ', 'T') + 'Z';
  } else if (!cleaned.endsWith('Z') && !cleaned.includes('+') && !cleaned.includes('-')) {
    cleaned = cleaned + 'Z';
  }
  const t = new Date(cleaned).getTime();
  if (Number.isNaN(t)) return true;
  return nowMs - t > 30_000;
}

/** analytics-webapp TractorCard: Charge === 1 means charging */
export function isChargingFromTelemetry(charge?: number | null): boolean {
  return charge === 1;
}

/**
 * Runtime hours from getRuntimeHourByTractor / telemetry CumulativeRuntime
 * (same formula as analytics-webapp useRuntimeByVIN).
 */
export function cumulativeRuntimeToHours(cr: number | null | undefined): number | undefined {
  if (cr == null || cr <= 0 || Number.isNaN(cr)) return undefined;
  return Math.round(cr * 3600);
}

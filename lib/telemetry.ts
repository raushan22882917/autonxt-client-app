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

/** Helper to parse raw telemetry timestamps explicitly into correct local Indian Standard Time (IST, UTC+05:30) epoch ms */
export function parseTelemetryTime(timestamp: string | null | undefined): number {
  if (!timestamp?.trim()) return NaN;
  let cleaned = timestamp.trim();
  
  // Replace space with 'T'
  if (cleaned.includes(' ') && !cleaned.includes('+') && !cleaned.includes('-')) {
    cleaned = cleaned.replace(' ', 'T');
  }
  
  // If the timestamp does not explicitly mention timezone offset, append '+05:30' (IST)
  if (!cleaned.endsWith('Z') && !cleaned.includes('+') && !cleaned.includes('-')) {
    cleaned = cleaned + '+05:30';
  }
  
  return new Date(cleaned).getTime();
}

/** API returns an array — take the newest sample by timestamp. */
export function pickLatestTelemetry(
  rows: TelemetryRow[] | null | undefined
): TelemetryRow | null {
  if (!rows?.length) return null;
  let latest = rows[0];
  for (const row of rows) {
    if (!row?.timestamp) continue;
    const rowTime = parseTelemetryTime(row.timestamp);
    const latestTime = parseTelemetryTime(latest?.timestamp);
    if (Number.isNaN(rowTime)) continue;
    if (Number.isNaN(latestTime) || rowTime > latestTime) {
      latest = row;
    }
  }
  return latest ?? null;
}

export function isTelemetryDisconnected(
  timestamp?: string | null,
  nowMs = Date.now()
): boolean {
  const t = parseTelemetryTime(timestamp);
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

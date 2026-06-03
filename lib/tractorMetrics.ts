import type { FaultMetrics, FaultValues, ParameterMetrics } from '@/graphql/API';
import type { Tractor } from '@/lib/appsync';

export function fmtMetric(v: number | null | undefined, digits = 0): string {
  if (v === null || v === undefined || Number.isNaN(v)) return '—';
  return digits > 0 ? v.toFixed(digits) : String(Math.round(v));
}

type MetricKey = keyof Pick<
  ParameterMetrics,
  'SOC' | 'SOH' | 'BatteryV' | 'BatteryI' | 'BatteryT' | 'MaxRPM' | 'MotorT'
>;

function avgFromPm(pm: ParameterMetrics | null | undefined, key: MetricKey): number | undefined {
  const avg = pm?.[key]?.avg;
  return typeof avg === 'number' && !Number.isNaN(avg) ? avg : undefined;
}

/** Live telemetry first, then GLOBAL analytics parameter averages. */
export function resolveTractorMetrics(
  tractor: Tractor,
  parameterMetrics?: ParameterMetrics | null
): {
  soc?: number;
  soh?: number;
  voltage?: number;
  current?: number;
  temp?: number;
  rpm?: number;
  motorTemp?: number;
} {
  const pm = parameterMetrics ?? undefined;
  return {
    soc: tractor.soc ?? avgFromPm(pm, 'SOC'),
    soh: tractor.soh ?? avgFromPm(pm, 'SOH'),
    voltage: tractor.voltage ?? avgFromPm(pm, 'BatteryV'),
    current: tractor.current ?? avgFromPm(pm, 'BatteryI'),
    temp: tractor.temp ?? avgFromPm(pm, 'BatteryT'),
    rpm: tractor.rpm ?? avgFromPm(pm, 'MaxRPM'),
    motorTemp: tractor.motorTemp ?? avgFromPm(pm, 'MotorT'),
  };
}

export function flattenFaultMetrics(fm?: FaultMetrics | null): FaultValues[] {
  if (!fm) return [];
  return [
    ...(fm.Ecode ?? []),
    ...(fm.FaultDiag ?? []),
    ...(fm.WarningDiag ?? []),
  ].filter((f): f is FaultValues => !!f);
}

export function faultTitle(f: FaultValues): string {
  if (f.Ecode != null && f.Ecode !== undefined) return `E-Code ${f.Ecode}`;
  if (f.FaultDiag != null && f.FaultDiag !== undefined) return `Fault diag ${f.FaultDiag}`;
  if (f.metric) return String(f.metric);
  return 'Fault event';
}

export function faultDetailLines(f: FaultValues): string[] {
  const lines: string[] = [];
  if (f.ModuleTAtFault != null) lines.push(`Module ${f.ModuleTAtFault}°C`);
  if (f.OutputIAtFault != null) lines.push(`Output ${f.OutputIAtFault} A`);
  if (f.OutputVAtFault != null) lines.push(`Output ${f.OutputVAtFault} V`);
  if (f.OutputFreqAtFault != null) lines.push(`Freq ${f.OutputFreqAtFault} Hz`);
  if (f.OutputDCBusVAtFault != null) lines.push(`DC bus ${f.OutputDCBusVAtFault} V`);
  if (f.ModuleTLastFault != null) lines.push(`Last module ${f.ModuleTLastFault}°C`);
  if (f.Ecode != null && f.FaultDiag != null) lines.push(`Diag ${f.FaultDiag}`);
  return lines;
}

import type { Tractor as ApiTractor } from '@/graphql/API';

/** Primary label: fleet alias when set, otherwise model / VIN. */
export function getTractorDisplayName(t: Pick<ApiTractor, 'alias' | 'model' | 'vin'>): string {
  const alias = t.alias?.trim();
  if (alias) return alias;
  return t.model?.trim() || t.vin;
}

export function formatTractorColor(color?: string | null): string {
  if (!color?.trim()) return '';
  return color
    .split('_')
    .filter(Boolean)
    .map(w => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ');
}

export function formatServiceStatusLabel(raw?: string | null): string {
  if (!raw?.trim()) return '';
  return raw
    .split(/[_\s]+/)
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export function formatTelemetryAge(iso?: string | null): string | null {
  if (!iso?.trim()) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const sec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (sec < 60) return 'Just now';
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

import type colors from '@/constants/colors';

type Palette = typeof colors.light;

export function severityColor(severity: string, c: Palette): string {
  switch (severity) {
    case 'CRITICAL':
      return c.red;
    case 'HIGH':
      return c.warning;
    case 'MEDIUM':
      return '#CA8A04';
    case 'LOW':
      return c.success;
    default:
      return c.mutedForeground;
  }
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' });
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

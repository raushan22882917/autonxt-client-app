/** Minimal complaint fields for breakdown detection (no appsync import). */
export interface ComplaintBreakdownFields {
  breakdownType?: string | null;
  maintenanceType?: string | null;
  breakdownDate?: string | null;
  problemSubType?: string | null;
  problemType?: string | null;
  title?: string | null;
  description?: string | null;
  status?: string | null;
}

/**
 * Breakdown ticket per GraphQL Complaint / ComplaintProblemType / MaintenanceType:
 * - maintenanceType: BREAKDOWN
 * - problemType: BREAKDOWN | MAJOR_BREAKDOWN | ACCIDENT (when present on record)
 * - breakdownType, breakdownDate set
 */
export function isBreakdownComplaint(c: ComplaintBreakdownFields): boolean {
  const maintenance = (c.maintenanceType || '').toUpperCase();
  if (maintenance === 'BREAKDOWN') return true;

  const problem = (c.problemType || '').toUpperCase();
  if (
    problem === 'BREAKDOWN' ||
    problem === 'MAJOR_BREAKDOWN' ||
    problem === 'ACCIDENT'
  ) {
    return true;
  }

  if (c.breakdownDate?.trim()) return true;

  const bType = (c.breakdownType || '').trim();
  if (bType.length > 0) return true;

  const sub = `${c.problemSubType || ''} ${c.title || ''} ${c.description || ''}`.toLowerCase();
  if (/major\s*breakdown|breakdown|break\s*down|accident|off\s*road/.test(sub)) {
    return true;
  }

  return false;
}

export function countBreakdownTickets(
  complaints: ComplaintBreakdownFields[]
): { raised: number; open: number } {
  const breakdown = complaints.filter(isBreakdownComplaint);
  const open = breakdown.filter(
    c => c.status === 'OPEN' || c.status === 'IN_PROGRESS'
  ).length;
  return { raised: breakdown.length, open };
}

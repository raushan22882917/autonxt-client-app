import { generateClient } from 'aws-amplify/api';
import { PeriodType } from '@/graphql/API';
import {
  getAnalytics as getAnalyticsQuery,
  getOrganization as getOrganizationQuery,
  getTelemetryByTractor as getTelemetryByTractorQuery,
  getTractor as getTractorQuery,
  listAllUsers as listAllUsersQuery,
  listManualRuntimeEntries as listManualRuntimeEntriesQuery,
  listOrganizations as listOrganizationsQuery,
  listPlantsByOrganization as listPlantsByOrganizationQuery,
  listTractorsByOrg as listTractorsByOrgQuery,
  listUsersByOrg as listUsersByOrgQuery,
} from '@/graphql/queries';
import { getComplaintSafe, listComplaintsByOrgSafe } from '@/graphql/safe-queries';
import { configureAmplify } from '@/lib/amplify';

const client = generateClient();

configureAmplify();

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message?: string }>;
}

export async function gqlQuery<T = unknown>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const response = (await client.graphql({ query, variables })) as GraphQLResponse<T>;
  if (response.errors?.length) {
    throw new Error(response.errors[0].message || 'GraphQL error');
  }
  if (!response.data) {
    throw new Error('GraphQL response missing data');
  }
  return response.data;
}

// ─── View models ────────────────────────────────────────────────────────────

export interface Organization {
  orgID: string;
  name: string;
  industry?: string;
  location?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface Plant {
  orgID: string;
  plantID: string;
  name: string;
  location?: string;
  plantType?: 'HUB_WAREHOUSE' | 'SATELLITE_SITE';
  createdAt: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  orgID?: string;
  accessiblePlantIDs?: string[];
  status?: string;
  cognitoGroups?: string[];
  createdAt: string;
}

export interface Tractor {
  tractorID: string;
  orgID: string;
  plantID: string;
  model: string;
  serialNumber: string;
  status: 'ACTIVE' | 'IDLE' | 'MAINTENANCE' | 'OFFLINE';
  totalRuntime: number;
  lastActive?: string;
  location?: string;
  plantName?: string;
  loggerID?: string;
  color?: string;
  soc?: number;
  voltage?: number;
  current?: number;
  temp?: number;
  rpm?: number;
  motorTemp?: number;
  telemetryStatus?: string;
  telemetryAt?: string;
  commissionDate?: string;
}

export interface Complaint {
  complaintID: string;
  tractorID: string;
  orgID: string;
  plantID: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  reportedBy: string;
  createdAt: string;
  resolvedAt?: string;
  plantName?: string;
  tractorModel?: string;
}

export interface ComplaintEvent {
  ts: string;
  type: string;
  by?: string | null;
  note?: string | null;
  meta?: string | null;
}

export interface ComplaintDetail extends Complaint {
  assigneeUserID?: string;
  location?: string;
  breakdownDate?: string;
  breakdownType?: string;
  slaDeadline?: string;
  shift?: string;
  actionRequired?: string;
  serviceManagerName?: string;
  delayReason?: string;
  events?: ComplaintEvent[];
}

export interface RuntimeRecord {
  recordID: string;
  tractorID: string;
  orgID: string;
  plantID: string;
  date: string;
  hoursRun: number;
  fuelConsumed?: number;
  distanceCovered?: number;
  operatorID?: string;
  plantName?: string;
  tractorModel?: string;
}

export type AnalyticsPeriod = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'GLOBAL';

export interface AnalyticsBucket {
  totalCount?: number | null;
  totalDuration?: number | null;
  totalLoggedDuration?: number | null;
  totalDistance?: number | null;
  totalKwhDelivered?: number | null;
  totalKwhCharged?: number | null;
  totalDisconnectCount?: number | null;
  totalDisconnectDuration?: number | null;
  totalCostSavings?: number | null;
  totalTreesSaved?: number | null;
}

export interface TractorAnalytics {
  tractorID: string;
  PeriodType: AnalyticsPeriod;
  timeSegment: string;
  startTime?: string | null;
  endTime?: string | null;
  cumulative?: AnalyticsBucket | null;
  trips?: AnalyticsBucket | null;
  charges?: AnalyticsBucket | null;
  standby?: AnalyticsBucket | null;
}

// ─── Raw API shapes ─────────────────────────────────────────────────────────

interface RawTractor {
  vin: string;
  alias?: string | null;
  registerNumber?: string | null;
  model?: string | null;
  plantID?: string | null;
  orgID?: string | null;
  loggerID?: string | null;
  serviceStatus?: string | null;
  color?: string | null;
  commissionDate?: string | null;
}

interface RawComplaint {
  complaintID: string;
  orgID?: string | null;
  plantID?: string | null;
  tractorVIN?: string | null;
  problemSubType?: string | null;
  breakdownType?: string | null;
  description?: string | null;
  priority?: string | null;
  state?: string | null;
  createdAt?: string | null;
  closedAt?: string | null;
  driverName?: string | null;
  raisedByUserID?: string | null;
}

interface RawComplaintDetail extends RawComplaint {
  assigneeUserID?: string | null;
  slaDeadline?: string | null;
  resolutionTimeline?: string | null;
  breakdownDate?: string | null;
  shift?: string | null;
  location?: string | null;
  delayReason?: string | null;
  actionRequired?: string | null;
  serviceManagerName?: string | null;
  events?: ComplaintEvent[] | null;
}

interface RawRuntimeEntry {
  loggerID: string;
  date: string;
  plantID?: string | null;
  orgID?: string | null;
  todaysRuntime?: number | null;
  startCumulativeRuntime?: number | null;
  endCumulativeRuntime?: number | null;
}

interface RawTelemetry {
  tractorID?: string | null;
  timestamp?: string | null;
  status?: string | null;
  SOC?: number | null;
  BatteryV?: number | null;
  BatteryI?: number | null;
  BatteryT?: number | null;
  MaxRPM?: number | null;
  MotorT?: number | null;
}

// ─── Organization / users ───────────────────────────────────────────────────

export async function fetchOrganization(orgID: string): Promise<Organization> {
  const data = await gqlQuery<{ getOrganization: Organization }>(getOrganizationQuery, { orgID });
  return data.getOrganization;
}

export async function fetchAllOrganizations(): Promise<Organization[]> {
  const data = await gqlQuery<{ listOrganizations: Organization[] }>(listOrganizationsQuery);
  return data.listOrganizations || [];
}

export async function fetchPlantsByOrg(orgID: string): Promise<Plant[]> {
  const data = await gqlQuery<{ listPlantsByOrganization: Plant[] }>(listPlantsByOrganizationQuery, {
    orgID,
  });
  return data.listPlantsByOrganization || [];
}

export async function fetchUsersByOrg(orgID: string): Promise<AppUser[]> {
  const data = await gqlQuery<{ listUsersByOrg: AppUser[] }>(listUsersByOrgQuery, { orgID });
  return data.listUsersByOrg || [];
}

export async function fetchAllUsers(): Promise<AppUser[]> {
  const data = await gqlQuery<{ listAllUsers: AppUser[] }>(listAllUsersQuery);
  return data.listAllUsers || [];
}

// ─── Mappers ────────────────────────────────────────────────────────────────

function mapServiceStatus(raw?: string | null): Tractor['status'] {
  const s = (raw || '').toUpperCase();
  if (/MAINT|SERVIC|REPAIR|BREAKDOWN|VOR/.test(s)) return 'MAINTENANCE';
  if (/IDLE|STANDBY/.test(s)) return 'IDLE';
  if (/OFFLINE|INACTIVE|DECOMMISSION|RETIRED/.test(s)) return 'OFFLINE';
  return 'ACTIVE';
}

function humanize(raw?: string | null): string {
  if (!raw) return '';
  return raw
    .split(/[_\s]+/)
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function mapSeverity(priority?: string | null, hint?: string | null): Complaint['severity'] {
  if (/major|accident|breakdown/i.test(hint || '')) return 'CRITICAL';
  switch ((priority || '').toUpperCase()) {
    case 'HIGH':
      return 'HIGH';
    case 'LOW':
      return 'LOW';
    case 'MEDIUM':
      return 'MEDIUM';
    default:
      return 'MEDIUM';
  }
}

function mapComplaintStatus(state?: string | null): Complaint['status'] {
  switch ((state || '').toUpperCase()) {
    case 'PENDING':
      return 'OPEN';
    case 'ACCEPTED':
    case 'RESOLVING':
      return 'IN_PROGRESS';
    case 'RESOLVED':
      return 'RESOLVED';
    case 'CLOSED':
    case 'CANCELLED':
      return 'CLOSED';
    default:
      return 'OPEN';
  }
}

function mapRawComplaint(
  c: RawComplaint,
  orgID: string,
  plantById: Map<string, Plant>,
  tractorByVin: Map<string, RawTractor>
): Complaint {
  const plant = c.plantID ? plantById.get(c.plantID) : undefined;
  const tractor = c.tractorVIN ? tractorByVin.get(c.tractorVIN) : undefined;
  const title =
    c.problemSubType?.trim() ||
    humanize(c.breakdownType) ||
    c.description?.trim().split('\n')[0] ||
    'Maintenance issue';
  return {
    complaintID: c.complaintID,
    tractorID: c.tractorVIN || '',
    orgID: c.orgID || orgID,
    plantID: c.plantID || '',
    title,
    description: c.description || title,
    severity: mapSeverity(c.priority, c.breakdownType),
    status: mapComplaintStatus(c.state),
    reportedBy: c.driverName || c.raisedByUserID || 'Unknown',
    createdAt: c.createdAt || new Date().toISOString(),
    resolvedAt: c.closedAt || undefined,
    plantName: plant?.name,
    tractorModel: tractor?.model || tractor?.alias || c.tractorVIN || undefined,
  };
}

function mapRawTractor(
  t: RawTractor,
  orgID: string,
  plantById: Map<string, Plant>,
  cumulativeByLogger: Map<string, number>,
  telemetryByLogger: Map<string, RawTelemetry>
): Tractor {
  const plant = t.plantID ? plantById.get(t.plantID) : undefined;
  const totalRuntime = t.loggerID ? cumulativeByLogger.get(t.loggerID) ?? 0 : 0;
  const tel = t.loggerID ? telemetryByLogger.get(t.loggerID) : undefined;
  return {
    tractorID: t.vin,
    orgID: t.orgID || orgID,
    plantID: t.plantID || '',
    model: t.model || t.alias || t.vin,
    serialNumber: t.registerNumber || t.vin,
    status: mapServiceStatus(t.serviceStatus),
    totalRuntime: Math.round(totalRuntime),
    plantName: plant?.name,
    location: plant?.location || plant?.name,
    loggerID: t.loggerID || undefined,
    color: t.color || undefined,
    soc: num(tel?.SOC),
    voltage: num(tel?.BatteryV),
    current: num(tel?.BatteryI),
    temp: num(tel?.BatteryT),
    rpm: num(tel?.MaxRPM),
    motorTemp: num(tel?.MotorT),
    telemetryStatus: tel?.status ?? undefined,
    telemetryAt: tel?.timestamp ?? undefined,
    commissionDate: t.commissionDate || undefined,
  };
}

function num(v: number | null | undefined): number | undefined {
  return typeof v === 'number' && !Number.isNaN(v) ? v : undefined;
}

async function paginate<T>(
  fetchPage: (nextToken?: string | null) => Promise<{ items: T[]; nextToken?: string | null }>,
  label: string,
  maxPages = 25
): Promise<T[]> {
  const items: T[] = [];
  let nextToken: string | null | undefined;
  let pages = 0;
  do {
    const page = await fetchPage(nextToken);
    if (page.items) items.push(...page.items);
    nextToken = page.nextToken;
    pages++;
  } while (nextToken && pages < maxPages);
  if (nextToken) {
    console.warn(`${label}: page cap reached; results may be truncated.`);
  }
  return items;
}

// ─── Fetchers ───────────────────────────────────────────────────────────────

async function fetchTractorsByOrg(orgID: string): Promise<RawTractor[]> {
  const data = await gqlQuery<{ listTractorsByOrg: RawTractor[] }>(listTractorsByOrgQuery, { orgID });
  return data.listTractorsByOrg || [];
}

async function fetchComplaintsByOrg(orgID: string): Promise<RawComplaint[]> {
  return paginate(
    async nextToken => {
      const data = await gqlQuery<{
        listComplaintsByOrg: { items: RawComplaint[]; nextToken?: string | null };
      }>(listComplaintsByOrgSafe, { orgID, nextToken });
      return data.listComplaintsByOrg ?? { items: [] };
    },
    'fetchComplaintsByOrg'
  );
}

async function fetchRuntimeEntriesByLogger(loggerID: string): Promise<RawRuntimeEntry[]> {
  return paginate(
    async nextToken => {
      const data = await gqlQuery<{
        listManualRuntimeEntries: { items: RawRuntimeEntry[]; nextToken?: string | null };
      }>(listManualRuntimeEntriesQuery, { loggerID, limit: 200, nextToken });
      return data.listManualRuntimeEntries ?? { items: [] };
    },
    `fetchRuntimeEntriesByLogger(${loggerID})`
  );
}

async function fetchRuntimeEntriesByLoggers(loggerIDs: string[]): Promise<RawRuntimeEntry[]> {
  const results = await Promise.all(loggerIDs.map(fetchRuntimeEntriesByLogger));
  return results.flat();
}

async function fetchTelemetryByLogger(
  loggerID: string
): Promise<{ loggerID: string; telemetry: RawTelemetry | null }> {
  try {
    const data = await gqlQuery<{ getTelemetryByTractor: RawTelemetry | null }>(
      getTelemetryByTractorQuery,
      { loggerID }
    );
    return { loggerID, telemetry: data.getTelemetryByTractor ?? null };
  } catch {
    return { loggerID, telemetry: null };
  }
}

async function fetchTelemetryByLoggers(loggerIDs: string[]): Promise<Map<string, RawTelemetry>> {
  const results = await Promise.all(loggerIDs.map(fetchTelemetryByLogger));
  const map = new Map<string, RawTelemetry>();
  for (const { loggerID, telemetry } of results) {
    if (telemetry) map.set(loggerID, telemetry);
  }
  return map;
}

export async function fetchFleetData(
  orgID: string,
  plants: Plant[]
): Promise<{ tractors: Tractor[]; complaints: Complaint[]; runtimeRecords: RuntimeRecord[] }> {
  const [rawTractors, rawComplaints] = await Promise.all([
    fetchTractorsByOrg(orgID),
    fetchComplaintsByOrg(orgID),
  ]);

  const loggerIDs = [
    ...new Set(rawTractors.map(t => t.loggerID).filter((id): id is string => !!id)),
  ];
  const [rawRuntime, telemetryByLogger] = await Promise.all([
    fetchRuntimeEntriesByLoggers(loggerIDs),
    fetchTelemetryByLoggers(loggerIDs),
  ]);

  const plantById = new Map(plants.map(p => [p.plantID, p]));
  const tractorByVin = new Map(rawTractors.map(t => [t.vin, t]));
  const tractorByLogger = new Map(
    rawTractors.filter(t => t.loggerID).map(t => [t.loggerID as string, t])
  );

  const cumulativeByLogger = new Map<string, number>();
  for (const r of rawRuntime) {
    const end = r.endCumulativeRuntime ?? 0;
    if (end > (cumulativeByLogger.get(r.loggerID) ?? 0)) {
      cumulativeByLogger.set(r.loggerID, end);
    }
  }

  const tractors = rawTractors.map(t =>
    mapRawTractor(t, orgID, plantById, cumulativeByLogger, telemetryByLogger)
  );

  const complaints = rawComplaints.map(c =>
    mapRawComplaint(c, orgID, plantById, tractorByVin)
  );

  const runtimeRecords: RuntimeRecord[] = rawRuntime
    .map(r => {
      const plant = r.plantID ? plantById.get(r.plantID) : undefined;
      const tractor = tractorByLogger.get(r.loggerID);
      const hours =
        r.todaysRuntime ??
        (r.endCumulativeRuntime != null && r.startCumulativeRuntime != null
          ? r.endCumulativeRuntime - r.startCumulativeRuntime
          : 0);
      return {
        recordID: `${r.loggerID}-${r.date}`,
        tractorID: tractor?.vin || r.loggerID,
        orgID: r.orgID || orgID,
        plantID: r.plantID || '',
        date: r.date,
        hoursRun: Math.round(Math.max(0, hours || 0) * 10) / 10,
        plantName: plant?.name,
        tractorModel: tractor?.model || tractor?.alias || tractor?.vin,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  return { tractors, complaints, runtimeRecords };
}

export async function fetchComplaintById(
  complaintID: string,
  plants: Plant[] = [],
  tractors: Tractor[] = []
): Promise<ComplaintDetail | null> {
  const data = await gqlQuery<{ getComplaint: RawComplaintDetail | null }>(getComplaintSafe, {
    complaintID,
  });
  const raw = data.getComplaint;
  if (!raw) return null;

  const plantById = new Map(plants.map(p => [p.plantID, p]));
  const tractorByVin = new Map(
    tractors.map(t => [t.tractorID, { vin: t.tractorID, model: t.model, alias: t.model } as RawTractor])
  );
  const base = mapRawComplaint(raw, raw.orgID || '', plantById, tractorByVin);

  return {
    ...base,
    assigneeUserID: raw.assigneeUserID || undefined,
    location: raw.location || undefined,
    breakdownDate: raw.breakdownDate || undefined,
    breakdownType: raw.breakdownType || undefined,
    slaDeadline: raw.slaDeadline || undefined,
    shift: raw.shift || undefined,
    actionRequired: raw.actionRequired || undefined,
    serviceManagerName: raw.serviceManagerName || undefined,
    delayReason: raw.delayReason || undefined,
    events: raw.events?.filter(Boolean) as ComplaintEvent[] | undefined,
  };
}

export async function fetchTractorById(
  vin: string,
  plants: Plant[] = []
): Promise<Tractor | null> {
  const data = await gqlQuery<{ getTractor: RawTractor | null }>(getTractorQuery, { vin });
  const raw = data.getTractor;
  if (!raw) return null;

  const plantById = new Map(plants.map(p => [p.plantID, p]));
  const cumulativeByLogger = new Map<string, number>();
  const telemetryByLogger = raw.loggerID
    ? await fetchTelemetryByLoggers([raw.loggerID])
    : new Map<string, RawTelemetry>();

  if (raw.loggerID) {
    const entries = await fetchRuntimeEntriesByLogger(raw.loggerID);
    for (const r of entries) {
      const end = r.endCumulativeRuntime ?? 0;
      if (end > (cumulativeByLogger.get(raw.loggerID!) ?? 0)) {
        cumulativeByLogger.set(raw.loggerID!, end);
      }
    }
  }

  return mapRawTractor(raw, raw.orgID || '', plantById, cumulativeByLogger, telemetryByLogger);
}

export async function fetchTractorAnalytics(
  tractorID: string,
  period: AnalyticsPeriod = 'GLOBAL',
  timeSegment = 'GLOBAL'
): Promise<TractorAnalytics | null> {
  const data = await gqlQuery<{ getAnalytics: TractorAnalytics | null }>(getAnalyticsQuery, {
    tractorID,
    PeriodType: period as PeriodType,
    timeSegment,
  });
  return data.getAnalytics ?? null;
}

/** @deprecated Amplify handles auth tokens automatically. Kept for compatibility. */
export function setAppsyncTokenGetter(_getter: () => string | null) {
  // no-op: Amplify GraphQL client uses Cognito session from Amplify Auth
}

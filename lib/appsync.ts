import { generateClient } from 'aws-amplify/api';
import {
  PeriodType,
  SegmentType,
  type GetAnalyticsQuery,
  type ListUsageSegmentsQuery,
  type Tractor as ApiTractor,
} from '@/graphql/API';
import {
  formatServiceStatusLabel,
  formatTractorColor,
  getTractorDisplayName,
} from '@/lib/tractorFormat';
import {
  getAnalytics as getAnalyticsQuery,
  getComplaint as getComplaintSafe,
  getOrganization as getOrganizationQuery,
  getTelemetryByTractor as getTelemetryByTractorQuery,
  getTractor as getTractorQuery,
  listAllUsers as listAllUsersQuery,
  listComplaintsByOrg as listComplaintsByOrgSafe,
  listComplaintsByPlant as listComplaintsByPlantSafe,
  listManualRuntimeEntries as listManualRuntimeEntriesQuery,
  listOrganizations as listOrganizationsQuery,
  listPlantsByOrganization as listPlantsByOrganizationQuery,
  listTractorsByOrg as listTractorsByOrgQuery,
  listTractorsByPlant as listTractorsByPlantQuery,
  getRuntimeHourByTractor as getRuntimeHourByTractorQuery,
  listUsageSegments as listUsageSegmentsQuery,
  listUsageSegmentsByType as listUsageSegmentsByTypeQuery,
  listUsersByOrg as listUsersByOrgQuery,
} from '@/graphql/queries';
import { configureAmplify } from '@/lib/amplify';
import {
  cumulativeRuntimeToHours,
  isChargingFromTelemetry,
  isTelemetryDisconnected,
  pickLatestTelemetry,
  type TelemetryRow,
} from '@/lib/telemetry';

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

/** Commissioned fleet unit — has a commissioning date from the backend. */
export function isCommissionedTractor(t: Pick<Tractor, 'commissionDate'>): boolean {
  return !!t.commissionDate?.trim();
}

export interface Tractor {
  tractorID: string;
  orgID: string;
  plantID: string;
  /** API `model` (e.g. X45H2). */
  model: string;
  /** API `alias` when set. */
  alias?: string;
  displayName: string;
  serialNumber: string;
  registerNumber?: string;
  status: 'ACTIVE' | 'IDLE' | 'MAINTENANCE' | 'OFFLINE';
  /** Raw API `serviceStatus` (e.g. VOR, operational). */
  serviceStatus?: string;
  serviceStatusLabel?: string;
  totalRuntime: number;
  lastActive?: string;
  location?: string;
  liveLocation?: string;
  plantName?: string;
  loggerID?: string;
  color?: string;
  colorLabel?: string;
  assignedUser?: string;
  soc?: number;
  soh?: number;
  voltage?: number;
  current?: number;
  temp?: number;
  rpm?: number;
  motorTemp?: number;
  telemetryStatus?: string;
  telemetryAt?: string;
  isCharging?: boolean;
  /** Whether the tractor supports / is operating on fast-charge mode (from dofChargeStatus). */
  fastCharging?: boolean;
  limpMode?: boolean;
  latitude?: string;
  longitude?: string;
  telemetryEcode?: number;
  telemetryFaultDiag?: number;
  commissionDate?: string;
  createdAt?: string;
  updatedAt?: string;
  currentImplement?: string;
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
  /** Raw GraphQL ComplaintState (PENDING, ACCEPTED, RESOLVING, …). */
  state?: string;
  reportedBy: string;
  createdAt: string;
  resolvedAt?: string;
  plantName?: string;
  tractorModel?: string;
  /** API problemSubType */
  problemSubType?: string;
  /** API breakdownType */
  breakdownType?: string;
  /** API MaintenanceType e.g. BREAKDOWN */
  maintenanceType?: string;
  /** API breakdownDate */
  breakdownDate?: string;
  /** Set when loaded from full getComplaint (list queries omit problemType). */
  problemType?: string;
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
  loggerID?: string;
  startCumulativeRuntime?: number;
  endCumulativeRuntime?: number;
  todaysRuntime?: number;
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

/** Full `getAnalytics` payload from GraphQL (parameterMetrics, faultMetrics, etc.). */
export type TractorAnalytics = NonNullable<GetAnalyticsQuery['getAnalytics']>;

type UsageSegmentItem = NonNullable<
  NonNullable<ListUsageSegmentsQuery['listUsageSegments']>['items']
>[number];

export type UsageSegment = NonNullable<UsageSegmentItem>;

export { SegmentType };

// ─── Raw API shapes ─────────────────────────────────────────────────────────

type RawTractor = Pick<
  ApiTractor,
  | 'vin'
  | 'alias'
  | 'registerNumber'
  | 'model'
  | 'plantID'
  | 'orgID'
  | 'loggerID'
  | 'serviceStatus'
  | 'color'
  | 'currentImplement'
  | 'commissionDate'
  | 'user'
  | 'createdAt'
  | 'updatedAt'
  | 'dispatchInfo'
  | 'components'
  | 'dofChargeStatus'
>;

interface RawComplaint {
  complaintID: string;
  orgID?: string | null;
  plantID?: string | null;
  tractorVIN?: string | null;
  problemSubType?: string | null;
  breakdownType?: string | null;
  maintenanceType?: string | null;
  breakdownDate?: string | null;
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

export interface RawManualRuntimeEntry {
  loggerID: string;
  date: string;
  plantID?: string | null;
  orgID?: string | null;
  todaysRuntime?: number | null;
  startCumulativeRuntime?: number | null;
  endCumulativeRuntime?: number | null;
}

interface RawRuntimeEntry extends RawManualRuntimeEntry {}

type RawTelemetry = TelemetryRow;

const TELEMETRY_FETCH_CONCURRENCY = 8;

async function runPool<T>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<void>
): Promise<void> {
  if (items.length === 0) return;
  let index = 0;
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (index < items.length) {
      const i = index++;
      await worker(items[i]);
    }
  });
  await Promise.all(runners);
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
    state: c.state || undefined,
    reportedBy: c.driverName || c.raisedByUserID || 'Unknown',
    createdAt: c.createdAt || new Date().toISOString(),
    resolvedAt: c.closedAt || undefined,
    plantName: plant?.name,
    tractorModel: tractor?.model || tractor?.alias || c.tractorVIN || undefined,
    problemSubType: c.problemSubType || undefined,
    breakdownType: c.breakdownType || undefined,
    maintenanceType: c.maintenanceType || undefined,
    breakdownDate: c.breakdownDate || undefined,
  };
}

function resolveTotalRuntimeHours(
  loggerID: string | undefined,
  cumulativeByLogger: Map<string, number>,
  telemetryByLogger: Map<string, RawTelemetry>,
  runtimeHoursByLogger?: Map<string, number>
): number {
  if (loggerID && runtimeHoursByLogger?.has(loggerID)) {
    return Math.round(runtimeHoursByLogger.get(loggerID)!);
  }
  const tel = loggerID ? telemetryByLogger.get(loggerID) : undefined;
  const fromTel = cumulativeRuntimeToHours(tel?.CumulativeRuntime);
  if (fromTel != null) return Math.round(fromTel);
  if (loggerID) return Math.round(cumulativeByLogger.get(loggerID) ?? 0);
  return 0;
}

function mapRawTractor(
  t: RawTractor,
  orgID: string,
  plantById: Map<string, Plant>,
  cumulativeByLogger: Map<string, number>,
  telemetryByLogger: Map<string, RawTelemetry>,
  runtimeHoursByLogger?: Map<string, number>
): Tractor {
  const plant = t.plantID ? plantById.get(t.plantID) : undefined;
  const tel = t.loggerID ? telemetryByLogger.get(t.loggerID) : undefined;
  const totalRuntime = resolveTotalRuntimeHours(
    t.loggerID || undefined,
    cumulativeByLogger,
    telemetryByLogger,
    runtimeHoursByLogger
  );
  const liveLocation =
    t.dispatchInfo?.liveLocation?.trim() ||
    t.dispatchInfo?.dispatchLocation?.trim() ||
    undefined;
  const model = t.model?.trim() || t.vin;
  const baseStatus = mapServiceStatus(t.serviceStatus);
  const isOffline = isTelemetryDisconnected(tel?.timestamp);
  const status = (baseStatus !== 'MAINTENANCE' && isOffline) ? 'OFFLINE' : baseStatus;

  return {
    tractorID: t.vin,
    orgID: t.orgID || orgID,
    plantID: t.plantID || '',
    model,
    alias: t.alias?.trim() || undefined,
    displayName: getTractorDisplayName(t),
    serialNumber: t.registerNumber?.trim() || t.vin,
    registerNumber: t.registerNumber?.trim() || undefined,
    status,
    serviceStatus: t.serviceStatus?.trim() || undefined,
    serviceStatusLabel: formatServiceStatusLabel(t.serviceStatus) || undefined,
    totalRuntime: Math.round(totalRuntime),
    plantName: plant?.name,
    location: liveLocation || plant?.location || plant?.name,
    liveLocation,
    loggerID: t.loggerID || undefined,
    color: t.color || undefined,
    colorLabel: formatTractorColor(t.color) || undefined,
    assignedUser: t.user?.trim() || undefined,
    soc: num(tel?.SOC),
    soh: num(tel?.SOH),
    voltage: num(tel?.BatteryV),
    current: num(tel?.BatteryI),
    temp: num(tel?.BatteryT),
    rpm: num(tel?.MaxRPM),
    motorTemp: num(tel?.MotorT),
    telemetryStatus: tel?.status ?? undefined,
    telemetryAt: tel?.timestamp ?? undefined,
    isCharging: isChargingFromTelemetry(tel?.Charge),
    fastCharging: t.dofChargeStatus != null
      ? /fast/i.test(t.dofChargeStatus)
      : undefined,
    limpMode: tel?.LimpMode != null && tel.LimpMode > 0,
    latitude: tel?.Lat?.trim() || undefined,
    longitude: tel?.Long?.trim() || undefined,
    telemetryEcode: num(tel?.Ecode),
    telemetryFaultDiag: num(tel?.FaultDiag),
    commissionDate: t.commissionDate || undefined,
    createdAt: t.createdAt || undefined,
    updatedAt: t.updatedAt || undefined,
    currentImplement: t.currentImplement || undefined,
  };
}

function applyTelemetryToTractor(
  t: Tractor,
  tel: RawTelemetry | undefined,
  runtimeHours?: number
): Tractor {
  if (!tel && runtimeHours == null) return t;
  const runtimeFromTel = cumulativeRuntimeToHours(tel?.CumulativeRuntime);

  const isOffline = isTelemetryDisconnected(tel?.timestamp);
  const baseStatus = t.serviceStatus ? mapServiceStatus(t.serviceStatus) : 'ACTIVE';
  const status = (baseStatus !== 'MAINTENANCE' && isOffline) ? 'OFFLINE' : baseStatus;

  return {
    ...t,
    status,
    totalRuntime:
      runtimeHours != null
        ? Math.round(runtimeHours)
        : runtimeFromTel != null
          ? Math.round(runtimeFromTel)
          : t.totalRuntime,
    soc: tel ? (num(tel.SOC) ?? t.soc) : t.soc,
    soh: tel ? (num(tel.SOH) ?? t.soh) : t.soh,
    voltage: tel ? (num(tel.BatteryV) ?? t.voltage) : t.voltage,
    current: tel ? (num(tel.BatteryI) ?? t.current) : t.current,
    temp: tel ? (num(tel.BatteryT) ?? t.temp) : t.temp,
    rpm: tel ? (num(tel.MaxRPM) ?? t.rpm) : t.rpm,
    motorTemp: tel ? (num(tel.MotorT) ?? t.motorTemp) : t.motorTemp,
    telemetryStatus: tel?.status ?? t.telemetryStatus,
    telemetryAt: tel?.timestamp ?? t.telemetryAt,
    isCharging: tel ? isChargingFromTelemetry(tel.Charge) : t.isCharging,
    limpMode: tel ? tel.LimpMode != null && tel.LimpMode > 0 : t.limpMode,
    latitude: tel?.Lat?.trim() || t.latitude,
    longitude: tel?.Long?.trim() || t.longitude,
    telemetryEcode: tel ? (num(tel.Ecode) ?? t.telemetryEcode) : t.telemetryEcode,
    telemetryFaultDiag: tel ? (num(tel.FaultDiag) ?? t.telemetryFaultDiag) : t.telemetryFaultDiag,
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

/** Manual runtime entries for one logger (CreateManualRuntimeEntryInput shape). */
export async function fetchManualRuntimeForLogger(loggerID: string): Promise<RawManualRuntimeEntry[]> {
  return fetchRuntimeEntriesByLogger(loggerID);
}

/** Manual runtime rows for a calendar day (org / optional plant filter). */
export async function fetchDailyManualRuntime(
  orgID: string,
  date: string,
  plants: Plant[],
  tractors: Tractor[],
  plantID?: string | null
): Promise<RuntimeRecord[]> {
  const raw = await paginate(
    async nextToken => {
      const data = await gqlQuery<{
        listManualRuntimeEntries: { items: RawRuntimeEntry[]; nextToken?: string | null };
      }>(listManualRuntimeEntriesQuery, {
        orgID,
        plantID: plantID || undefined,
        date,
        limit: 200,
        nextToken,
      });
      return data.listManualRuntimeEntries ?? { items: [] };
    },
    `fetchDailyManualRuntime(${date})`
  );

  const plantById = new Map(plants.map(p => [p.plantID, p]));
  const tractorByLogger = new Map(
    tractors.filter(t => t.loggerID).map(t => [t.loggerID as string, t])
  );
  const tractorByVin = new Map(tractors.map(t => [t.tractorID, t]));

  return mapRawManualRuntimeToRecords(
    raw,
    orgID,
    plantById,
    new Map(
      [...tractorByLogger.entries()].map(([loggerID, t]) => [
        loggerID,
        {
          tractorID: t.tractorID,
          model: t.model,
          serialNumber: t.serialNumber,
        },
      ])
    )
  ).map(r => {
    const t = tractorByVin.get(r.tractorID);
    if (!t) return r;
    return {
      ...r,
      tractorModel: r.tractorModel || t.model,
      plantName: r.plantName || t.plantName,
    };
  });
}

/** Manual runtime records for a single tractor (fresh from AppSync). */
export async function fetchTractorManualRuntime(
  tractor: Pick<Tractor, 'tractorID' | 'loggerID' | 'model' | 'serialNumber' | 'plantID' | 'orgID'>,
  plants: Plant[]
): Promise<RuntimeRecord[]> {
  if (!tractor.loggerID) return [];
  const raw = await fetchManualRuntimeForLogger(tractor.loggerID);
  const plantById = new Map(plants.map(p => [p.plantID, p]));
  const tractorByLogger = new Map([
    [
      tractor.loggerID,
      {
        tractorID: tractor.tractorID,
        model: tractor.model,
        serialNumber: tractor.serialNumber,
      },
    ],
  ]);
  return mapRawManualRuntimeToRecords(raw, tractor.orgID, plantById, tractorByLogger);
}

/** Manual runtime rows as returned by AppSync (no mapping or derived fields). */
export async function fetchTractorManualRuntimeRaw(
  tractor: Pick<Tractor, 'loggerID'>
): Promise<RawManualRuntimeEntry[]> {
  if (!tractor.loggerID) return [];
  const raw = await fetchManualRuntimeForLogger(tractor.loggerID);
  return [...raw].sort((a, b) => b.date.localeCompare(a.date));
}

function mapRawManualRuntimeToRecords(
  raw: RawRuntimeEntry[],
  orgID: string,
  plantById: Map<string, Plant>,
  tractorByLogger: Map<string, { tractorID: string; model?: string; serialNumber?: string }>
): RuntimeRecord[] {
  return raw
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
        tractorID: tractor?.tractorID || r.loggerID,
        orgID: r.orgID || orgID,
        plantID: r.plantID || '',
        date: r.date,
        loggerID: r.loggerID,
        startCumulativeRuntime: r.startCumulativeRuntime ?? undefined,
        endCumulativeRuntime: r.endCumulativeRuntime ?? undefined,
        todaysRuntime: r.todaysRuntime ?? undefined,
        hoursRun: Math.round(Math.max(0, hours || 0) * 10) / 10,
        plantName: plant?.name,
        tractorModel: tractor?.model || tractor?.serialNumber,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

async function fetchRuntimeEntriesByLoggers(loggerIDs: string[]): Promise<RawRuntimeEntry[]> {
  const results = await Promise.all(loggerIDs.map(fetchRuntimeEntriesByLogger));
  return results.flat();
}

async function fetchRuntimeHourByLogger(loggerID: string): Promise<number | undefined> {
  try {
    const data = await gqlQuery<{
      getRuntimeHourByTractor?: { CumulativeRuntime?: number | null } | null;
    }>(getRuntimeHourByTractorQuery, { loggerID });
    return cumulativeRuntimeToHours(data.getRuntimeHourByTractor?.CumulativeRuntime);
  } catch {
    return undefined;
  }
}

async function fetchTelemetryByLogger(
  loggerID: string
): Promise<{ loggerID: string; telemetry: RawTelemetry | null; runtimeHours?: number }> {
  try {
    const [telData, runtimeHours] = await Promise.all([
      gqlQuery<{ getTelemetryByTractor: RawTelemetry[] | null }>(getTelemetryByTractorQuery, {
        loggerID,
      }),
      fetchRuntimeHourByLogger(loggerID),
    ]);
    const telemetry = pickLatestTelemetry(telData.getTelemetryByTractor);
    return { loggerID, telemetry, runtimeHours };
  } catch {
    return { loggerID, telemetry: null };
  }
}

async function fetchTelemetryByLoggers(loggerIDs: string[]): Promise<{
  telemetryByLogger: Map<string, RawTelemetry>;
  runtimeHoursByLogger: Map<string, number>;
}> {
  const telemetryByLogger = new Map<string, RawTelemetry>();
  const runtimeHoursByLogger = new Map<string, number>();
  await runPool(loggerIDs, TELEMETRY_FETCH_CONCURRENCY, async loggerID => {
    const { telemetry, runtimeHours } = await fetchTelemetryByLogger(loggerID);
    if (telemetry) telemetryByLogger.set(loggerID, telemetry);
    if (runtimeHours != null) runtimeHoursByLogger.set(loggerID, runtimeHours);
  });
  return { telemetryByLogger, runtimeHoursByLogger };
}

export interface PlantFleetSlice {
  plantID: string;
  tractors: Tractor[];
  complaints: Complaint[];
  runtimeRecords: RuntimeRecord[];
}

async function fetchTractorsByPlant(plantID: string): Promise<RawTractor[]> {
  const data = await gqlQuery<{ listTractorsByPlant: RawTractor[] }>(listTractorsByPlantQuery, {
    plantID,
  });
  return data.listTractorsByPlant || [];
}

async function fetchComplaintsByPlant(plantID: string): Promise<RawComplaint[]> {
  return paginate(
    async nextToken => {
      const data = await gqlQuery<{
        listComplaintsByPlant: { items: RawComplaint[]; nextToken?: string | null };
      }>(listComplaintsByPlantSafe, { plantID, nextToken });
      return data.listComplaintsByPlant ?? { items: [] };
    },
    `fetchComplaintsByPlant(${plantID})`
  );
}

function buildFleetSlice(
  orgID: string,
  plants: Plant[],
  rawTractors: RawTractor[],
  rawComplaints: RawComplaint[],
  rawRuntime: RawRuntimeEntry[],
  telemetryByLogger: Map<string, RawTelemetry>,
  runtimeHoursByLogger?: Map<string, number>
): Omit<PlantFleetSlice, 'plantID'> {
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
    mapRawTractor(t, orgID, plantById, cumulativeByLogger, telemetryByLogger, runtimeHoursByLogger)
  );

  const complaints = rawComplaints.map(c =>
    mapRawComplaint(c, orgID, plantById, tractorByVin)
  );

  const runtimeRecords = mapRawManualRuntimeToRecords(
    rawRuntime,
    orgID,
    plantById,
    new Map(
      [...tractorByLogger.entries()].map(([loggerID, t]) => [
        loggerID,
        { tractorID: t.vin, model: t.model || undefined, serialNumber: t.alias || t.vin },
      ])
    )
  );

  return { tractors, complaints, runtimeRecords };
}

/** All tractors + complaints per plant for reports (includes uncommissioned units). */
export async function fetchReportFleetData(
  orgID: string,
  plants: Plant[],
  plantID?: string | null
): Promise<{ tractors: Tractor[]; complaints: Complaint[] }> {
  if (!plantID) {
    const slices = await fetchOrgFleetBasic(orgID, plants);
    const tractorMap = new Map<string, Tractor>();
    const complaintMap = new Map<string, Complaint>();
    for (const slice of slices) {
      for (const t of slice.tractors) tractorMap.set(t.tractorID, t);
      for (const c of slice.complaints) complaintMap.set(c.complaintID, c);
    }
    return {
      tractors: Array.from(tractorMap.values()),
      complaints: Array.from(complaintMap.values()),
    };
  }

  const slice = await fetchPlantFleetBasic(orgID, plants, plantID);
  return {
    tractors: slice.tractors,
    complaints: slice.complaints,
  };
}

export async function fetchOrgFleetBasic(
  orgID: string,
  plants: Plant[]
): Promise<PlantFleetSlice[]> {
  const [rawTractors, rawComplaints] = await Promise.all([
    fetchTractorsByOrg(orgID),
    fetchComplaintsByOrg(orgID),
  ]);

  const tractorsByPlant = new Map<string, RawTractor[]>();
  const complaintsByPlant = new Map<string, RawComplaint[]>();

  for (const plant of plants) {
    tractorsByPlant.set(plant.plantID, []);
    complaintsByPlant.set(plant.plantID, []);
  }

  for (const t of rawTractors) {
    if (t.plantID) {
      if (!tractorsByPlant.has(t.plantID)) {
        tractorsByPlant.set(t.plantID, []);
      }
      tractorsByPlant.get(t.plantID)!.push(t);
    }
  }

  for (const c of rawComplaints) {
    if (c.plantID) {
      if (!complaintsByPlant.has(c.plantID)) {
        complaintsByPlant.set(c.plantID, []);
      }
      complaintsByPlant.get(c.plantID)!.push(c);
    }
  }

  return plants.map(plant => {
    const slice = buildFleetSlice(
      orgID,
      plants,
      tractorsByPlant.get(plant.plantID) || [],
      complaintsByPlant.get(plant.plantID) || [],
      [],
      new Map()
    );
    return {
      plantID: plant.plantID,
      ...slice,
    };
  });
}

/** Fast path: tractors + complaints for one plant (no telemetry/runtime fan-out). */
export async function fetchPlantFleetBasic(
  orgID: string,
  plants: Plant[],
  plantID: string
): Promise<PlantFleetSlice> {
  const [rawTractors, rawComplaints] = await Promise.all([
    fetchTractorsByPlant(plantID),
    fetchComplaintsByPlant(plantID),
  ]);
  const slice = buildFleetSlice(orgID, plants, rawTractors, rawComplaints, [], new Map());
  return { plantID, ...slice };
}

/** Re-fetch live telemetry for tractors already in memory (pull-to-refresh). */
export async function refreshTractorsTelemetry(
  plants: Plant[],
  tractors: Tractor[]
): Promise<Tractor[]> {
  const loggerIDs = [
    ...new Set(tractors.map(t => t.loggerID).filter((id): id is string => !!id)),
  ];
  if (loggerIDs.length === 0) return tractors;

  const { telemetryByLogger, runtimeHoursByLogger } = await fetchTelemetryByLoggers(loggerIDs);
  return tractors.map(t =>
    applyTelemetryToTractor(
      t,
      t.loggerID ? telemetryByLogger.get(t.loggerID) : undefined,
      t.loggerID ? runtimeHoursByLogger.get(t.loggerID) : undefined
    )
  );
}

/** Loads telemetry + runtime for tractors already fetched for a plant. */
export async function enrichPlantFleet(
  orgID: string,
  plants: Plant[],
  plantTractors: Tractor[]
): Promise<Pick<PlantFleetSlice, 'tractors' | 'runtimeRecords'>> {
  const loggerIDs = [
    ...new Set(plantTractors.map(t => t.loggerID).filter((id): id is string => !!id)),
  ];
  if (loggerIDs.length === 0) {
    return { tractors: plantTractors, runtimeRecords: [] };
  }

  const [rawRuntime, { telemetryByLogger, runtimeHoursByLogger }] = await Promise.all([
    fetchRuntimeEntriesByLoggers(loggerIDs),
    fetchTelemetryByLoggers(loggerIDs),
  ]);

  const cumulativeByLogger = new Map<string, number>();
  for (const r of rawRuntime) {
    const end = r.endCumulativeRuntime ?? 0;
    if (end > (cumulativeByLogger.get(r.loggerID) ?? 0)) {
      cumulativeByLogger.set(r.loggerID, end);
    }
  }

  const plantById = new Map(plants.map(p => [p.plantID, p]));
  const tractorByLogger = new Map(
    plantTractors.filter(t => t.loggerID).map(t => [t.loggerID as string, t])
  );

  const tractors = plantTractors.map(t => {
    const tel = t.loggerID ? telemetryByLogger.get(t.loggerID) : undefined;
    const runtimeH = t.loggerID ? runtimeHoursByLogger.get(t.loggerID) : undefined;
    const loggedRuntime = t.loggerID ? cumulativeByLogger.get(t.loggerID) : undefined;
    const withRuntime =
      runtimeH == null && loggedRuntime != null
        ? { ...t, totalRuntime: Math.round(loggedRuntime) }
        : t;
    return applyTelemetryToTractor(withRuntime, tel, runtimeH);
  });

  const runtimeRecords = mapRawManualRuntimeToRecords(
    rawRuntime,
    orgID,
    plantById,
    new Map(
      [...tractorByLogger.entries()].map(([loggerID, t]) => [
        loggerID,
        {
          tractorID: t.tractorID,
          model: t.model,
          serialNumber: t.serialNumber,
        },
      ])
    )
  );

  return { tractors, runtimeRecords };
}

/** Full load for a single plant (basic + enrich). */
export async function fetchPlantFleetData(
  orgID: string,
  plants: Plant[],
  plantID: string
): Promise<PlantFleetSlice> {
  const basic = await fetchPlantFleetBasic(orgID, plants, plantID);
  const enriched = await enrichPlantFleet(orgID, plants, basic.tractors);
  return {
    plantID,
    tractors: enriched.tractors,
    complaints: basic.complaints,
    runtimeRecords: enriched.runtimeRecords,
  };
}

/** @deprecated Prefer per-plant loading via fetchPlantFleetBasic / fetchPlantFleetData. */
export async function fetchFleetData(
  orgID: string,
  plants: Plant[]
): Promise<{ tractors: Tractor[]; complaints: Complaint[]; runtimeRecords: RuntimeRecord[] }> {
  let tractors: Tractor[] = [];
  let complaints: Complaint[] = [];
  let runtimeRecords: RuntimeRecord[] = [];

  for (const plant of plants) {
    const slice = await fetchPlantFleetData(orgID, plants, plant.plantID);
    tractors = mergeByKey(tractors, slice.tractors, t => t.tractorID);
    complaints = mergeByKey(complaints, slice.complaints, c => c.complaintID);
    runtimeRecords = mergeByKey(runtimeRecords, slice.runtimeRecords, r => r.recordID);
  }

  return { tractors, complaints, runtimeRecords };
}

function mergeByKey<T>(existing: T[], incoming: T[], keyFn: (item: T) => string): T[] {
  const map = new Map(existing.map(item => [keyFn(item), item]));
  for (const item of incoming) map.set(keyFn(item), item);
  return Array.from(map.values());
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
  const emptyTelemetry = new Map<string, RawTelemetry>();
  const emptyRuntimeHours = new Map<string, number>();

  let telemetryByLogger = emptyTelemetry;
  let runtimeHoursByLogger = emptyRuntimeHours;

  if (raw.loggerID) {
    const fetched = await fetchTelemetryByLoggers([raw.loggerID]);
    telemetryByLogger = fetched.telemetryByLogger;
    runtimeHoursByLogger = fetched.runtimeHoursByLogger;

    const entries = await fetchRuntimeEntriesByLogger(raw.loggerID);
    for (const r of entries) {
      const end = r.endCumulativeRuntime ?? 0;
      if (end > (cumulativeByLogger.get(raw.loggerID!) ?? 0)) {
        cumulativeByLogger.set(raw.loggerID!, end);
      }
    }
  }

  return mapRawTractor(
    raw,
    raw.orgID || '',
    plantById,
    cumulativeByLogger,
    telemetryByLogger,
    runtimeHoursByLogger
  );
}

const analyticsCache = new Map<string, TractorAnalytics>();

export async function fetchTractorAnalytics(
  tractorID: string,
  period: AnalyticsPeriod = 'GLOBAL',
  timeSegment = 'GLOBAL',
  forceRefresh = false
): Promise<TractorAnalytics | null> {
  const cacheKey = `${tractorID}-${period}-${timeSegment}`;
  if (!forceRefresh && analyticsCache.has(cacheKey)) {
    return analyticsCache.get(cacheKey)!;
  }
  const data = await gqlQuery<GetAnalyticsQuery>(getAnalyticsQuery, {
    tractorID,
    PeriodType: period as PeriodType,
    timeSegment,
  });
  const res = data.getAnalytics ?? null;
  if (res) {
    analyticsCache.set(cacheKey, res);
  }
  return res;
}

/** Same device keys as manual runtime: logger first, then VIN. */
export function tractorDeviceKeys(
  tractor: Pick<Tractor, 'tractorID' | 'loggerID'>
): string[] {
  const keys: string[] = [];
  const logger = tractor.loggerID?.trim();
  const vin = tractor.tractorID?.trim();
  if (logger) keys.push(logger);
  if (vin && vin !== logger) keys.push(vin);
  return keys;
}

function dedupeUsageSegments(items: UsageSegment[]): UsageSegment[] {
  const seen = new Set<string>();
  return items.filter(s => {
    const k = `${s.type}-${s.startTime}-${s.endTime ?? ''}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export type TractorTripsChargeData = {
  analytics: TractorAnalytics | null;
  usageSegments: UsageSegment[];
  tripSegments: UsageSegment[];
  chargeSegments: UsageSegment[];
  /** Primary key used (logger when present). */
  deviceKey: string | null;
};

/**
 * Trips/charge segments and analytics — keyed by loggerID (same as manual runtime), with VIN fallback.
 */
export async function fetchTractorTripsChargeData(
  tractor: Pick<Tractor, 'tractorID' | 'loggerID'>,
  options: {
    startTime: string;
    endTime: string;
    timeSegment: string;
  }
): Promise<TractorTripsChargeData> {
  const keys = tractorDeviceKeys(tractor);
  if (keys.length === 0) {
    return {
      analytics: null,
      usageSegments: [],
      tripSegments: [],
      chargeSegments: [],
      deviceKey: null,
    };
  }

  const segOpts = { limit: 80, startTime: options.startTime, endTime: options.endTime };
  const typeOpts = { limit: 50, startTime: options.startTime, endTime: options.endTime };

  let analytics: TractorAnalytics | null = null;
  for (const key of keys) {
    try {
      analytics = await fetchTractorAnalytics(key, 'MONTHLY', options.timeSegment);
      if (analytics) break;
    } catch {
      // try next key
    }
  }
  if (!analytics) {
    for (const key of keys) {
      try {
        analytics = await fetchTractorAnalytics(key, 'GLOBAL', 'GLOBAL');
        if (analytics) break;
      } catch {
        // try next key
      }
    }
  }

  const batches = await Promise.all(
    keys.map(async key => {
      const [all, trips, charges] = await Promise.all([
        fetchUsageSegments(key, segOpts).catch(() => [] as UsageSegment[]),
        fetchUsageSegmentsByType(key, SegmentType.TRIP, typeOpts).catch(
          () => [] as UsageSegment[]
        ),
        fetchUsageSegmentsByType(key, SegmentType.CHARGE, typeOpts).catch(
          () => [] as UsageSegment[]
        ),
      ]);
      return { all, trips, charges };
    })
  );

  return {
    analytics,
    usageSegments: dedupeUsageSegments(batches.flatMap(b => b.all)),
    tripSegments: dedupeUsageSegments(batches.flatMap(b => b.trips)),
    chargeSegments: dedupeUsageSegments(batches.flatMap(b => b.charges)),
    deviceKey: keys[0] ?? null,
  };
}

/** Sum GLOBAL `cumulative.totalCostSavings` across tractors (AppSync getAnalytics). */
/** Sum GLOBAL `cumulative.totalCostSavings` and `cumulative.totalTreesSaved` across tractors (AppSync getAnalytics). */
export async function fetchFleetImpactMetrics(
  tractorIDs: string[],
  concurrency = 6,
  forceRefresh = false
): Promise<{ costSavings: number; treesSaved: number }> {
  const map = await fetchTractorsAnalytics(tractorIDs, concurrency, forceRefresh);
  let costSavings = 0;
  let treesSaved = 0;
  for (const a of map.values()) {
    const cost = a?.cumulative?.totalCostSavings;
    if (cost != null && !Number.isNaN(cost)) costSavings += cost;

    const trees = a?.cumulative?.totalTreesSaved;
    if (trees != null && !Number.isNaN(trees)) treesSaved += trees;
  }
  return {
    costSavings: Math.round(costSavings),
    treesSaved: Math.round(treesSaved * 10) / 10,
  };
}

/** Sum GLOBAL `cumulative.totalCostSavings` across tractors (AppSync getAnalytics). */
export async function fetchFleetTotalCostSavings(
  tractorIDs: string[],
  concurrency = 6,
  forceRefresh = false
): Promise<number> {
  const metrics = await fetchFleetImpactMetrics(tractorIDs, concurrency, forceRefresh);
  return metrics.costSavings;
}

/** Batch fetch GLOBAL analytics (trips / charges buckets) for many tractors. */
export async function fetchTractorsAnalytics(
  tractorIDs: string[],
  concurrency = 6,
  forceRefresh = false
): Promise<Map<string, TractorAnalytics | null>> {
  const unique = [...new Set(tractorIDs.filter(Boolean))];
  const result = new Map<string, TractorAnalytics | null>();
  if (unique.length === 0) return result;

  await runPool(unique, concurrency, async tractorID => {
    try {
      result.set(tractorID, await fetchTractorAnalytics(tractorID, 'GLOBAL', 'GLOBAL', forceRefresh));
    } catch {
      result.set(tractorID, null);
    }
  });
  return result;
}

export async function fetchUsageSegments(
  tractorID: string,
  options?: { limit?: number; startTime?: string; endTime?: string }
): Promise<UsageSegment[]> {
  const limit = options?.limit ?? 30;
  return paginate(
    async nextToken => {
      const data = await gqlQuery<ListUsageSegmentsQuery>(listUsageSegmentsQuery, {
        tractorID,
        startTime: options?.startTime,
        endTime: options?.endTime,
        limit,
        nextToken,
        sortOrder: 'DESC',
      });
      const page = data.listUsageSegments;
      return {
        items: (page?.items ?? []).filter((s): s is UsageSegment => !!s),
        nextToken: page?.nextToken,
      };
    },
    `fetchUsageSegments(${tractorID})`,
    5
  );
}

export async function fetchUsageSegmentsByType(
  tractorID: string,
  type: SegmentType,
  options?: { limit?: number; startTime?: string; endTime?: string }
): Promise<UsageSegment[]> {
  const limit = options?.limit ?? 20;
  return paginate(
    async nextToken => {
      const data = await gqlQuery<{
        listUsageSegmentsByType?: ListUsageSegmentsQuery['listUsageSegments'];
      }>(listUsageSegmentsByTypeQuery, {
        tractorID,
        type,
        startTime: options?.startTime,
        endTime: options?.endTime,
        limit,
        nextToken,
        sortOrder: 'DESC',
      });
      const page = data.listUsageSegmentsByType;
      return {
        items: (page?.items ?? []).filter((s): s is UsageSegment => !!s),
        nextToken: page?.nextToken,
      };
    },
    `fetchUsageSegmentsByType(${tractorID},${type})`,
    4
  );
}

/** @deprecated Amplify handles auth tokens automatically. Kept for compatibility. */
export function setAppsyncTokenGetter(_getter: () => string | null) {
  // no-op: Amplify GraphQL client uses Cognito session from Amplify Auth
}

import Constants from 'expo-constants';

const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string>;

const ENDPOINT = extra.appsyncEndpoint || '';

let _tokenGetter: (() => string | null) | null = null;

export function setAppsyncTokenGetter(getter: () => string | null) {
  _tokenGetter = getter;
}

export async function gqlQuery<T = unknown>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  if (!ENDPOINT) {
    throw new Error(
      'AppSync endpoint is not configured (expo config "extra.appsyncEndpoint" is empty).'
    );
  }

  // AppSync uses Cognito User Pool auth (defaultAuthMode: userPool): the raw
  // idToken must be sent in the Authorization header. There is no API-key
  // fallback — surface a clear "not authenticated" error instead.
  const token = _tokenGetter?.();
  if (!token) {
    throw new Error('Not authenticated: no Cognito token available for AppSync.');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: token,
  };

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });

  let json: { data?: T; errors?: Array<{ message?: string }> };
  try {
    json = await response.json();
  } catch {
    throw new Error(`AppSync request failed (HTTP ${response.status} ${response.statusText}).`);
  }

  if (!response.ok) {
    const msg = json?.errors?.[0]?.message || response.statusText || 'request failed';
    throw new Error(`AppSync request failed (HTTP ${response.status}): ${msg}`);
  }

  if (json.errors?.length) {
    throw new Error(json.errors[0].message || 'GraphQL error');
  }

  return json.data as T;
}

// ─── Organization ───────────────────────────────────────────────────────────

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
  fuelLevel?: number;
  engineHours?: number;
  location?: string;
  plantName?: string;
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

// ─── Queries ────────────────────────────────────────────────────────────────

const GET_ORGANIZATION = `
  query GetOrganization($orgID: ID!) {
    getOrganization(orgID: $orgID) {
      orgID name industry location contactEmail contactPhone
    }
  }
`;

const LIST_ORGANIZATIONS = `
  query ListOrganizations {
    listOrganizations {
      orgID name industry location
    }
  }
`;

const LIST_PLANTS_BY_ORG = `
  query ListPlantsByOrganization($orgID: ID!) {
    listPlantsByOrganization(orgID: $orgID) {
      orgID plantID name location plantType createdAt
    }
  }
`;

const LIST_USERS_BY_ORG = `
  query ListUsersByOrg($orgID: ID!) {
    listUsersByOrg(orgID: $orgID) {
      id name email phone role orgID accessiblePlantIDs status cognitoGroups createdAt
    }
  }
`;

const LIST_ALL_USERS = `
  query ListAllUsers {
    listAllUsers {
      id name email phone role orgID accessiblePlantIDs status cognitoGroups createdAt
    }
  }
`;

// ─── API Functions ───────────────────────────────────────────────────────────

export async function fetchOrganization(orgID: string): Promise<Organization> {
  const data = await gqlQuery<{ getOrganization: Organization }>(GET_ORGANIZATION, { orgID });
  return data.getOrganization;
}

export async function fetchAllOrganizations(): Promise<Organization[]> {
  const data = await gqlQuery<{ listOrganizations: Organization[] }>(LIST_ORGANIZATIONS);
  return data.listOrganizations || [];
}

export async function fetchPlantsByOrg(orgID: string): Promise<Plant[]> {
  const data = await gqlQuery<{ listPlantsByOrganization: Plant[] }>(LIST_PLANTS_BY_ORG, { orgID });
  return data.listPlantsByOrganization || [];
}

export async function fetchUsersByOrg(orgID: string): Promise<AppUser[]> {
  const data = await gqlQuery<{ listUsersByOrg: AppUser[] }>(LIST_USERS_BY_ORG, { orgID });
  return data.listUsersByOrg || [];
}

export async function fetchAllUsers(): Promise<AppUser[]> {
  const data = await gqlQuery<{ listAllUsers: AppUser[] }>(LIST_ALL_USERS);
  return data.listAllUsers || [];
}

// ─── Fleet data (tractors / complaints / runtime) ───────────────────────────
//
// These come from the real AppSync schema. The backend models electric
// tractors (telemetry-based) and a maintenance/complaint workflow, so the raw
// shapes differ from this app's view models — we map them below.

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

interface RawRuntimeEntry {
  loggerID: string;
  date: string;
  plantID?: string | null;
  orgID?: string | null;
  todaysRuntime?: number | null;
  startCumulativeRuntime?: number | null;
  endCumulativeRuntime?: number | null;
}

const LIST_TRACTORS_BY_ORG = `
  query ListTractorsByOrg($orgID: ID!) {
    listTractorsByOrg(orgID: $orgID) {
      vin alias registerNumber model plantID orgID loggerID serviceStatus color
    }
  }
`;

const LIST_COMPLAINTS_BY_ORG = `
  query ListComplaintsByOrg($orgID: ID!, $nextToken: String) {
    listComplaintsByOrg(orgID: $orgID, nextToken: $nextToken) {
      items {
        complaintID orgID plantID tractorVIN problemSubType breakdownType
        description priority state createdAt closedAt driverName raisedByUserID
      }
      nextToken
    }
  }
`;

const LIST_MANUAL_RUNTIME_BY_LOGGER = `
  query ListManualRuntimeEntries($loggerID: String!, $limit: Int, $nextToken: String) {
    listManualRuntimeEntries(loggerID: $loggerID, limit: $limit, nextToken: $nextToken) {
      items {
        loggerID date plantID orgID todaysRuntime startCumulativeRuntime endCumulativeRuntime
      }
      nextToken
    }
  }
`;

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
  // problemType is intentionally not requested (dirty enum data breaks AppSync
  // serialization), so critical detection uses the free-text breakdownType hint.
  if (/major|accident|breakdown/i.test(hint || '')) return 'CRITICAL';
  switch ((priority || '').toUpperCase()) {
    case 'HIGH': return 'HIGH';
    case 'LOW': return 'LOW';
    case 'MEDIUM': return 'MEDIUM';
    default: return 'MEDIUM';
  }
}

function mapComplaintStatus(state?: string | null): Complaint['status'] {
  switch ((state || '').toUpperCase()) {
    case 'PENDING': return 'OPEN';
    case 'ACCEPTED':
    case 'RESOLVING': return 'IN_PROGRESS';
    case 'RESOLVED': return 'RESOLVED';
    case 'CLOSED':
    case 'CANCELLED': return 'CLOSED';
    default: return 'OPEN';
  }
}

// ─── Fetchers ───────────────────────────────────────────────────────────────

async function fetchTractorsByOrg(orgID: string): Promise<RawTractor[]> {
  const data = await gqlQuery<{ listTractorsByOrg: RawTractor[] }>(LIST_TRACTORS_BY_ORG, { orgID });
  return data.listTractorsByOrg || [];
}

async function fetchComplaintsByOrg(orgID: string): Promise<RawComplaint[]> {
  const items: RawComplaint[] = [];
  let nextToken: string | null | undefined;
  let pages = 0;
  do {
    const data = await gqlQuery<{ listComplaintsByOrg: { items: RawComplaint[]; nextToken?: string | null } }>(
      LIST_COMPLAINTS_BY_ORG,
      { orgID, nextToken }
    );
    const conn = data.listComplaintsByOrg;
    if (conn?.items) items.push(...conn.items);
    nextToken = conn?.nextToken;
    pages++;
  } while (nextToken && pages < 25);
  if (nextToken) {
    console.warn('fetchComplaintsByOrg: page cap reached; complaint list may be truncated.');
  }
  return items;
}

async function fetchRuntimeEntriesByLogger(loggerID: string): Promise<RawRuntimeEntry[]> {
  const items: RawRuntimeEntry[] = [];
  let nextToken: string | null | undefined;
  let pages = 0;
  do {
    const data = await gqlQuery<{ listManualRuntimeEntries: { items: RawRuntimeEntry[]; nextToken?: string | null } }>(
      LIST_MANUAL_RUNTIME_BY_LOGGER,
      { loggerID, limit: 200, nextToken }
    );
    const conn = data.listManualRuntimeEntries;
    if (conn?.items) items.push(...conn.items);
    nextToken = conn?.nextToken;
    pages++;
  } while (nextToken && pages < 25);
  if (nextToken) {
    console.warn(`fetchRuntimeEntriesByLogger: page cap reached for logger ${loggerID}; runtime list may be truncated.`);
  }
  return items;
}

// The runtime resolver requires loggerID (or plantID+date / orgID+date), so we
// fan out one query per tractor logger and merge the results.
async function fetchRuntimeEntriesByLoggers(loggerIDs: string[]): Promise<RawRuntimeEntry[]> {
  const results = await Promise.all(loggerIDs.map(fetchRuntimeEntriesByLogger));
  return results.flat();
}

/**
 * Fetches and assembles the full fleet view (tractors, complaints, runtime) for
 * an organization, mapping the raw AppSync shapes into the app's view models and
 * cross-referencing plant names and tractor models.
 */
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
  const rawRuntime = await fetchRuntimeEntriesByLoggers(loggerIDs);

  const plantById = new Map(plants.map(p => [p.plantID, p]));
  const tractorByVin = new Map(rawTractors.map(t => [t.vin, t]));
  const tractorByLogger = new Map(
    rawTractors.filter(t => t.loggerID).map(t => [t.loggerID as string, t])
  );

  // Latest cumulative runtime per logger → tractor total runtime.
  const cumulativeByLogger = new Map<string, number>();
  for (const r of rawRuntime) {
    const end = r.endCumulativeRuntime ?? 0;
    if (end > (cumulativeByLogger.get(r.loggerID) ?? 0)) {
      cumulativeByLogger.set(r.loggerID, end);
    }
  }

  const tractors: Tractor[] = rawTractors.map(t => {
    const plant = t.plantID ? plantById.get(t.plantID) : undefined;
    const totalRuntime = t.loggerID ? cumulativeByLogger.get(t.loggerID) ?? 0 : 0;
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
    };
  });

  const complaints: Complaint[] = rawComplaints.map(c => {
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
  });

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

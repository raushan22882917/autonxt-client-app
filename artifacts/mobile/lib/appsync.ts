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

  const json = await response.json();

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

// ─── Mock data for tractors/complaints/runtime (no schema yet) ──────────────

export function getMockTractors(orgID: string, plants: Plant[]): Tractor[] {
  const statuses: Tractor['status'][] = ['ACTIVE', 'IDLE', 'MAINTENANCE', 'OFFLINE'];
  const models = ['AutoNXT X45H2', 'AutoNXT X60C2L', 'AutoNXT X45C4', 'AutoNXT X60C2', 'AutoNXT X60C4'];
  const tractors: Tractor[] = [];
  plants.forEach((plant, pi) => {
    for (let i = 0; i < 4 + pi; i++) {
      tractors.push({
        tractorID: `TRC-${plant.plantID}-${i + 1}`,
        orgID,
        plantID: plant.plantID,
        model: models[i % models.length],
        serialNumber: `SN-${plant.plantID.slice(-4)}-${1000 + i}`,
        status: statuses[i % statuses.length],
        totalRuntime: Math.floor(1200 + Math.random() * 4000),
        lastActive: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
        fuelLevel: Math.floor(20 + Math.random() * 80),
        engineHours: Math.floor(800 + Math.random() * 3000),
        location: plant.location || plant.name,
        plantName: plant.name,
      });
    }
  });
  return tractors;
}

export function getMockComplaints(orgID: string, tractors: Tractor[]): Complaint[] {
  const titles = [
    'Engine overheating',
    'Hydraulic pressure low',
    'PTO not engaging',
    'Transmission noise',
    'Fuel leak detected',
    'Brake failure',
    'Electrical fault',
    'Coolant leak',
  ];
  const severities: Complaint['severity'][] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const statuses: Complaint['status'][] = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  return tractors.slice(0, Math.min(tractors.length, 12)).map((t, i) => ({
    complaintID: `CMP-${t.tractorID}-${i}`,
    tractorID: t.tractorID,
    orgID,
    plantID: t.plantID,
    title: titles[i % titles.length],
    description: `Reported issue: ${titles[i % titles.length]}. Immediate inspection required.`,
    severity: severities[i % severities.length],
    status: statuses[i % statuses.length],
    reportedBy: 'Operator',
    createdAt: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
    resolvedAt: statuses[i % statuses.length] === 'RESOLVED' ? new Date().toISOString() : undefined,
    plantName: t.plantName,
    tractorModel: t.model,
  }));
}

export function getMockRuntimeRecords(tractors: Tractor[]): RuntimeRecord[] {
  const records: RuntimeRecord[] = [];
  tractors.slice(0, 8).forEach(t => {
    for (let d = 0; d < 7; d++) {
      const date = new Date(Date.now() - d * 86400000);
      records.push({
        recordID: `RT-${t.tractorID}-${d}`,
        tractorID: t.tractorID,
        orgID: t.orgID,
        plantID: t.plantID,
        date: date.toISOString().split('T')[0],
        hoursRun: Math.round((2 + Math.random() * 10) * 10) / 10,
        fuelConsumed: Math.round((15 + Math.random() * 40) * 10) / 10,
        distanceCovered: Math.round((30 + Math.random() * 120) * 10) / 10,
        operatorID: `OP-${Math.floor(Math.random() * 5) + 1}`,
        plantName: t.plantName,
        tractorModel: t.model,
      });
    }
  });
  return records;
}

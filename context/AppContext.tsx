import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import {
  Organization,
  Plant,
  AppUser,
  Tractor,
  Complaint,
  RuntimeRecord,
  PlantFleetSlice,
  fetchOrganization,
  fetchAllOrganizations,
  fetchPlantsByOrg,
  fetchUsersByOrg,
  fetchAllUsers,
  fetchPlantFleetData,
  refreshTractorsTelemetry,
  isCommissionedTractor,
} from '@/lib/appsync';

interface AppState {
  organizations: Organization[];
  organization: Organization | null;
  plants: Plant[];
  users: AppUser[];
  tractors: Tractor[];
  complaints: Complaint[];
  runtimeRecords: RuntimeRecord[];
  selectedPlantID: string | null;
  setSelectedPlantID: (id: string | null) => void;
  filteredTractors: Tractor[];
  filteredComplaints: Complaint[];
  filteredRuntimeRecords: RuntimeRecord[];
  isLoading: boolean;
  isLoadingMorePlants: boolean;
  loadingMessage: string;
  loadedPlantIDs: string[];
  error: string | null;
  refresh: () => void;
  /** Re-fetch live telemetry for all loaded tractors (fast). */
  refreshLiveTelemetry: () => Promise<void>;
}

const AppContext = createContext<AppState>({
  organizations: [],
  organization: null,
  plants: [],
  users: [],
  tractors: [],
  complaints: [],
  runtimeRecords: [],
  selectedPlantID: null,
  setSelectedPlantID: () => {},
  filteredTractors: [],
  filteredComplaints: [],
  filteredRuntimeRecords: [],
  isLoading: false,
  isLoadingMorePlants: false,
  loadingMessage: '',
  loadedPlantIDs: [],
  error: null,
  refresh: () => {},
  refreshLiveTelemetry: async () => {},
});

function mergeSlice(
  tractors: Tractor[],
  complaints: Complaint[],
  runtimeRecords: RuntimeRecord[],
  slice: PlantFleetSlice
): { tractors: Tractor[]; complaints: Complaint[]; runtimeRecords: RuntimeRecord[] } {
  const tractorMap = new Map(tractors.map(t => [t.tractorID, t]));
  for (const t of slice.tractors) {
    if (isCommissionedTractor(t)) tractorMap.set(t.tractorID, t);
  }

  const complaintMap = new Map(complaints.map(c => [c.complaintID, c]));
  for (const c of slice.complaints) complaintMap.set(c.complaintID, c);

  const runtimeMap = new Map(runtimeRecords.map(r => [r.recordID, r]));
  for (const r of slice.runtimeRecords) runtimeMap.set(r.recordID, r);

  return {
    tractors: Array.from(tractorMap.values()),
    complaints: Array.from(complaintMap.values()),
    runtimeRecords: Array.from(runtimeMap.values()),
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [tractors, setTractors] = useState<Tractor[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [runtimeRecords, setRuntimeRecords] = useState<RuntimeRecord[]>([]);
  const [selectedPlantID, setSelectedPlantID] = useState<string | null>(null);
  const [loadedPlantIDs, setLoadedPlantIDs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMorePlants, setIsLoadingMorePlants] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Preparing your fleet…');
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const loadedSetRef = useRef(new Set<string>());
  const loadingPlantsRef = useRef(new Set<string>());
  const orgRef = useRef<Organization | null>(null);
  const plantsRef = useRef<Plant[]>([]);
  const cancelledRef = useRef(false);
  const tractorsRef = useRef<Tractor[]>([]);

  const refresh = () => setTick(t => t + 1);

  useEffect(() => {
    tractorsRef.current = tractors;
  }, [tractors]);

  const refreshLiveTelemetry = useCallback(async () => {
    const plantList = plantsRef.current;
    const current = tractorsRef.current.filter(isCommissionedTractor);
    if (current.length === 0) return;
    setIsLoadingMorePlants(true);
    setLoadingMessage('Updating live telemetry…');
    try {
      const updated = await refreshTractorsTelemetry(plantList, current);
      const byId = new Map(updated.map(t => [t.tractorID, t]));
      setTractors(prev =>
        prev.map(t => (byId.has(t.tractorID) ? (byId.get(t.tractorID) as Tractor) : t))
      );
    } catch (e: unknown) {
      console.warn('Live telemetry refresh failed:', e);
    } finally {
      setIsLoadingMorePlants(false);
      setLoadingMessage('');
    }
  }, []);

  const applySlice = useCallback((slice: PlantFleetSlice) => {
    setTractors(prev => {
      const merged = mergeSlice(prev, [], [], slice);
      return merged.tractors;
    });
    setComplaints(prev => {
      const merged = mergeSlice([], prev, [], slice);
      return merged.complaints;
    });
    setRuntimeRecords(prev => {
      const merged = mergeSlice([], [], prev, slice);
      return merged.runtimeRecords;
    });
    loadedSetRef.current.add(slice.plantID);
    setLoadedPlantIDs(Array.from(loadedSetRef.current));
  }, []);

  const loadPlant = useCallback(
    async (plantID: string, options?: { priority?: boolean }) => {
      const org = orgRef.current;
      const plantList = plantsRef.current;
      if (!org || loadingPlantsRef.current.has(plantID)) return;
      if (loadedSetRef.current.has(plantID) && !options?.priority) return;

      loadingPlantsRef.current.add(plantID);
      if (!options?.priority) setIsLoadingMorePlants(true);
      const plantName = plantList.find(p => p.plantID === plantID)?.name ?? 'plant';
      setLoadingMessage(`Loading ${plantName}…`);

      try {
        const slice = await fetchPlantFleetData(org.orgID, plantList, plantID);
        if (cancelledRef.current) return;
        applySlice(slice);
      } catch (e: unknown) {
        if (!cancelledRef.current) {
          console.warn(`Failed to load plant ${plantID}:`, e);
        }
      } finally {
        loadingPlantsRef.current.delete(plantID);
        if (loadingPlantsRef.current.size === 0) {
          setIsLoadingMorePlants(false);
        }
      }
    },
    [applySlice]
  );

  useEffect(() => {
    if (!user) return;

    cancelledRef.current = false;
    loadedSetRef.current = new Set();
    loadingPlantsRef.current = new Set();
    setLoadedPlantIDs([]);
    setTractors([]);
    setComplaints([]);
    setRuntimeRecords([]);

    const run = async () => {
      setIsLoading(true);
      setIsLoadingMorePlants(false);
      setLoadingMessage('Connecting to your organization…');
      setError(null);

      try {
        const orgID = user.orgID || '';
        let orgs: Organization[] = [];
        let org: Organization | null = null;
        let fetchedPlants: Plant[] = [];
        let fetchedUsers: AppUser[] = [];

        setLoadingMessage('Loading plants and team…');

        if (isAdmin && !orgID) {
          orgs = await fetchAllOrganizations();
          if (orgs.length > 0) {
            org = orgs[0];
            fetchedPlants = await fetchPlantsByOrg(org.orgID);
            fetchedUsers = await fetchAllUsers();
          }
        } else if (orgID) {
          org = await fetchOrganization(orgID);
          orgs = org ? [org] : [];
          fetchedPlants = await fetchPlantsByOrg(orgID);
          fetchedUsers = await fetchUsersByOrg(orgID);
        }

        if (cancelledRef.current) return;

        orgRef.current = org;
        plantsRef.current = fetchedPlants;
        setOrganizations(orgs);
        setOrganization(org);
        setPlants(fetchedPlants);
        setUsers(fetchedUsers);

        if (!org || fetchedPlants.length === 0) {
          setIsLoading(false);
          return;
        }

        const firstPlant = fetchedPlants[0];
        setLoadingMessage(`Loading tractors for ${firstPlant.name}…`);
        setIsLoadingMorePlants(true);
        const firstSlice = await fetchPlantFleetData(org.orgID, fetchedPlants, firstPlant.plantID);
        if (cancelledRef.current) return;

        applySlice(firstSlice);
        setIsLoading(false);
        for (let i = 1; i < fetchedPlants.length; i++) {
          if (cancelledRef.current) break;
          const plant = fetchedPlants[i];
          setLoadingMessage(`Loading ${plant.name} (${i + 1}/${fetchedPlants.length})…`);
          await loadPlant(plant.plantID);
        }
        if (!cancelledRef.current) setIsLoadingMorePlants(false);
      } catch (e: unknown) {
        if (!cancelledRef.current) {
          const msg = e instanceof Error ? e.message : 'Failed to load data';
          setError(msg);
          setIsLoading(false);
          setIsLoadingMorePlants(false);
        }
      }
    };

    run();

    return () => {
      cancelledRef.current = true;
    };
  }, [user, isAdmin, tick, applySlice, loadPlant]);

  // When user picks a plant that is not loaded yet, fetch it next.
  useEffect(() => {
    if (!selectedPlantID || !organization) return;
    if (loadedSetRef.current.has(selectedPlantID)) return;
    loadPlant(selectedPlantID, { priority: true });
  }, [selectedPlantID, organization, loadPlant]);

  const commissionedTractors = tractors.filter(isCommissionedTractor);

  const filteredTractors = selectedPlantID
    ? commissionedTractors.filter(t => t.plantID === selectedPlantID)
    : commissionedTractors;

  const filteredComplaints = selectedPlantID
    ? complaints.filter(c => c.plantID === selectedPlantID)
    : complaints;

  const filteredRuntimeRecords = selectedPlantID
    ? runtimeRecords.filter(r => r.plantID === selectedPlantID)
    : runtimeRecords;

  return (
    <AppContext.Provider
      value={{
        organizations,
        organization,
        plants,
        users,
        tractors: commissionedTractors,
        complaints,
        runtimeRecords,
        selectedPlantID,
        setSelectedPlantID,
        filteredTractors,
        filteredComplaints,
        filteredRuntimeRecords,
        isLoading,
        isLoadingMorePlants,
        loadingMessage,
        loadedPlantIDs,
        error,
        refresh,
        refreshLiveTelemetry,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);

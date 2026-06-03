import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import {
  Organization,
  Plant,
  AppUser,
  Tractor,
  Complaint,
  RuntimeRecord,
  fetchOrganization,
  fetchAllOrganizations,
  fetchPlantsByOrg,
  fetchUsersByOrg,
  fetchAllUsers,
  fetchFleetData,
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
  error: string | null;
  refresh: () => void;
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
  error: null,
  refresh: () => {},
});

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refresh = () => setTick(t => t + 1);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const orgID = user.orgID || '';
        let orgs: Organization[] = [];
        let org: Organization | null = null;
        let fetchedPlants: Plant[] = [];
        let fetchedUsers: AppUser[] = [];

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

        const fleet = org
          ? await fetchFleetData(org.orgID, fetchedPlants)
          : { tractors: [], complaints: [], runtimeRecords: [] };
        const fetchedTractors = fleet.tractors;
        const fetchedComplaints = fleet.complaints;
        const fetchedRuntime = fleet.runtimeRecords;

        setOrganizations(orgs);
        setOrganization(org);
        setPlants(fetchedPlants);
        setUsers(fetchedUsers);
        setTractors(fetchedTractors);
        setComplaints(fetchedComplaints);
        setRuntimeRecords(fetchedRuntime);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Failed to load data';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [user, isAdmin, tick]);

  const filteredTractors = selectedPlantID
    ? tractors.filter(t => t.plantID === selectedPlantID)
    : tractors;

  const filteredComplaints = selectedPlantID
    ? complaints.filter(c => c.plantID === selectedPlantID)
    : complaints;

  const filteredRuntimeRecords = selectedPlantID
    ? runtimeRecords.filter(r => r.plantID === selectedPlantID)
    : runtimeRecords;

  return (
    <AppContext.Provider value={{
      organizations,
      organization,
      plants,
      users,
      tractors,
      complaints,
      runtimeRecords,
      selectedPlantID,
      setSelectedPlantID,
      filteredTractors,
      filteredComplaints,
      filteredRuntimeRecords,
      isLoading,
      error,
      refresh,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);

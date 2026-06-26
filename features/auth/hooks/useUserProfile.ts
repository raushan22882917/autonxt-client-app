// src/features/auth/hooks/useUserProfile.ts

import { useQuery } from '@tanstack/react-query';
import { fetchAuthSession } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import { getUser, getOrganization } from '@/graphql/queries';
import { User as DbUser, Organization } from '@/graphql/API';
import { useUserContext } from '@/features/auth/contexts/UserContext';
import { useMemo } from 'react';

const client = generateClient();

export interface UserProfile {
  email: string;
  groups: string[];
  dbRecord?: DbUser;
  organization?: Organization;
}

export function useUserProfile() {
  const { userAttributes, isLoading: authLoading, signOut } = useUserContext();

  // 1️⃣ Compute the email/username key (memoized to prevent re-renders)
  const email = useMemo(() => {
    return userAttributes?.email || userAttributes?.preferred_username || '';
  }, [userAttributes?.email, userAttributes?.preferred_username]);

  // 2️⃣ Fetch Cognito groups
  const groupsQuery = useQuery<string[], Error>({
    queryKey: ['cognitoGroups', email],
    queryFn: async () => {
      const session = await fetchAuthSession();
      const raw = session.tokens?.idToken?.payload['cognito:groups'];
      return Array.isArray(raw) ? (raw as string[]) : [];
    },
    enabled: !!email,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
  const groups = useMemo(() => groupsQuery.data ?? [], [groupsQuery.data]);

  // 3️⃣ Fetch your DynamoDB "User" record
  const dbQuery = useQuery<DbUser | undefined, Error>({
    queryKey: ['userDbRecord', email],
    queryFn: async () => {
      if (!email) return undefined;
      try {
        const resp = await client.graphql({
          query: getUser,
          variables: { id: email },
        });
        return resp.data?.getUser as DbUser | undefined;
      } catch (error) {
        console.warn('Failed to fetch user record from database:', error);
        // Return undefined instead of throwing to allow app to continue
        return undefined;
      }
    },
    enabled: !!email,
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: false, // Don't retry on failure
  });
  const dbRecord = dbQuery.data;

  // 4️⃣ Fetch organization information if user has orgID
  const orgQuery = useQuery<Organization | undefined, Error>({
    queryKey: ['organization', dbRecord?.orgID],
    queryFn: async () => {
      if (!dbRecord?.orgID) return undefined;
      const resp = await client.graphql({
        query: getOrganization,
        variables: { orgID: dbRecord.orgID },
      });
      return resp.data?.getOrganization as Organization | undefined;
    },
    enabled: !!dbRecord?.orgID,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
  const organization = orgQuery.data;

  // 5️⃣ Consolidate loading state
  const isLoading = authLoading || groupsQuery.isLoading || dbQuery.isLoading || orgQuery.isLoading;

  // 6️⃣ Return the merged profile (memoized to prevent re-renders)
  const profile = useMemo(() => ({
    email,
    groups,
    dbRecord,
    organization,
  } as UserProfile), [email, groups, dbRecord, organization]);

  return {
    isLoading,
    signOut,
    profile,
  };
}

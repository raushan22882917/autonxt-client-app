// src/features/auth/hooks/useRoleBasedOrganizations.ts

import { useQuery } from '@tanstack/react-query';
import { generateClient } from 'aws-amplify/api';
import { listOrganizations } from '@/graphql/queries';
import { Organization } from '@/graphql/API';
import { useUserProfile } from './useUserProfile';
import { filterOrganizationsByRole, canLogin } from '@/features/auth/lib/roleUtils';

const client = generateClient();

/** User's organization only (from profile.orgID). */
export function useRoleBasedOrganizations() {
  const { profile, isLoading: profileLoading } = useUserProfile();
  const userOrgId = profile?.dbRecord?.orgID;

  const userOrgQuery = useQuery<Organization[], Error>({
    queryKey: ['organizations', 'user', userOrgId],
    queryFn: async () => {
      if (!userOrgId) return [];

      const resp = await client.graphql({
        query: listOrganizations,
      });
      const allOrgs = (resp.data?.listOrganizations as Organization[]) || [];
      return filterOrganizationsByRole(profile, allOrgs);
    },
    enabled: !!userOrgId,
    staleTime: 1000 * 60 * 60,
  });

  return {
    organizations: userOrgQuery.data || [],
    isLoading: profileLoading || userOrgQuery.isLoading,
    error: userOrgQuery.error,
    userOrgId,
    canLogin: canLogin(profile),
  };
}

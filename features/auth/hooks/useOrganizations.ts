import { useQuery } from '@tanstack/react-query';
import { generateClient } from 'aws-amplify/api';
import { listOrganizations } from '@/graphql/queries';
import { Organization } from '@/graphql/API';
import { useUserProfile } from './useUserProfile';
import { filterOrganizationsByRole } from '@/features/auth/lib/roleUtils';

const client = generateClient();

export function useOrganizations() {
  const { profile } = useUserProfile();
  const userOrgId = profile?.dbRecord?.orgID;

  const query = useQuery<Organization[], Error>({
    queryKey: ['organizations', 'user', userOrgId],
    queryFn: async () => {
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
    organizations: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    userOrgId,
  };
}

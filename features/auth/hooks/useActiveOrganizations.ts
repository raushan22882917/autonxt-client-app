import { useQuery } from '@tanstack/react-query';
import { generateClient } from 'aws-amplify/api';
import { listOrganizations, listUsersByOrg } from '@/graphql/queries';
import { Organization, User } from '@/graphql/API';
import { useUserProfile } from './useUserProfile';
import { filterOrganizationsByRole } from '@/features/auth/lib/roleUtils';

export interface ActiveOrganization extends Organization {
  activeUserCount: number;
  activeUsers: User[];
}

export function useActiveOrganizations() {
  const client = generateClient();
  const { profile } = useUserProfile();
  const userOrgId = profile.dbRecord?.orgID;

  const query = useQuery<ActiveOrganization[], Error>({
    queryKey: ['activeOrganizations', 'user', userOrgId],
    queryFn: async () => {
      const orgsResp = await client.graphql({
        query: listOrganizations,
      });
      const allOrgs = (orgsResp.data?.listOrganizations as Organization[]) || [];
      const organizations = filterOrganizationsByRole(profile, allOrgs);

      const activeOrganizations: ActiveOrganization[] = [];

      for (const org of organizations) {
        try {
          const usersResp = await client.graphql({
            query: listUsersByOrg,
            variables: { orgID: org.orgID },
          });

          const users = (usersResp.data?.listUsersByOrg as User[]) || [];
          const activeUsers = users.filter(
            (user) => user.status === 'ACTIVE' || !user.status
          );

          if (activeUsers.length > 0) {
            activeOrganizations.push({
              ...org,
              activeUserCount: activeUsers.length,
              activeUsers,
            });
          }
        } catch (error) {
          console.warn(`Failed to fetch users for organization ${org.orgID}:`, error);
        }
      }

      return activeOrganizations;
    },
    enabled: !!userOrgId,
    staleTime: 1000 * 60 * 60,
  });

  return {
    activeOrganizations: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    userOrgId,
  };
}

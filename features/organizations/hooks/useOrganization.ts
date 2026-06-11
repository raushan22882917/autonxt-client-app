import { useQuery } from '@tanstack/react-query';
import { generateClient } from 'aws-amplify/api';
import { getOrganization } from '@/graphql/queries';
import { Organization } from '@/graphql/API';

const client = generateClient();

export function useOrganization(orgID: string | undefined) {
  return useQuery<Organization | undefined, Error>({
    queryKey: ['organization', orgID],
    queryFn: async () => {
      if (!orgID) return undefined;
      const resp = await client.graphql({
        query: getOrganization,
        variables: { orgID },
      });
      return resp.data?.getOrganization as Organization | undefined;
    },
    enabled: !!orgID,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

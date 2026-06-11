import { generateClient } from 'aws-amplify/api';
import { listComplaintsByPlant } from '@/graphql/queries';

const client = generateClient();

/**
 * Fetches all complaints associated with the provided plant IDs.
 */
export async function fetchComplaintsByPlants(plantIDs: string[]): Promise<any[]> {
  if (!plantIDs || plantIDs.length === 0) return [];

  const results = await Promise.all(
    plantIDs.map(async (plantID) => {
      try {
        const resp: any = await client.graphql({
          query: listComplaintsByPlant,
          variables: { plantID },
        });
        return resp.data?.listComplaintsByPlant?.items || [];
      } catch (error) {
        console.warn(`Failed to fetch complaints for plant ${plantID}:`, error);
        return [];
      }
    })
  );
  return results.flat();
}

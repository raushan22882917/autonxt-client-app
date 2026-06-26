import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { generateClient } from 'aws-amplify/api';

import { fetchComplaintsByPlants } from '@/features/service/utils/complaintFetch';
import { Complaint, ComplaintState, User } from '@/graphql/API';
import { listUsersByOrg } from '@/graphql/queries';

const client = generateClient();

export type UserActivityRow = {
  userKey: string;
  displayName: string;
  raised: number;
  solved: number;
  assigned: number;
  open: number;
  avgResolveDays: number;
  score: number;
  rank: number;
};

const isResolved = (state?: ComplaintState | null) =>
  state === ComplaintState.RESOLVED || state === ComplaintState.CLOSED;

const isOpen = (state?: ComplaintState | null) =>
  state === ComplaintState.PENDING ||
  state === ComplaintState.ACCEPTED ||
  state === ComplaintState.RESOLVING;

export function normalizeUserKey(value?: string | null) {
  return (value || '').trim().toLowerCase();
}

export function getTicketResolveDays(complaint: Complaint): number {
  const startRaw = complaint.breakdownDate || complaint.createdAt;
  if (!startRaw) return 0;
  const start = new Date(startRaw);
  if (Number.isNaN(start.getTime())) return 0;

  const endRaw = complaint.updatedAt || complaint.closedAt || complaint.createdAt;
  const end = new Date(endRaw || startRaw);
  if (Number.isNaN(end.getTime())) return 0;

  return Math.max(0, (end.getTime() - start.getTime()) / 86_400_000);
}

/** Higher = better. Solved count first, then faster resolve time, then raised. */
export function activityScore(
  raised: number,
  solved: number,
  open: number,
  assigned: number,
  avgResolveDays: number
) {
  const resolvePct = assigned > 0 ? (solved / assigned) * 100 : solved > 0 ? 100 : 0;
  const speedBonus = solved > 0 ? Math.max(0, 40 - avgResolveDays * 3) : 0;
  return Math.round(solved * 15 + raised * 2 + resolvePct * 0.2 - open * 3 + speedBonus);
}

export function compareActivity(
  a: Pick<UserActivityRow, 'solved' | 'raised' | 'open' | 'assigned' | 'avgResolveDays'>,
  b: Pick<UserActivityRow, 'solved' | 'raised' | 'open' | 'assigned' | 'avgResolveDays'>
) {
  if (b.solved !== a.solved) return b.solved - a.solved;

  const aDays = a.solved > 0 ? a.avgResolveDays : Number.POSITIVE_INFINITY;
  const bDays = b.solved > 0 ? b.avgResolveDays : Number.POSITIVE_INFINITY;
  if (aDays !== bDays) return aDays - bDays;

  if (b.raised !== a.raised) return b.raised - a.raised;
  if (a.open !== b.open) return a.open - b.open;
  return b.assigned - a.assigned;
}

type StatsRow = Omit<UserActivityRow, 'score' | 'rank' | 'avgResolveDays'> & {
  totalResolveDays: number;
};

function buildStatsFromComplaints(complaints: Complaint[], users: User[]) {
  const statsMap = new Map<string, StatsRow>();

  const ensureUser = (key: string, displayName?: string) => {
    if (!key) return;
    if (!statsMap.has(key)) {
      statsMap.set(key, {
        userKey: key,
        displayName: displayName || key.split('@')[0] || key,
        raised: 0,
        solved: 0,
        assigned: 0,
        open: 0,
        totalResolveDays: 0,
      });
    } else if (displayName) {
      const row = statsMap.get(key)!;
      if (!row.displayName || row.displayName === row.userKey.split('@')[0]) {
        row.displayName = displayName;
      }
    }
  };

  users.forEach((user) => {
    const keys = [normalizeUserKey(user.email), normalizeUserKey(user.id)].filter(Boolean);
    keys.forEach((key) => ensureUser(key, user.name || user.email));
  });

  complaints.forEach((complaint) => {
    const raisedKey = normalizeUserKey(complaint.raisedByUserID);
    const assigneeKey = normalizeUserKey(complaint.assigneeUserID);

    if (raisedKey) {
      ensureUser(raisedKey);
      statsMap.get(raisedKey)!.raised += 1;
    }

    if (assigneeKey) {
      ensureUser(assigneeKey);
      const row = statsMap.get(assigneeKey)!;
      row.assigned += 1;
      if (isResolved(complaint.state)) {
        row.solved += 1;
        row.totalResolveDays += getTicketResolveDays(complaint);
      } else if (isOpen(complaint.state)) {
        row.open += 1;
      }
    }
  });

  const leaderboard = Array.from(statsMap.values())
    .map((row) => {
      const avgResolveDays = row.solved > 0 ? row.totalResolveDays / row.solved : 0;
      return {
        userKey: row.userKey,
        displayName: row.displayName,
        raised: row.raised,
        solved: row.solved,
        assigned: row.assigned,
        open: row.open,
        avgResolveDays,
        score: activityScore(row.raised, row.solved, row.open, row.assigned, avgResolveDays),
        rank: 0,
      };
    })
    .filter((row) => row.raised > 0 || row.assigned > 0)
    .sort(compareActivity)
    .map((row, index) => ({ ...row, rank: index + 1 }));

  return leaderboard;
}

export function useUserActivityRank(params: {
  email?: string;
  orgID?: string | null;
  plantIDs?: string[];
}) {
  const { email, orgID, plantIDs = [] } = params;
  const userKey = normalizeUserKey(email);

  const complaintsQuery = useQuery({
    queryKey: ['user-activity', 'complaints', orgID, plantIDs.slice().sort().join(',')],
    queryFn: () => fetchComplaintsByPlants(plantIDs),
    enabled: Boolean(orgID) && plantIDs.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  const usersQuery = useQuery({
    queryKey: ['user-activity', 'users', orgID],
    queryFn: async () => {
      const response: any = await client.graphql({
        query: listUsersByOrg,
        variables: { orgID: orgID || '' },
      });
      return (response.data?.listUsersByOrg as User[]) || [];
    },
    enabled: Boolean(orgID),
    staleTime: 1000 * 60 * 10,
  });

  const activity = useMemo(() => {
    const complaints = complaintsQuery.data ?? [];
    const leaderboard = buildStatsFromComplaints(complaints, usersQuery.data ?? []);

    const currentRow = leaderboard.find((row) => row.userKey === userKey);
    const raised =
      currentRow?.raised ??
      complaints.filter((c: any) => normalizeUserKey(c.raisedByUserID) === userKey).length;
    const assigned =
      currentRow?.assigned ??
      complaints.filter((c: any) => normalizeUserKey(c.assigneeUserID) === userKey).length;
    const solved =
      currentRow?.solved ??
      complaints.filter(
        (c: any) => normalizeUserKey(c.assigneeUserID) === userKey && isResolved(c.state)
      ).length;
    const open =
      currentRow?.open ??
      complaints.filter(
        (c: any) => normalizeUserKey(c.assigneeUserID) === userKey && isOpen(c.state)
      ).length;

    const solvedComplaints = complaints.filter(
      (c: any) => normalizeUserKey(c.assigneeUserID) === userKey && isResolved(c.state)
    );
    const avgResolveDays =
      currentRow?.avgResolveDays ??
      (solvedComplaints.length > 0
        ? solvedComplaints.reduce((sum: number, c: any) => sum + getTicketResolveDays(c), 0) / solvedComplaints.length
        : 0);

    const score =
      currentRow?.score ??
      activityScore(raised, solved, open, assigned, avgResolveDays);

    return {
      raised,
      solved,
      assigned,
      open,
      avgResolveDays,
      score,
      rank: currentRow?.rank ?? null,
      totalPeers: leaderboard.length,
      resolveRate: assigned > 0 ? Math.round((solved / assigned) * 100) : 0,
      leaderboard: leaderboard.slice(0, 5),
    };
  }, [complaintsQuery.data, usersQuery.data, userKey]);

  return {
    ...activity,
    isLoading: complaintsQuery.isLoading || usersQuery.isLoading,
    refetch: async () => {
      await Promise.all([complaintsQuery.refetch(), usersQuery.refetch()]);
    },
  };
}

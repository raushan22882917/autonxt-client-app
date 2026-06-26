// src/features/auth/lib/roleUtils.ts
// Access is plant-scoped via accessiblePlantIDs — no Cognito group checks.

import type { UserProfile } from '@/features/auth/hooks/useUserProfile';

export function getUserOrgId(profile: UserProfile): string | undefined {
  const id = profile.dbRecord?.orgID;
  if (id == null || id === '') {
    return undefined;
  }
  return id;
}

export function getUserPlantIDs(profile: UserProfile): string[] {
  return (
    profile.dbRecord?.accessiblePlantIDs?.filter((id): id is string => !!id) ??
    []
  );
}

/** Any authenticated user with a loaded profile may use the app. */
export function canLogin(profile: UserProfile): boolean {
  return Boolean(profile.email || profile.dbRecord?.id);
}

export function canAccessOrganization(profile: UserProfile, orgId: string): boolean {
  return getUserOrgId(profile) === orgId;
}

export function filterOrganizationsByRole<T extends { orgID: string }>(
  profile: UserProfile,
  organizations: T[],
): T[] {
  const userOrgId = getUserOrgId(profile);
  if (!userOrgId) {
    return [];
  }
  return organizations.filter((org) => org.orgID === userOrgId);
}

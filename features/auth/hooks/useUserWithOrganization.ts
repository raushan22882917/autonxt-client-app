// src/features/auth/hooks/useUserWithOrganization.ts
import { useUserContext } from '@/features/auth/contexts/UserContext';
import { useOrganization } from '@/features/organizations/hooks/useOrganization';

export function useUserWithOrganization() {
  const { authUser, userAttributes, isLoading: userLoading } = useUserContext();
  
  // Get organization info from custom attributes
  const orgId = userAttributes?.['custom:organizationId'] as string | undefined;
  const orgName = userAttributes?.['custom:organizationName'];
  
  // Fetch organization details if orgId is available
  const { 
    data: organization, 
    isLoading: orgLoading, 
    error: orgError 
  } = useOrganization(orgId);

  const isLoading = userLoading || orgLoading;
  const hasOrganization = !!orgId && !!organization;

  return {
    // User data
    authUser,
    userAttributes,
    
    // Organization data
    orgId,
    orgName,
    organization,
    hasOrganization,
    
    // Loading states
    isLoading,
    userLoading,
    orgLoading,
    
    // Error states
    orgError,
  };
} 
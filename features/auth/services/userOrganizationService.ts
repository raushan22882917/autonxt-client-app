// src/features/auth/services/userOrganizationService.ts

import { updateUserAttributes, getCurrentUser } from 'aws-amplify/auth';

export interface UpdateOrganizationData {
  organizationId: string;
  organizationName: string;
}

export async function updateUserOrganization(
  userId: string, 
  orgId: string, 
  orgName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    
    await updateUserAttributes({
      userAttributes: {
        'custom:organizationId': orgId,
        'custom:organizationName': orgName
      }
    });
    
    // Force refresh to get updated attributes
    await getCurrentUser();
    
    return { success: true };
  } catch (error: any) {
    console.error('Error updating user organization:', error);
    return {
      success: false,
      error: error.message || 'Failed to update organization'
    };
  }
}

export async function removeUserOrganization(): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    
    await updateUserAttributes({
      userAttributes: {
        'custom:organizationId': '',
        'custom:organizationName': ''
      }
    });
    
    // Force refresh to get updated attributes
    await getCurrentUser();
    
    return { success: true };
  } catch (error: any) {
    console.error('Error removing user organization:', error);
    return {
      success: false,
      error: error.message || 'Failed to remove organization'
    };
  }
} 
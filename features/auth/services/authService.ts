// src/features/auth/services/authService.ts

import { CognitoUserAttributes, ExtendedAuthUser } from '@/features/auth/types/authTypes';
import {
  fetchUserAttributes,
  fetchAuthSession,
  signOut,
} from 'aws-amplify/auth';

// Utility function to transform email_verified to boolean
const transformAttributes = (
  attributes: Record<string, any>
): CognitoUserAttributes => {
  return {
    ...attributes,
    email_verified: attributes.email_verified === 'true',
  } as CognitoUserAttributes;
};

// Fetch the current authenticated user and their attributes
export const fetchUser = async (): Promise<{
  userAttributes: CognitoUserAttributes;
  authUser: ExtendedAuthUser;
}> => {
  try {
    const session = await fetchAuthSession();
    const user = session.tokens?.idToken?.payload as Record<string, any>;
    const attributes = await fetchUserAttributes();
    const userGroups = (user?.['cognito:groups'] || []) as string[];

    // Transform attributes and return the user data
    return {
      userAttributes: transformAttributes(attributes),
      authUser: {
        username: (user?.['cognito:username'] as string) || '',
        attributes: transformAttributes(attributes),
        groups: userGroups,
      } as ExtendedAuthUser,
    };
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw error;
  }
};

// Sign out the current user
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut();
  } catch (error) {
    console.error('Failed to sign out:', error);
    throw error;
  }
};

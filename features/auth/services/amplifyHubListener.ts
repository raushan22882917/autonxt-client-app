// src/features/auth/services/amplifyHubListener.ts

import { Hub } from '@aws-amplify/core';

export interface AuthPayload {
  event: string;
  message?: string;
}

export const setupAuthListeners = (): void => {
  Hub.listen('auth', ({ payload }: { payload: AuthPayload }) => {
    switch (payload.event) {
      case 'signedIn':
        console.log('User signed in');
        break;
      case 'signedOut':
        console.log('User signed out');
        break;
      case 'tokenRefresh':
        console.log('Token refreshed');
        break;
      case 'tokenRefresh_failure':
        console.error('Token refresh failed:', payload.message);
        break;
      case 'signInWithRedirect_failure':
        console.error('Sign in failed:', payload.message);
        break;
      default:
        console.warn(`Unhandled auth event: ${payload.event}`);
        break;
    }
  });
};

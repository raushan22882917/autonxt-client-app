// src/features/auth/utils/authErrors.ts
// Utility to detect and handle authentication errors

export const AUTH_ERROR_MESSAGES = [
  'NoValidAuthTokens',
  'No federated jwt',
  'Token has expired',
  'Not Authorized',
  'User not authenticated',
  'AuthUserPoolException',
  'UserSessionExpired',
  'UserUnAuthenticatedException',
  'User needs to be authenticated',
];

export function isAuthError(error: unknown): boolean {
  if (!error) return false;
  
  const errorString = String(error);
  return AUTH_ERROR_MESSAGES.some(msg => 
    errorString.includes(msg)
  );
}

export function handleAuthError(error: unknown): void {
  if (isAuthError(error)) {
    console.warn('Authentication error detected, user needs to re-authenticate');
    // Emit event for auth error - can be caught by auth provider
    // Only use window on web platform
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('auth:error', { 
        detail: { error, message: 'Session expired. Please sign in again.' }
      }));
    }
  }
}

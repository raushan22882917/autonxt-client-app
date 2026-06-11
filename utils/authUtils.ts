import { fetchAuthSession } from 'aws-amplify/auth';

/**
 * Checks if the current Amplify auth session has valid tokens.
 */
export async function isAuthSessionValid(): Promise<boolean> {
  try {
    const session = await fetchAuthSession({ forceRefresh: false });
    return !!session.tokens?.accessToken;
  } catch {
    return false;
  }
}

/**
 * Forces a refresh of the current Amplify auth session.
 */
export async function refreshAuthSession(): Promise<boolean> {
  try {
    const session = await fetchAuthSession({ forceRefresh: true });
    return !!session.tokens?.accessToken;
  } catch {
    return false;
  }
}

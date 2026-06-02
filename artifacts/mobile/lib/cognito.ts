import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string>;

const USER_POOL_ID =
  extra.cognitoUserPoolId || process.env.EXPO_PUBLIC_COGNITO_USER_POOL_ID || '';
const CLIENT_ID =
  extra.cognitoClientId || process.env.EXPO_PUBLIC_COGNITO_CLIENT_ID || '';
const REGION =
  extra.awsRegion || process.env.EXPO_PUBLIC_AWS_REGION || 'us-east-1';

const AUTH_URL = `https://cognito-idp.${REGION}.amazonaws.com/`;

async function secureGet(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

async function secureSet(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function secureDelete(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export interface CognitoTokens {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface CognitoUser {
  sub: string;
  email: string;
  name: string;
  groups: string[];
  orgID?: string;
  role?: string;
}

export async function cognitoSignIn(username: string, password: string): Promise<CognitoTokens> {
  if (!CLIENT_ID || !USER_POOL_ID) {
    throw new Error(
      'App is not configured: missing Cognito credentials. Please contact your administrator.'
    );
  }

  const body = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: CLIENT_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };

  const response = await fetch(AUTH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const code = data.__type || data.code || 'AuthError';
    if (code.includes('NotAuthorizedException')) throw new Error('Incorrect username or password');
    if (code.includes('UserNotFoundException')) throw new Error('User not found');
    if (code.includes('UserNotConfirmedException')) throw new Error('User account not confirmed');
    throw new Error(data.message || 'Authentication failed');
  }

  const auth = data.AuthenticationResult;
  const tokens: CognitoTokens = {
    accessToken: auth.AccessToken,
    idToken: auth.IdToken,
    refreshToken: auth.RefreshToken,
    expiresAt: Date.now() + auth.ExpiresIn * 1000,
  };

  await secureSet('cognito_access_token', tokens.accessToken);
  await secureSet('cognito_id_token', tokens.idToken);
  await secureSet('cognito_refresh_token', tokens.refreshToken);
  await secureSet('cognito_expires_at', String(tokens.expiresAt));

  return tokens;
}

export async function cognitoRefreshTokens(): Promise<CognitoTokens | null> {
  const refreshToken = await secureGet('cognito_refresh_token');
  if (!refreshToken) return null;

  const body = {
    AuthFlow: 'REFRESH_TOKEN_AUTH',
    ClientId: CLIENT_ID,
    AuthParameters: {
      REFRESH_TOKEN: refreshToken,
    },
  };

  const response = await fetch(AUTH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    await cognitoSignOut();
    return null;
  }

  const data = await response.json();
  const auth = data.AuthenticationResult;
  const tokens: CognitoTokens = {
    accessToken: auth.AccessToken,
    idToken: auth.IdToken,
    refreshToken: refreshToken,
    expiresAt: Date.now() + auth.ExpiresIn * 1000,
  };

  await secureSet('cognito_access_token', tokens.accessToken);
  await secureSet('cognito_id_token', tokens.idToken);
  await secureSet('cognito_expires_at', String(tokens.expiresAt));

  return tokens;
}

export async function cognitoGetStoredTokens(): Promise<CognitoTokens | null> {
  const accessToken = await secureGet('cognito_access_token');
  const idToken = await secureGet('cognito_id_token');
  const refreshToken = await secureGet('cognito_refresh_token');
  const expiresAtStr = await secureGet('cognito_expires_at');

  if (!accessToken || !idToken || !refreshToken || !expiresAtStr) return null;

  return {
    accessToken,
    idToken,
    refreshToken,
    expiresAt: Number(expiresAtStr),
  };
}

export async function cognitoSignOut(): Promise<void> {
  await secureDelete('cognito_access_token');
  await secureDelete('cognito_id_token');
  await secureDelete('cognito_refresh_token');
  await secureDelete('cognito_expires_at');
}

export function parseJwt(token: string): Record<string, unknown> {
  try {
    const base64 = token.split('.')[1];
    const padded = base64.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(padded);
    return JSON.parse(decoded);
  } catch {
    return {};
  }
}

export function extractUserFromIdToken(idToken: string): CognitoUser {
  const payload = parseJwt(idToken);
  const groups = (payload['cognito:groups'] as string[]) || [];
  return {
    sub: (payload['sub'] as string) || '',
    email: (payload['email'] as string) || '',
    name: (payload['name'] as string) || (payload['email'] as string) || '',
    groups,
    orgID: (payload['custom:orgID'] as string) || undefined,
    role: (payload['custom:role'] as string) || undefined,
  };
}

export function isAdminUser(user: CognitoUser): boolean {
  return (
    user.groups.some(g =>
      g.toLowerCase().includes('admin') || g.toLowerCase().includes('autonxt')
    ) ||
    (user.role || '').toLowerCase().includes('admin')
  );
}

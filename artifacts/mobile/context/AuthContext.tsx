import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  CognitoUser,
  CognitoTokens,
  cognitoGetStoredTokens,
  cognitoRefreshTokens,
  cognitoSignIn,
  cognitoSignOut,
  extractUserFromIdToken,
  isAdminUser,
} from '@/lib/cognito';
import { setAppsyncTokenGetter } from '@/lib/appsync';

interface AuthState {
  user: CognitoUser | null;
  tokens: CognitoTokens | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  tokens: null,
  isLoading: true,
  isAdmin: false,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CognitoUser | null>(null);
  const [tokens, setTokens] = useState<CognitoTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const applyTokens = useCallback((t: CognitoTokens) => {
    setTokens(t);
    const u = extractUserFromIdToken(t.idToken);
    setUser(u);
    setAppsyncTokenGetter(() => t.accessToken);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const stored = await cognitoGetStoredTokens();
        if (!stored) { setIsLoading(false); return; }

        if (Date.now() < stored.expiresAt - 60000) {
          applyTokens(stored);
        } else {
          const refreshed = await cognitoRefreshTokens();
          if (refreshed) applyTokens(refreshed);
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [applyTokens]);

  const signIn = useCallback(async (username: string, password: string) => {
    const t = await cognitoSignIn(username, password);
    applyTokens(t);
  }, [applyTokens]);

  const signOut = useCallback(async () => {
    await cognitoSignOut();
    setUser(null);
    setTokens(null);
    setAppsyncTokenGetter(() => null);
  }, []);

  const isAdmin = user ? isAdminUser(user) : false;

  return (
    <AuthContext.Provider value={{ user, tokens, isLoading, isAdmin, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

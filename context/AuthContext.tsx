import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { fetchAuthSession, getCurrentUser, signIn as amplifySignIn, signOut as amplifySignOut } from 'aws-amplify/auth';
import { configureAmplify } from '@/lib/amplify';
import {
  CognitoTokens,
  CognitoUser,
  extractUserFromIdToken,
  isAdminUser,
} from '@/lib/cognito';

configureAmplify();

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

function sessionToState(session: Awaited<ReturnType<typeof fetchAuthSession>>): {
  user: CognitoUser | null;
  tokens: CognitoTokens | null;
} {
  const idTokenObj = session.tokens?.idToken;
  const accessTokenObj = session.tokens?.accessToken;
  if (!idTokenObj || !accessTokenObj) {
    return { user: null, tokens: null };
  }

  const idToken = idTokenObj.toString();
  const accessToken = accessTokenObj.toString();
  const expiresAt = (idTokenObj.payload.exp ?? 0) * 1000;

  return {
    user: extractUserFromIdToken(idToken),
    tokens: {
      accessToken,
      idToken,
      refreshToken: '',
      expiresAt,
    },
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CognitoUser | null>(null);
  const [tokens, setTokens] = useState<CognitoTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const applySession = useCallback((session: Awaited<ReturnType<typeof fetchAuthSession>>) => {
    const { user: u, tokens: t } = sessionToState(session);
    setUser(u);
    setTokens(t);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        await getCurrentUser();
        const session = await fetchAuthSession();
        applySession(session);
      } catch {
        setUser(null);
        setTokens(null);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [applySession]);

  const signIn = useCallback(
    async (username: string, password: string) => {
      const result = await amplifySignIn({ username, password });
      if (result.isSignedIn) {
        const session = await fetchAuthSession();
        applySession(session);
        return;
      }
      if (result.nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
        throw new Error('Account not confirmed. Please verify your email.');
      }
      if (result.nextStep?.signInStep === 'RESET_PASSWORD') {
        throw new Error('Password reset required. Please reset your password.');
      }
      throw new Error('Sign in incomplete. Additional steps may be required.');
    },
    [applySession]
  );

  const signOut = useCallback(async () => {
    await amplifySignOut();
    setUser(null);
    setTokens(null);
  }, []);

  const isAdmin = user ? isAdminUser(user) : false;

  return (
    <AuthContext.Provider value={{ user, tokens, isLoading, isAdmin, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

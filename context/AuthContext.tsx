import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  fetchAuthSession,
  getCurrentUser,
  signIn as amplifySignIn,
  signOut as amplifySignOut,
} from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import { configureAmplify } from '@/lib/amplify';
import {
  CognitoTokens,
  CognitoUser,
  extractUserFromIdToken,
  isAdminUser,
} from '@/lib/cognito';

configureAmplify();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Amplify v6 throws plain objects instead of Error instances in several cases
 * (e.g. UserAlreadyAuthenticatedException, NotAuthorizedException).
 * This normalises any thrown value into a proper Error with a human-readable message.
 */
function normaliseAmplifyError(err: unknown): Error {
  if (err instanceof Error) {
    // Real Error — use its message unless it's the useless generic string.
    if (err.message && err.message !== 'An unknown error has occurred.') {
      return err;
    }
    return new Error('Login failed. Please check your credentials and try again.');
  }

  if (typeof err === 'object' && err !== null) {
    const e = err as Record<string, unknown>;
    const name = typeof e.name === 'string' ? e.name : '';
    const message = typeof e.message === 'string' ? e.message : '';
    const code = typeof e.code === 'string' ? e.code : '';

    // Map known Amplify error names/codes to friendly messages.
    if (name.includes('NotAuthorized') || code.includes('NotAuthorized')) {
      return new Error('Incorrect email or password. Please try again.');
    }
    if (name.includes('UserNotFound') || code.includes('UserNotFound')) {
      return new Error('No account found with that email address.');
    }
    if (name.includes('UserNotConfirmed') || code.includes('UserNotConfirmed')) {
      return new Error('Account not confirmed. Please verify your email.');
    }
    if (name.includes('PasswordResetRequired') || code.includes('PasswordResetRequired')) {
      return new Error('Password reset required. Please reset your password.');
    }
    if (name.includes('TooManyRequests') || code.includes('TooManyRequests')) {
      return new Error('Too many attempts. Please wait a moment and try again.');
    }

    // Use message if it's meaningful, otherwise fall back.
    if (message && message !== 'An unknown error has occurred.') {
      return new Error(message);
    }
    if (code) return new Error(code);
  }

  return new Error('Login failed. Please check your credentials and try again.');
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

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
      // Guard against UserAlreadyAuthenticatedException: Amplify throws {} when
      // signIn is called while a session is still cached in memory.
      // Strategy: check for active user → sign out → if signout fails, force
      // re-configure Amplify to wipe its in-memory token cache, then proceed.
      let hasActiveSession = false;
      try {
        await getCurrentUser();
        hasActiveSession = true;
      } catch {
        // No cached session, nothing to clear.
      }

      if (hasActiveSession) {
        try {
          await amplifySignOut({ global: false });
        } catch {
          // signOut failed (e.g. keychain unavailable in Expo Go / Maestro).
          // Re-configure to forcibly clear Amplify's in-memory auth state.
          try {
            const cfg = Amplify.getConfig();
            Amplify.configure(cfg);
          } catch { /* best effort */ }
        }
      }

      let result: Awaited<ReturnType<typeof amplifySignIn>>;
      try {
        result = await amplifySignIn({ username, password });
      } catch (err: unknown) {
        throw normaliseAmplifyError(err);
      }

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
    try {
      await amplifySignOut();
    } finally {
      setUser(null);
      setTokens(null);
    }
  }, []);

  const isAdmin = user ? isAdminUser(user) : false;

  return (
    <AuthContext.Provider value={{ user, tokens, isLoading, isAdmin, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

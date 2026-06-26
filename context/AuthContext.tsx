import React, { createContext, useContext, useCallback } from 'react';
import { UserProvider, useUserContext } from '@/features/auth/contexts/UserContext';
import { useUserProfile } from '@/features/auth/hooks/useUserProfile';
import { CognitoUser } from '@/lib/cognito';
import { signIn as amplifySignIn } from 'aws-amplify/auth';

interface AuthState {
  user: CognitoUser | null;
  tokens: any | null;
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

// Helper to normalize the Amplify Auth error names into user friendly errors
function normaliseAmplifyError(err: unknown): Error {
  console.error('Underlying Amplify auth error:', err);

  if (err && typeof err === 'object') {
    const e = err as Record<string, unknown>;
    const name = typeof e.name === 'string' ? e.name : '';
    const message = typeof e.message === 'string' ? e.message : '';
    const code = typeof e.code === 'string' ? e.code : '';

    // Log extracted fields for easier diagnostics
    console.error(`Amplify error details - Name: "${name}", Message: "${message}", Code: "${code}"`);

    const lowerName = name.toLowerCase();
    const lowerCode = code.toLowerCase();
    const lowerMessage = message.toLowerCase();

    if (
      lowerName.includes('notauthorized') ||
      lowerCode.includes('notauthorized') ||
      lowerMessage.includes('incorrect')
    ) {
      return new Error('Incorrect email or password. Please try again.');
    }
    if (
      lowerName.includes('usernotfound') ||
      lowerCode.includes('usernotfound') ||
      lowerMessage.includes('user not found') ||
      lowerMessage.includes('does not exist')
    ) {
      return new Error('No account found with that email address.');
    }
    if (lowerName.includes('usernotconfirmed') || lowerCode.includes('usernotconfirmed')) {
      return new Error('Account not confirmed. Please verify your email.');
    }
    if (lowerName.includes('passwordresetrequired') || lowerCode.includes('passwordresetrequired')) {
      return new Error('Password reset required. Please reset your password.');
    }
    if (lowerName.includes('toomanyrequests') || lowerCode.includes('toomanyrequests')) {
      return new Error('Too many attempts. Please wait a moment and try again.');
    }

    if (message && message !== 'An unknown error has occurred.') {
      return new Error(message);
    }
    if (code) return new Error(code);
  }

  if (err instanceof Error) {
    if (err.message && err.message !== 'An unknown error has occurred.') {
      return err;
    }
  }

  return new Error('Login failed. Please check your credentials and try again.');
}

function AuthBridge({ children }: { children: React.ReactNode }) {
  const { authUser, isLoading: authLoading, signOut: contextSignOut, refreshUserData } = useUserContext();
  const { profile, isLoading: profileLoading } = useUserProfile();

  const isLoading = authLoading || profileLoading;

  const user: CognitoUser | null = authUser ? {
    sub: authUser.attributes.sub || '',
    email: profile.email || authUser.attributes.email || '',
    name: authUser.attributes.name || profile.email || '',
    groups: profile.groups || authUser.groups || [],
    orgID: profile.dbRecord?.orgID || (authUser.attributes['custom:orgID'] as string) || undefined,
    role: profile.dbRecord?.role || (authUser.attributes['custom:role'] as string) || undefined,
  } : null;

  const isAdmin = user ? (
    user.groups.some(g =>
      g.toLowerCase().includes('admin') || g.toLowerCase().includes('autonxt')
    ) ||
    (user.role || '').toLowerCase().includes('admin')
  ) : false;

  const signIn = useCallback(
    async (username: string, password: string) => {
      try {
        await amplifySignIn({ username, password });
        await refreshUserData();
      } catch (err: unknown) {
        throw normaliseAmplifyError(err);
      }
    },
    [refreshUserData]
  );

  const signOut = useCallback(async () => {
    await contextSignOut();
  }, [contextSignOut]);

  return (
    <AuthContext.Provider value={{ user, tokens: null, isLoading, isAdmin, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <AuthBridge>{children}</AuthBridge>
    </UserProvider>
  );
}

export const useAuth = () => useContext(AuthContext);

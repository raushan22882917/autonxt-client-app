// src/features/auth/providers/UserContext.tsx

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type PropsWithChildren,
} from 'react';
import {
    fetchAuthSession,
    fetchUserAttributes,
    signOut as amplifySignOut,
} from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import { useQueryClient } from '@tanstack/react-query';

import { resetAndNavigate } from '@/shared/lib/navigation/resetAndNavigate';
import { clearNotificationStorage } from '@/features/notifications/notificationStorage';

import type {
    CognitoAttributePrimitive,
    CognitoUserAttributes,
    ExtendedAuthUser,
} from '@/features/auth/types/authTypes';
import { isAuthError } from '@/features/auth/utils/authErrors';

export interface UserContextValue {
    authUser: ExtendedAuthUser | null;
    userAttributes: CognitoUserAttributes | null;
    setUserAttributes: (attributes: CognitoUserAttributes | null) => void;
    isAuthenticated: boolean;
    isLoading: boolean;
    signOut: () => Promise<void>;
    refreshUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

type IdTokenPayload = {
    'cognito:username'?: string;
    'cognito:groups'?: string[] | string;
};

type RawUserAttributes = Record<string, string | undefined>;

function normalizeAttributeValue(value: string): CognitoAttributePrimitive {
    if (value === 'true') {
        return true;
    }

    if (value === 'false') {
        return false;
    }

    return value;
}

function normalizeUserAttributes(
    attributes: RawUserAttributes,
): CognitoUserAttributes {
    const normalized: CognitoUserAttributes = {};

    for (const [key, value] of Object.entries(attributes)) {
        if (typeof value === 'string') {
            normalized[key] = normalizeAttributeValue(value);
        }
    }

    return normalized;
}

function normalizeGroups(groups: IdTokenPayload['cognito:groups']): string[] {
    if (Array.isArray(groups)) {
        return groups;
    }

    if (typeof groups === 'string' && groups.trim().length > 0) {
        return [groups];
    }

    return [];
}

function isAmplifyConfigured(): boolean {
    try {
        const config = Amplify.getConfig();
        if (!config) {
            return false;
        }
        
        // Check if Auth and Cognito are properly configured
        const authConfig = config.Auth?.Cognito;
        if (!authConfig || !authConfig.userPoolId || !authConfig.userPoolClientId) {
            return false;
        }
        
        return true;
    } catch {
        return false;
    }
}

async function fetchCurrentUserData(): Promise<{
    authUser: ExtendedAuthUser;
    userAttributes: CognitoUserAttributes;
}> {
    if (!isAmplifyConfigured()) {
        throw new Error('Amplify has not been configured. Please call Amplify.configure() before using this service.');
    }

    const [session, attributes] = await Promise.all([
        fetchAuthSession(),
        fetchUserAttributes(),
    ]);

    const idTokenPayload =
        (session.tokens?.idToken?.payload as IdTokenPayload | undefined) ?? {};

    const normalizedAttributes = normalizeUserAttributes(
        attributes as RawUserAttributes,
    );
    const groups = normalizeGroups(idTokenPayload['cognito:groups']);

    return {
        authUser: {
            username: idTokenPayload['cognito:username'] ?? '',
            attributes: normalizedAttributes,
            groups,
        },
        userAttributes: normalizedAttributes,
    };
}

export function UserProvider({ children }: PropsWithChildren) {
    const [userAttributes, setUserAttributes] =
        useState<CognitoUserAttributes | null>(null);
    const [authUser, setAuthUser] = useState<ExtendedAuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const queryClient = useQueryClient();

    const handleAuthError = useCallback(async () => {
        console.warn('Auth error detected, signing out user');
        try {
            await amplifySignOut();
        } catch (e) {
            // Ignore sign out errors
        }
        setUserAttributes(null);
        setAuthUser(null);
        queryClient.clear();
        void clearNotificationStorage();
        resetAndNavigate('/login');
    }, [queryClient]);

    // Listen for auth error events from hooks (web only)
    useEffect(() => {
        // Only add listener on web platform
        if (typeof window === 'undefined' || !window.addEventListener) {
            return;
        }
        
        const handleAuthErrorEvent = () => {
            void handleAuthError();
        };
        
        window.addEventListener('auth:error', handleAuthErrorEvent);
        return () => {
            window.removeEventListener('auth:error', handleAuthErrorEvent);
        };
    }, [handleAuthError]);

    const refreshUserData = useCallback(async () => {
        const wasAuthenticated = Boolean(authUser);
        
        try {
            setIsLoading(true);

            const currentUserData = await fetchCurrentUserData();

            setUserAttributes(currentUserData.userAttributes);
            setAuthUser(currentUserData.authUser);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('Amplify has not been configured')) {
                    console.log('Amplify not configured yet, skipping user data refresh');
                } else if (error.message.includes('Auth UserPool not configured') || error.message.includes('AuthUserPoolException')) {
                    console.log('Auth UserPool not configured yet, skipping user data refresh');
                } else if (isAuthError(error) && wasAuthenticated) {
                    // Only redirect if user was previously authenticated
                    console.warn('Auth token error detected during refresh');
                    void handleAuthError();
                } else {
                    console.error('Failed to refresh user data:', error);
                }
            } else {
                console.error('Failed to refresh user data:', error);
            }
            setUserAttributes(null);
            setAuthUser(null);
        } finally {
            setIsLoading(false);
        }
    }, [authUser, handleAuthError]);

    useEffect(() => {
        let isMounted = true;
        let retryCount = 0;
        const maxRetries = 10;
        const retryDelay = 500; // 500ms

        async function initializeUser() {
            try {
                setIsLoading(true);

                // Wait for Amplify to be configured
                while (!isAmplifyConfigured() && retryCount < maxRetries) {
                    retryCount++;
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                }

                if (!isAmplifyConfigured()) {
                    console.warn('Amplify not configured after maximum retries. User authentication will be disabled.');
                    if (isMounted) {
                        setUserAttributes(null);
                        setAuthUser(null);
                        setIsLoading(false);
                    }
                    return;
                }

                const currentUserData = await fetchCurrentUserData();

                if (!isMounted) {
                    return;
                }

                setUserAttributes(currentUserData.userAttributes);
                setAuthUser(currentUserData.authUser);
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                // Handle specific Amplify configuration errors
                if (error instanceof Error) {
                    if (error.message.includes('Amplify has not been configured')) {
                        console.log('Waiting for Amplify configuration...');
                    } else if (error.message.includes('Auth UserPool not configured') || error.message.includes('AuthUserPoolException')) {
                        console.log('Waiting for Auth UserPool configuration...');
                    } else if (isAuthError(error)) {
                        // Silent fail on auth errors during init - user just isn't signed in
                        console.log('User not authenticated during initialization');
                    } else {
                        console.error('Failed to load user data:', error);
                    }
                } else {
                    console.error('Failed to load user data:', error);
                }
                
                setUserAttributes(null);
                setAuthUser(null);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        void initializeUser();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleSignOut = useCallback(async () => {
        try {
            await amplifySignOut();
        } catch (error) {
            console.error('Error during sign out:', error);
            throw error;
        } finally {
            setUserAttributes(null);
            setAuthUser(null);
            queryClient.clear();
            void clearNotificationStorage();
            resetAndNavigate('/login');
        }
    }, [queryClient]);

    const value = useMemo<UserContextValue>(
        () => ({
            authUser,
            userAttributes,
            setUserAttributes,
            isAuthenticated: Boolean(authUser),
            isLoading,
            signOut: handleSignOut,
            refreshUserData,
        }),
        [authUser, handleSignOut, isLoading, refreshUserData, userAttributes],
    );

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext(): UserContextValue {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }

    return context;
}
import { useEffect } from 'react';
import { useSegments } from 'expo-router';

import { useUserContext } from '@/features/auth/contexts/UserContext';
import { resetAndNavigate } from '@/shared/lib/navigation/resetAndNavigate';

const PUBLIC_ROUTES = new Set(['index', 'login', 'test-login', '']);

function isPublicRoute(segments: string[]): boolean {
  const root = segments[0] ?? '';
  return PUBLIC_ROUTES.has(root);
}

/**
 * Redirects signed-out users away from protected routes and clears stale stack entries.
 */
export function AuthNavigationSync() {
  const { isAuthenticated, isLoading } = useUserContext();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const pathSegments = segments as string[];
    if (!isAuthenticated && !isPublicRoute(pathSegments)) {
      resetAndNavigate('/login');
    }
  }, [isAuthenticated, isLoading, segments]);

  return null;
}

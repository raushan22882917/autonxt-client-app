import { router } from 'expo-router';

/**
 * Resets the navigation stack and navigates to the specified route.
 */
export function resetAndNavigate(route: string): void {
  // Expo Router's router.replace replaces the current stack screen
  router.replace(route as any);
}

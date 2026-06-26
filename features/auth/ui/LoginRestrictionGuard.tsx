import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useUserProfile } from '@/features/auth/hooks/useUserProfile';
import { canLogin } from '@/features/auth/lib/roleUtils';
import colors from '@/constants/colors';

export interface LoginRestrictionGuardProps {
  children: React.ReactNode;
  fallbackComponent?: React.ReactNode;
}

export function LoginRestrictionGuard({
  children,
  fallbackComponent,
}: LoginRestrictionGuardProps) {
  const { profile, isLoading } = useUserProfile();

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.light.background }]}>
        <Text style={[styles.loadingText, { color: colors.light.text }]}>
          Loading...
        </Text>
      </View>
    );
  }

  if (!canLogin(profile)) {
    return (
      <>
        {fallbackComponent ?? (
          <View style={[styles.container, { backgroundColor: colors.light.background }]}>
            <View style={[styles.errorCard, { backgroundColor: colors.light.card }]}>
              <Text style={[styles.errorTitle, { color: colors.light.destructive }]}>Access Denied</Text>
              <Text style={[styles.errorMessage, { color: colors.light.text }]}>
                Unable to load your account. Please sign in again or contact your administrator.
              </Text>
            </View>
          </View>
        )}
      </>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 16,
  },
  errorCard: {
    padding: 24,
    borderRadius: 12,
    maxWidth: 400,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 15,
    lineHeight: 22,
  },
});

export default LoginRestrictionGuard;

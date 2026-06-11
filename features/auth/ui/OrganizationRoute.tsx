import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useUserContext } from '../contexts/UserContext';
import { useUserProfile } from '../hooks/useUserProfile';
import colors from '../../../constants/colors';

export interface OrganizationRouteProps {
  children: React.ReactNode;
  fallbackComponent?: React.ReactNode;
  requireOrganization?: boolean;
}

const AccessDenied = ({ message, detail, fallback }: {
  message: string;
  detail?: string;
  fallback?: React.ReactNode;
}) => {
  if (fallback) return <>{fallback}</>;
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.light.background,
      }}
    >
      <Text
        style={{
          color: colors.light.text,
          fontSize: 18,
          textAlign: 'center',
          paddingHorizontal: 20,
        }}
      >
        {message}
      </Text>
      {detail && (
        <Text
          style={{
            color: colors.light.mutedForeground,
            fontSize: 14,
            marginTop: 8,
            textAlign: 'center',
            paddingHorizontal: 20,
          }}
        >
          {detail}
        </Text>
      )}
    </View>
  );
};

export function OrganizationRoute({
  children,
  fallbackComponent,
  requireOrganization = true,
}: OrganizationRouteProps) {
  const { authUser, isLoading } = useUserContext();
  const { profile, isLoading: profileLoading } = useUserProfile();

  if (isLoading || profileLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.light.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.light.primary} />
        <Text style={{ color: colors.light.text, marginTop: 16 }}>Loading...</Text>
      </View>
    );
  }

  if (!authUser) {
    return (
      <AccessDenied
        message="Please sign in to continue"
        fallback={fallbackComponent}
      />
    );
  }

  if (requireOrganization && !profile.dbRecord?.orgID) {
    return (
      <AccessDenied
        message="You need to be assigned to an organization to access this feature."
        detail="Please contact your administrator to get assigned to an organization."
        fallback={fallbackComponent}
      />
    );
  }

  return <>{children}</>;
}

export default OrganizationRoute;

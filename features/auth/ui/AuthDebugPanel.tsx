import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { fetchAuthSession } from 'aws-amplify/auth';
import { signOut } from 'aws-amplify/auth';
import { isAuthSessionValid, refreshAuthSession } from '@/utils/authUtils';
import colors from '@/constants/colors';

export interface AuthDebugPanelProps {
  visible?: boolean;
}

export const AuthDebugPanel: React.FC<AuthDebugPanelProps> = ({ visible = false }) => {
  const [authStatus, setAuthStatus] = useState<{
    isValid: boolean;
    hasAccessToken: boolean;
    hasIdToken: boolean;
    tokenExpiry?: string;
    error?: string;
  }>({
    isValid: false,
    hasAccessToken: false,
    hasIdToken: false,
  });

  const checkAuthStatus = async () => {
    try {
      const session = await fetchAuthSession({ forceRefresh: false });
      const isValid = await isAuthSessionValid();

      const accessToken = session.tokens?.accessToken;
      const idToken = session.tokens?.idToken;

      setAuthStatus({
        isValid,
        hasAccessToken: !!accessToken,
        hasIdToken: !!idToken,
        tokenExpiry: accessToken?.payload?.exp
          ? new Date(Number(accessToken.payload.exp) * 1000).toLocaleString()
          : undefined,
        error: undefined,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setAuthStatus({
        isValid: false,
        hasAccessToken: false,
        hasIdToken: false,
        error: message,
      });
    }
  };

  const handleRefreshToken = async () => {
    try {
      const success = await refreshAuthSession();
      if (success) {
        await checkAuthStatus();
      }
    } catch (error) {
      console.error('Token refresh error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setAuthStatus({
        isValid: false,
        hasAccessToken: false,
        hasIdToken: false,
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  useEffect(() => {
    if (visible) {
      checkAuthStatus();
    }
  }, [visible]);

  if (!visible) return null;

  const rows: { label: string; value: string; color: string }[] = [
    {
      label: 'Session Valid:',
      value: authStatus.isValid ? 'Yes' : 'No',
      color: authStatus.isValid ? colors.light.success : colors.light.destructive,
    },
    {
      label: 'Access Token:',
      value: authStatus.hasAccessToken ? 'Present' : 'Missing',
      color: authStatus.hasAccessToken ? colors.light.success : colors.light.destructive,
    },
    {
      label: 'ID Token:',
      value: authStatus.hasIdToken ? 'Present' : 'Missing',
      color: authStatus.hasIdToken ? colors.light.success : colors.light.destructive,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.light.card, borderColor: colors.light.border }]}>
      <Text style={[styles.title, { color: colors.light.text }]}>Auth Debug Panel</Text>

      {rows.map(row => (
        <View key={row.label} style={styles.statusContainer}>
          <Text style={[styles.label, { color: colors.light.mutedForeground }]}>{row.label}</Text>
          <Text style={[styles.value, { color: row.color }]}>{row.value}</Text>
        </View>
      ))}

      {authStatus.tokenExpiry && (
        <View style={styles.statusContainer}>
          <Text style={[styles.label, { color: colors.light.mutedForeground }]}>Token Expires:</Text>
          <Text style={[styles.value, { color: colors.light.text }]}>{authStatus.tokenExpiry}</Text>
        </View>
      )}

      {authStatus.error && (
        <View style={styles.statusContainer}>
          <Text style={[styles.label, { color: colors.light.mutedForeground }]}>Error:</Text>
          <Text style={[styles.value, { color: colors.light.destructive }]}>{authStatus.error}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        {[
          { label: 'Check Status', color: colors.light.primary, onPress: checkAuthStatus },
          { label: 'Refresh Token', color: colors.light.warning, onPress: handleRefreshToken },
          { label: 'Sign Out', color: colors.light.destructive, onPress: handleSignOut },
        ].map(btn => (
          <TouchableOpacity
            key={btn.label}
            style={[styles.button, { backgroundColor: btn.color }]}
            onPress={btn.onPress}
            accessibilityRole="button"
            accessibilityLabel={btn.label}
          >
            <Text style={[styles.buttonText, { color: colors.light.card }]}>{btn.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  button: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default AuthDebugPanel;

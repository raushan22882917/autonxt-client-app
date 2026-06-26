import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

/**
 * Test-only route used exclusively by Maestro automation.
 * Maestro opens the app via deep link:
 *   mobile://test-login?email=x@y.com&password=secret
 * This screen reads those params and calls signIn directly —
 * completely bypassing the keyboard and login form.
 *
 * This route is only reachable via deep link and has no UI entry point,
 * so it is safe to ship in production builds.
 */
export default function TestLoginScreen() {
  const { email, password } = useLocalSearchParams<{ email: string; password: string }>();
  const { signIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!email || !password) return;

    signIn(email.trim(), password)
      .then(() => router.replace('/(main)/dashboard'))
      .catch(() => router.replace('/login'));
  }, [email, password]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

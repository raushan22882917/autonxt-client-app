import type { PropsWithChildren } from 'react';
import { Redirect } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { useUserContext } from '../contexts/UserContext';
import Loader from '../../../components/Loader';
import colors from '../../../constants/colors';

export function RequireAuth({ children }: PropsWithChildren) {
  const { isAuthenticated, isLoading } = useUserContext();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <Loader size={40} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.light.background,
  },
});

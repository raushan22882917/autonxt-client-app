import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { CustomSignIn } from '@/features/auth/ui/CustomSignIn';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Reactive navigation: as soon as auth state settles with a valid user,
  // navigate to the dashboard. This avoids the race condition where
  // router.replace fires before setAuthUser has flushed into the React tree,
  // causing (main)/_layout.tsx to immediately bounce back to login.
  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/(main)/dashboard');
    }
  }, [user, isLoading, router]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  // onSuccess is now a no-op — the useEffect above handles navigation
  // once the auth state has actually committed to the React tree.
  const handleSuccess = () => {};

  return (
    <CustomSignIn
      onBack={handleBack}
      onSuccess={handleSuccess}
    />
  );
}

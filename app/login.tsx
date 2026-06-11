import React from 'react';
import { useRouter } from 'expo-router';
import { CustomSignIn } from '@/features/auth/ui/CustomSignIn';

export default function LoginScreen() {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const handleSuccess = () => {
    router.replace('/(main)/dashboard');
  };

  return (
    <CustomSignIn
      onBack={handleBack}
      onSuccess={handleSuccess}
    />
  );
}

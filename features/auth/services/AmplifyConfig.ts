// src/features/auth/services/AmplifyConfig.ts

import { Amplify } from 'aws-amplify';
import config from '@/lib/amplifyconfiguration';

export const configureAmplify = (): void => {
  try {
    Amplify.configure(config);
    console.log('Amplify successfully configured');
  } catch (error) {
    console.error(
      'Failed to configure Amplify. Ensure amplify_outputs.json is properly configured.',
      error,
    );
  }
};

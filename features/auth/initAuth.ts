// src/features/auth/initAuth.ts

import { configureAmplify } from './services/AmplifyConfig';

export const initAuth = (): void => {
  configureAmplify();
};

import { Amplify } from 'aws-amplify';
import amplifyConfig from '@/lib/amplifyconfiguration';

let configured = false;

export function configureAmplify(): void {
  if (configured) return;
  Amplify.configure(amplifyConfig);
  configured = true;
}

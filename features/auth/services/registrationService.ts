// src/features/auth/services/registrationService.ts

import { signUp, confirmSignUp } from 'aws-amplify/auth';

export interface UserRegistrationData {
  email: string;
  password: string;
  organizationId?: string;
  organizationName?: string;
  name?: string;
  phone?: string;
}

export interface RegistrationResult {
  success: boolean;
  user?: any;
  error?: string;
}

export async function registerUser(userData: UserRegistrationData): Promise<RegistrationResult> {
  try {
    const attributes: Record<string, string> = {
      email: userData.email,
    };

    // Add custom organization attributes if provided
    if (userData.organizationId) {
      attributes['custom:organizationId'] = userData.organizationId;
    }
    
    if (userData.organizationName) {
      attributes['custom:organizationName'] = userData.organizationName;
    }

    if (userData.name) {
      attributes.name = userData.name;
    }

    if (userData.phone) {
      attributes.phone_number = userData.phone;
    }

    const result = await signUp({
      username: userData.email,
      password: userData.password,
      options: {
        userAttributes: attributes,
      },
    });

    return {
      success: true,
      user: result,
    };
  } catch (error: any) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: error.message || 'Registration failed',
    };
  }
}

export async function confirmUserRegistration(email: string, confirmationCode: string): Promise<RegistrationResult> {
  try {
    const result = await confirmSignUp({
      username: email,
      confirmationCode,
    });

    return {
      success: true,
      user: result,
    };
  } catch (error: any) {
    console.error('Confirmation error:', error);
    return {
      success: false,
      error: error.message || 'Confirmation failed',
    };
  }
} 
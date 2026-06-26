// src/features/auth/types/authTypes.ts

export type CognitoAttributePrimitive = string | boolean | number | null | undefined;

export interface CognitoUserAttributes {
  email?: string;
  email_verified?: boolean;
  sub?: string;
  preferred_username?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  phone_number?: string;
  phone_number_verified?: boolean;
  [key: string]: CognitoAttributePrimitive;
}

export interface ExtendedAuthUser {
  username: string;
  attributes: CognitoUserAttributes;
  groups: string[];
}
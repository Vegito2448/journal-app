import { User } from "./user";

export interface AuthState {
  loading: boolean;
  error: string | null | Error;
  user: User | null;
  token: string | null;
}

export enum Provider {
  GOOGLE = 'google',
  EMAIL = 'email',
  FACEBOOK = 'facebook',
  GITHUB = 'github',
  TWITTER = 'twitter',
}

export interface GoogleAuth {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  isAnonymous: boolean;
  photoURL: string;
  providerData: ProviderDatum[];
  stsTokenManager: StsTokenManager;
  createdAt: string;
  lastLoginAt: string;
  apiKey: string;
  appName: string;
}

export interface ProviderDatum {
  providerId: string;
  uid: string;
  displayName: string;
  email: string;
  phoneNumber: null;
  photoURL: string;
}

export interface StsTokenManager {
  refreshToken: string;
  accessToken: string;
  expirationTime: number;
}

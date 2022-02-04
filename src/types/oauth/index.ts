export enum Platform {
  STREAMLABS = "streamlabs",
  STRAMELEMENTS = "streamelements"
}

export enum OAuthStatus {
  LOADING,
  REQUESTING_SIGNATURE,
  VERIFYING,
  CONNECTED,
  ERROR,
}

export interface OAuthState {
  status?: OAuthStatus,
  error?: string;
}
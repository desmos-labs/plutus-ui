import { StoredData } from "./storage";

export enum OAuthPopupStatus {
  NOTHING,
  INITIALIZED,
  REQUESTED_SIGNATURE,
  VERIFYING,
  CONNECTED,
  ERROR,
}

export type OAuthPopupState = {
  status: OAuthPopupStatus;
  oAuthCode?: string;
  data?: StoredData;
  error?: string;
};

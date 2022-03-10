import { DesmosProfile } from "../../types";

export enum DonationStatus {
  LOADING,
  LOADED,
  CONFIRMING_TX,
  ERROR,
}

/**
 * Represents the state of the donation screen.
 */
export type DonationState = {
  status: DonationStatus;
  denom: string;
  recipientProfiles: DesmosProfile[];
  selectedProfile: DesmosProfile;
  amount: string;
  username: string;
  message: string;
  error?: string;
  txHash?: string;
};

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
  recipientAddresses: string[];
  recipientProfile: DesmosProfile;
  amount: string;
  username: string;
  message: string;
  error?: string;
  txHash?: string;
};

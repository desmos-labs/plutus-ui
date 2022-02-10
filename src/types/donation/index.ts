import {Profile} from "types/desmos";

export enum DonationStatus {
  LOADING,
  INPUTTING_DATA,
  TX_REQUEST_SENT,
  ERROR,
  SUCCESS,
}

/**
 * Represents the state of the donation screen.
 */
export type DonationState = {
  status: DonationStatus,
  recipientAddresses: string[];
  recipientProfile: Profile,
  amount: string;
  username: string;
  message: string;
  error?: string;
  txHash?: string;
}

/**
 * Contains all the information about a donation that should be done.
 */
export type Donation = {
  tipperAddress: string;
  recipientAddress: string;
  tipAmount: number;
  recipientApplication: string;
  recipientUsername: string
  tipperUsername: string
  message: string;
}
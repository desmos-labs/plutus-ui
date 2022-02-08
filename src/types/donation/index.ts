/**
 * Represents the state of the donation screen.
 */
export type DonationState = {
  recipientAddresses: string[];
  recipientAddress: string;
  amount: number;
  username: string;
  message: string;
  isLoading: boolean;
  error?: string;
  success: boolean;
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
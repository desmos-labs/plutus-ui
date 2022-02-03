/**
 * Represents the state of the donation screen.
 */
export type DonationState = {
  amount: number;
  message: string;
  isLoading: boolean;
  error?: string;
}

/**
 * Contains all the information about a donation that should be done.
 */
export type Donation = {
  tipperAddress: string;
  tipAmount: number;
  recipientPlatform: string;
  recipientUsername: string
  donationMessage: string;
}
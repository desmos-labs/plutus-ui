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
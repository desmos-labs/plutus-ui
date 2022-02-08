import {Donation} from "types/donation";

const PLUTUS_API_URL = process.env.REACT_APP_PLUTUS_API as string;

/**
 * Represents the class to be used when interacting with the donation APIs.
 */
export class DonationsAPI {
  static async sendDonation(donation: Donation, txHash: string): Promise<Error | null> {
    const url = `${PLUTUS_API_URL}/donations`;
    const data = {
      tipper_username: donation.tipperUsername,
      donation_message: donation.message,
      recipient_application: donation.recipientApplication,
      recipient_username: donation.recipientUsername,
      tx_hash: txHash,
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      return new Error(await res.text())
    }

    return null;
  }
}
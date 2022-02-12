import {Donation} from "types/donations";

const PLUTUS_API_URL = process.env.REACT_APP_PLUTUS_API as string;

type ConfigResponse = {
  wallet: string;
}

/**
 * Represents the class to be used when interacting with the donation APIs.
 */
export class PlutusAPI {
  /**
   * Sends a donation associated to the given transaction hash.
   */
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

  static async getGranteeAddress(): Promise<string | Error> {
    try {
      const url = `${PLUTUS_API_URL}/config`
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })

      if (!res.ok) {
        return new Error(await res.text())
      }

      const data: ConfigResponse = await res.json();
      return data.wallet;
    } catch (e: any) {
      return new Error(e)
    }
  }
}
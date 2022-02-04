import {Donation} from "types/donation";

const PLUTUS_API_URL = process.env.REACT_APP_PLUTUS_API as string;
const COIN_DENOM = process.env.REACT_APP_CHAIN_COIN_DENOM as string;



/**
 * Represents the class to be used when interacting with the donation APIs.
 */
export class DonationsAPI {
  static async donate(params: Donation) {
    const url = `${PLUTUS_API_URL}/donations`;
    const data = {
      'tipper_address': params.tipperAddress,
      'amount': `${params.tipAmount * 1_000_000}${COIN_DENOM}`,
      'donation_message': params.donationMessage,
      'platform': params.recipientPlatform,
      'username': params.recipientUsername
    }

    return await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    })
  }
}
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";
import { Donation, Platform } from "../types";

const PLUTUS_API_URL = process.env.REACT_APP_PLUTUS_API as string;

interface ConfigResponse {
  readonly wallet: string;
}

interface UserDataResponse {
  readonly granted_amount?: Coin[];
  readonly enabled_integrations?: string[];
}

type AuthorizationRequest = {
  platform: Platform;
  oAuthCode: string;
  desmosAddress: string;
  signedBytes: string;
  pubKeyBytes: string;
  signatureBytes: string;
};

type DisconnectionRequest = {
  platform: Platform;
  desmosAddress: string;
  signedBytes: string;
  pubKeyBytes: string;
  signatureBytes: string;
};

/**
 * Represents the class to be used when interacting with the donation APIs.
 */
export class PlutusAPI {
  /**
   * Returns the address of the bot that should be used as the grant recipient when wanting to enable social tips.
   */
  static async getGranteeAddress(): Promise<string | Error> {
    try {
      const url = `${PLUTUS_API_URL}/config`;
      const res = await fetch(url);
      if (!res.ok) {
        return new Error(await res.text());
      }

      const data: ConfigResponse = await res.json();
      return data.wallet;
    } catch (e: any) {
      return new Error(e.message);
    }
  }

  /**
   * Returns the details of this user.
   * @param desmosAddress {string}: Desmos address of the user to be queried.
   */
  static async getUserData(
    desmosAddress: string
  ): Promise<UserDataResponse | Error> {
    try {
      const url = `${PLUTUS_API_URL}/user/${desmosAddress}`;
      const res = await fetch(url);
      if (!res.ok) {
        return new Error(await res.text());
      }

      return await res.json();
    } catch (e: any) {
      return new Error(e.message);
    }
  }

  /**
   * Sends the given authorization request to the APIs.
   */
  static async sendAuthorizationRequest(
    request: AuthorizationRequest
  ): Promise<Response> {
    const url = `${PLUTUS_API_URL}/oauth/token`;
    const data = {
      platform: request.platform.toString(),
      oauth_code: request.oAuthCode,
      desmos_address: request.desmosAddress,
      signed_bytes: request.signedBytes,
      pubkey_bytes: request.pubKeyBytes,
      signature_bytes: request.signatureBytes,
    };

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  /**
   * Sends a donation associated to the given transaction hash.
   */
  static async sendDonationAlert(
    donation: Donation,
    txHash: string
  ): Promise<Error | null> {
    const url = `${PLUTUS_API_URL}/donations`;
    const data = {
      tipper_username: donation.tipperUsername,
      donation_message: donation.message,
      recipient_application: donation.recipientApplication,
      recipient_username: donation.recipientUsername,
      tx_hash: txHash,
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      return new Error(await res.text());
    }

    return null;
  }

  /**
   * Sends a disconnection request to remove a service from a specific user.
   */
  static async sendDisconnectionRequest(
    request: DisconnectionRequest
  ): Promise<Response> {
    const url = `${PLUTUS_API_URL}/user/integrations`;
    const data = {
      platform: request.platform.toString(),
      desmos_address: request.desmosAddress,
      signed_bytes: request.signedBytes,
      pubkey_bytes: request.pubKeyBytes,
      signature_bytes: request.signatureBytes,
    };

    return fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
}

export default PlutusAPI;

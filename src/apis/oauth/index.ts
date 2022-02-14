import {Platform} from "types/oauth";

const PLUTUS_API_URL = process.env.REACT_APP_PLUTUS_API as string;

const STREAMLABS_CLIENT_ID = process.env.REACT_APP_STREAMLABS_CLIENT_ID as string;
const STREAMLABS_REDIRECT_URI = process.env.REACT_APP_STREAMLABS_REDIRECT_URI as string;

type AuthorizationRequest = {
  platform: Platform;
  oAuthCode: string;
  desmosAddress: string;
  signedBytes: string;
  pubKeyBytes: string;
  signatureBytes: string;
}

export class OAuthAPIs {
  /**
   * Generates a random none to be used to prevent OAuth CSRF attacks.
   * @see https://auth0.com/docs/secure/attack-protection/state-parameters
   * @private
   */
  private static generateNonce(): string {
    let text = "";
    const possible = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 16; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  /**
   * Starts the connection with Streamlabs.
   * @param state {string}: A random nonce to prevent OAuth CSFR attacks.
   * This should be generated using the `generateMnemonic` method.
   * @private
   */
  private static getStreamlabsConnectionURL(state: string): string {
    let url = 'https://streamlabs.com/api/v1.0/authorize?';
    const params: Record<string, string> = {
      'client_id': STREAMLABS_CLIENT_ID,
      'redirect_uri': STREAMLABS_REDIRECT_URI,
      'response_type': 'code',
      'scope': 'donations.read+donations.create',
      'state': state,
    };

    return url + Object.keys(params).map(k => `${k}=${params[k]}`).join('&');
  }

  /**
   * Starts the flow to connect the user with their Streamlabs account.
   * @return {string}: A nonce that will be sent to the callback screen as the `state` field.
   */
  static startConnection(platform: Platform): { url: string, nonce: string } {
    const nonce = this.generateNonce();
    let url = '';
    if (platform == Platform.STREAMLABS) {
      url = this.getStreamlabsConnectionURL(nonce);
    }

    return {
      url: url,
      nonce: nonce,
    }
  }

  /**
   * Sends the given authorization request to the APIs.
   */
  static async sendAuthorizationRequest(request: AuthorizationRequest): Promise<Response> {
    const url = `${PLUTUS_API_URL}/oauth/token`;
    const data = {
      'platform': request.platform.toString(),
      'oauth_code': request.oAuthCode,
      'desmos_address': request.desmosAddress,
      'signed_bytes': request.signedBytes,
      'pubkey_bytes': request.pubKeyBytes,
      'signature_bytes': request.signatureBytes,
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





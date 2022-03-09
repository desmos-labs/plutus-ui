import { Platform } from "../types";

const STREAMLABS_CLIENT_ID = process.env
  .REACT_APP_STREAMLABS_CLIENT_ID as string;
const STREAMLABS_REDIRECT_URI = process.env
  .REACT_APP_STREAMLABS_REDIRECT_URI as string;

export class OAuthAPIs {
  /**
   * Generates a random none to be used to prevent OAuth CSRF attacks.
   * @see https://auth0.com/docs/secure/attack-protection/state-parameters
   * @private
   */
  private static generateNonce(): string {
    let text = "";
    const possible = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 16; i += 1) {
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
    const url = "https://streamlabs.com/api/v1.0/authorize?";
    const params: Record<string, string> = {
      client_id: STREAMLABS_CLIENT_ID,
      redirect_uri: STREAMLABS_REDIRECT_URI,
      response_type: "code",
      scope: "donations.read+donations.create",
      state,
    };

    return (
      url +
      Object.keys(params)
        .map((k) => `${k}=${params[k]}`)
        .join("&")
    );
  }

  /**
   * Starts the flow to connect the user with their Streamlabs account.
   * @return {string}: A nonce that will be sent to the callback screen as the `state` field.
   */
  static startConnection(platform: Platform): { url: string; nonce: string } {
    const nonce = this.generateNonce();
    let url = "";
    if (platform === Platform.STREAMLABS) {
      url = this.getStreamlabsConnectionURL(nonce);
    }

    return {
      url,
      nonce,
    };
  }
}

export default OAuthAPIs;

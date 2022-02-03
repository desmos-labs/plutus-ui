const PLUTUS_API_URL = process.env.REACT_APP_PLUTUS_API as string;

const STREAMLABS_CLIENT_ID = process.env.REACT_APP_STREAMLABS_CLIENT_ID as string;
const STREAMLABS_REDIRECT_URI = process.env.REACT_APP_STREAMLABS_REDIRECT_URI as string;

export class StreamlabsAPIs {
  /**
   * Starts the flow to connect the user with their Streamlabs account.
   */
  static startConnection() {
    let url = 'https://streamlabs.com/api/v1.0/authorize?';
    const params: Record<string, string> = {
      'client_id': STREAMLABS_CLIENT_ID,
      'redirect_uri': STREAMLABS_REDIRECT_URI,
      'response_type': 'code',
      'scope': 'donations.read+donations.create',
    };

    url += Object.keys(params).map(k => `${k}=${params[k]}`).join('&');
    window.open(url, '_blank');
  }

  /**
   * Sends the given authorization code to the APIs.
   * @param desmosAddress {string}: Desmos address of the user.
   * @param oAuthCode {string}: OAuth code to be sent
   */
  static async sendAuthorizationCode(desmosAddress: string, oAuthCode: string) {
    const url = `${PLUTUS_API_URL}/streamlabs/token`;
    const data = {
      'desmos_address': desmosAddress,
      'oauth_code': oAuthCode,
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





export function authorizeStreamlabs() {
  let url = 'https://streamlabs.com/api/v1.0/authorize?';
  const params = {
    'client_id': process.env.REACT_APP_STREAMLABS_CLIENT_ID,
    'redirect_uri': process.env.REACT_APP_STREAMLABS_REDIRECT_URI,
    'response_type': 'code',
    'scope': 'donations.read+donations.create',
  };

  url += Object.keys(params).map(k => `${k}=${params[k]}`).join('&');
  window.open(url, '_blank');
}

export async function getAuthorizationToken(desmosAddress, oAuthCode) {
  const url = `${process.env.REACT_APP_PLUTUS_API}/streamlabs/token`;
  const data = {
    'desmos_address': desmosAddress, // TODO: Get this from the state
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
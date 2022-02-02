/**
 *
 * @param tipper {String}
 * @param amount {Number}
 * @param message {String}
 * @param platform {String}
 * @param username {String}
 */
export function donate(tipper, amount, message, platform, username) {
  const url = `${process.env.REACT_APP_PLUTUS_API}/donations`;
  const data = {
    'tipper_address': tipper,
    'amount': `${amount * 1_000_000}${process.env.REACT_APP_COIN_DENOM}`,
    'donation_message': message,
    'platform': platform,
    'username': username
  }
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
}
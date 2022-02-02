/**
 * Allows to donate some DSM.
 * @param tipper {String}: Desmos address of the tipper.
 * @param amount {Number}: Amount of DSM to be donated.
 * @param message {String}: Donation message.
 * @param platform {String}: Platform used to find the recipient of the donation.
 * @param username {String}: Username of the recipient inside the given platform.
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
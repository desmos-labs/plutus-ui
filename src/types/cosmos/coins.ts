import {Coin} from "cosmjs-types/cosmos/base/v1beta1/coin";

export function formatDenom(denom: string): string {
  switch (denom.toLowerCase()) {
    case 'udsm':
      return 'DSM'
    case 'udaric':
      return 'Daric'
    default:
      return 'Unknown'
  }
}

export function coinToString(coin: Coin): string {
  const amount = parseFloat(coin.amount) / 1_000_000;
  const denom = formatDenom(coin.denom);
  return `${amount.toString()} ${denom.toUpperCase()}`;
}

export function coinsToString(coins: Coin[]): string {
  return coins.map(coinToString).join(', ')
}

export function isZero(coins: Coin[]): boolean {
  return coins.length == 0;
}
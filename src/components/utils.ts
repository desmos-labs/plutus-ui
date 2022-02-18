import {DesmosProfile} from "../types";

const EXPLORER_URL = process.env.REACT_APP_CHAIN_EXPLORER_ENDPOINT as string;

/**
 * Returns the explorer link to the transaction having the given hash.
 * @param txHash {string | undefined}: Hash of the transaction.
 */
export function getTxLink(txHash: string | undefined): string {
  return `${EXPLORER_URL}/transactions/${txHash || ''}`;
}

export function getDisplayName(profile: DesmosProfile) : string {
  return profile.nickname || profile.dtag || profile.address
}
import { Platform } from "../../types";

/**
 * Contains the data that is stored relating an OAuth request.
 */
export type StoredData = {
  platform: Platform;
  desmosAddress: string;
};

/**
 * Represents the storage for the OAuth related data.
 */
export class OAuthStorage {
  /**
   * Stores the given data inside the storage.
   * @param nonce {string}: Randomly generated nonce related to an OAuth request.
   * @param platform {Platform}: Platform for which the data should be stored.
   * @param desmosAddress {string}: Desmos address associated with the request.
   */
  static storeData(nonce: string, platform: Platform, desmosAddress: string) {
    const data = {
      platform,
      desmosAddress,
    } as StoredData;
    window.localStorage.setItem(nonce, JSON.stringify(data));
  }

  /**
   * Gets the data related to a nonce.
   * @param nonce {string}: Randomly generated nonce related to an OAuth request.
   */
  static getData(nonce: string): StoredData | null {
    const data = window.localStorage.getItem(nonce);
    if (data == null) {
      return null;
    }

    return JSON.parse(data);
  }

  /**
   * Deletes the data related to a request.
   * @param nonce {string}: Randomly generated nonce related to an OAuth request.
   */
  static deleteData(nonce: string) {
    window.localStorage.removeItem(nonce);
  }
}

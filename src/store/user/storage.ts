const KEY_DESMOS_ADDRESS = "desmos_address";

/**
 * Allows to deal with the storage of user data.
 */
class UserStorage {
  static isLoggedIn(): boolean {
    return window.localStorage.getItem(KEY_DESMOS_ADDRESS) != null;
  }

  static getUserAddress(): string {
    return window.localStorage.getItem(KEY_DESMOS_ADDRESS)!
  }

  static setLoggedIn(desmosAddress: string) {
    window.localStorage.setItem(KEY_DESMOS_ADDRESS, desmosAddress)
  }

  static setLoggedOut() {
    window.localStorage.removeItem(KEY_DESMOS_ADDRESS)
  }
}

export default UserStorage;
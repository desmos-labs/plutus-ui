import {AppThunk} from "store/index";
import {setUserStatus} from "store/user/index";
import {UserWallet} from "types/cosmos/wallet";

/**
 * Allows to perform the login of a user using WalletConnect.
 */
export function loginWithWalletConnect(): AppThunk {
  return async dispatch => {

    /**
     * Updates the current login status of the user inside the UserStorage.
     */
    function setUserLoggedIn(error: Error | null, desmosAddress: string) {
      if (error != null) {
        dispatch(setUserStatus({isLoggedIn: false, message: error.message}));
        return
      }

      // Dispatch the event
      dispatch(setUserStatus({isLoggedIn: true, desmosAddress: desmosAddress}));
    }

    /**
     * Updates the current login status of the user inside the UserStorage.
     */
    function setUserLoggedOut(error: Error | null) {
      // Disconnect from the wallet
      UserWallet.disconnect();

      // Dispatch the event
      dispatch(setUserStatus({isLoggedIn: false, message: error?.message}));
    }

    UserWallet.setOnConnect(setUserLoggedIn);
    UserWallet.setOnSessionUpdate(setUserLoggedIn);
    UserWallet.setOnDisconnect(setUserLoggedOut);

    if (!UserWallet.isConnected()) {
      UserWallet.createSession();
    }
  }
}

/**
 * Allows to perform the logout of a user.
 */
export function logout(): AppThunk {
  return dispatch => {
    // Disconnect the wallet
    UserWallet.disconnect();

    dispatch(setUserStatus({isLoggedIn: false}));
  }
}
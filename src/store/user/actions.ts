import {AppThunk} from "store/index";
import {setUserStatus} from "store/user/index";
import UserStorage from "store/user/storage";
import {UserWallet} from "types/crypto/wallet";
import {TxBody} from "cosmjs-types/cosmos/tx/v1beta1/tx";


/**
 * Allows to perform the login of a user using WalletConnect.
 */
export const loginWithWalletConnect = (): AppThunk => {
  return async dispatch => {

    /**
     * Updates the current login status of the user inside the UserStorage.
     */
    function setUserLoggedIn(error: Error | null, desmosAddress: string) {
      console.log('setUserLoggedIn')
      if (error != null) {
        dispatch(setUserStatus({isLoggedIn: false, message: error.message}));
        return
      }

      // Store inside the local storage
      UserStorage.setLoggedIn(desmosAddress)

      // Dispatch the event
      dispatch(setUserStatus({isLoggedIn: true, desmosAddress: desmosAddress}));
    }

    /**
     * Updates the current login status of the user inside the UserStorage.
     */
    function setUserLoggedOut(error: Error | null) {
      // Disconnect from the wallet
      UserWallet.disconnect();

      // Update the local storage
      UserStorage.setLoggedOut();

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
export const logout = (): AppThunk => {
  return dispatch => {
    // Disconnect the wallet
    UserWallet.disconnect();

    // Store inside the local storage
    UserStorage.setLoggedOut();

    dispatch(setUserStatus({isLoggedIn: false}));
  }
}
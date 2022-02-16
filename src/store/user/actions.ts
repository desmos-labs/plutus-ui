import {AppThunk} from "store/index";
import {setUserStatus, UserState} from "store/user/index";
import {UserWallet} from "types/cosmos/wallet";
import {SignerStatus} from "@desmoslabs/desmjs";

/**
 * Initializes the user state.
 */
export function initUserState(): AppThunk {
  return async dispatch => {
    const account = await UserWallet.getAccount();
    const state: UserState = account ? {isLoggedIn: true, account: account} : {isLoggedIn: false};
    dispatch(setUserStatus(state))
  }
}

/**
 * Allows to perform the login of a user using WalletConnect.
 */
export function loginWithWalletConnect(): AppThunk {
  return async dispatch => {

    /**
     * Observes the status of the wallet emitting the proper events when needed.
     */
    async function observeWalletStatus(status: SignerStatus) {
      if (status == SignerStatus.Connected) {
        const account = await UserWallet.getAccount();
        if (!account) {
          setUserStatus({isLoggedIn: false, message: "Acount is null"});
          return
        }

        dispatch(setUserStatus({isLoggedIn: true, account: account}));
        return;
      }

      if (status == SignerStatus.NotConnected) {
        dispatch(setUserStatus({isLoggedIn: false}));
        return;
      }
    }

    // Add the status observer
    UserWallet.addStatusObserver(observeWalletStatus)

    // If the user is not connected, create a new session
    if (!UserWallet.isConnected()) {
      const error = await UserWallet.connect();
      if (error) {
        dispatch(setUserStatus({isLoggedIn: false, message: error.message}));
      }
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
import {AppThunk} from "../index";
import {LoginStep, setUserStatus} from "./index";
import {UserWallet} from "types/cosmos/wallet";
import {SignerStatus} from "@desmoslabs/desmjs";
import {PlutusAPI} from "../../apis";
import {convertProfile, parsePlatform} from "../../types";

/**
 * Initializes the user state.
 */
export function refreshUserState(): AppThunk {
  return async dispatch => {
    // Get the account
    const account = await UserWallet.getAccount();
    if (!account) {
      dispatch(setUserStatus({step: LoginStep.LOGGED_OUT}));
      return
    }

    // Get the profile
    const profile = await UserWallet.getProfile();

    // Get the user data
    const userData = await PlutusAPI.getUserData(account.address);
    if (userData instanceof Error) {
      dispatch(setUserStatus({step: LoginStep.LOGGED_OUT, message: userData.message}));
      return
    }

    dispatch(setUserStatus({
      step: LoginStep.LOGGED_IN,
      account: {
        profile: convertProfile(account.address, profile),
        grantedAmount: userData.granted_amount || [],
        enabledIntegrations: (userData.enabled_integrations || []).map(parsePlatform),
      }
    }))
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
      if (status == SignerStatus.NotConnected) {
        dispatch(setUserStatus({step: LoginStep.LOGGED_OUT}));
        return
      }

      // Initialize the state
      await dispatch(refreshUserState());
    }

    // Add the status observer
    UserWallet.addStatusObserver(observeWalletStatus)

    // If the user is not connected, create a new session
    if (!UserWallet.isConnected()) {
      const error = await UserWallet.connect();
      if (error) {
        dispatch(setUserStatus({step: LoginStep.LOGGED_OUT, message: error.message}));
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

    dispatch(setUserStatus({step: LoginStep.LOGGED_OUT}));
  }
}
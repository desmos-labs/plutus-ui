import {AppThunk} from "store/index";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import {setUserStatus} from "store/user/index";
import UserStorage from "store/user/storage";
import {Buffer} from 'buffer';
import App from "components/App";
import {CosmosAuthInfo, CosmosFee, CosmosSignerInfo, CosmosSignMode, CosmosTxBody} from "desmosjs";
import {UserWallet} from "types/crypto/wallet";
import {TransactionBody} from "types/crypto/cosmos";


/**
 * Allows to perform the login of a user using WalletConnect.
 */
export const loginWithWalletConnect = (): AppThunk => {
  return async dispatch => {
    if (!UserWallet.isConnected()) {
      UserWallet.createSession();
    }

    /**
     * Updates the current login status of the user inside the UserStorage.
     */
    function setUserLoggedIn(error: Error | null, desmosAddress: string) {
      if (error != null) {
        dispatch(setUserStatus({isLoggedIn: false, message: error.message}));
        return
      }

      // Store inside the local storage
      UserStorage.setLoggedIn(desmosAddress)

      // Dispatch the event
      dispatch(setUserStatus({isLoggedIn: true, desmosAddress: desmosAddress}));
    }

    UserWallet.setOnConnect(setUserLoggedIn);
    UserWallet.setOnSessionUpdate(setUserLoggedIn);
    UserWallet.setOnDisconnect((error) => {
      // Disconnect from the wallet
      UserWallet.disconnect();

      // Update the local storage
      UserStorage.setLoggedOut();

      // Dispatch the event
      dispatch(setUserStatus({isLoggedIn: false, message: error?.message}));
    });
  }
}

/**
 * Signs the given transaction and returns the signed value, or an `Error` is something went wrong.
 */
export const signTransaction = async (body: TransactionBody) => {
  return UserWallet.signTransaction(body);
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
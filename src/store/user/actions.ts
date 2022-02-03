import {AppThunk} from "store/index";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import {setUserStatus} from "store/user/index";
import UserStorage from "store/user/storage";
import {Buffer} from 'buffer';

global.Buffer = global.Buffer || Buffer

const connector = new WalletConnect({
  bridge: 'https://bridge.walletconnect.org',
  qrcodeModal: QRCodeModal,
});

/**
 * Allows to perform the login of a user using WalletConnect.
 */
export const loginWithWalletConnect = (): AppThunk => {
  return async dispatch => {
    if (!connector.connected) {
      connector.createSession();
    }

    /**
     * Updates the current login status of the user inside the UserStorage.
     * @param error
     * @param payload
     */
    function setUserLoggedIn(error: Error | null, payload: any) {
      if (error != null) {
        dispatch(setUserStatus({isLoggedIn: false, message: error.message}));
        return
      }

      const {accounts, chainId} = payload.params[0];
      const desmosAddress = accounts[chainId];

      // Store inside the local storage
      UserStorage.setLoggedIn(desmosAddress)

      // Dispatch the event
      dispatch(setUserStatus({isLoggedIn: true, desmosAddress: desmosAddress}));
    }

    connector.on('connect', setUserLoggedIn);
    connector.on('session_update', setUserLoggedIn);
    connector.on("disconnect", (error) => {
      // Kill the WalletConnect session
      connector.killSession();

      // Store inside the local storage
      UserStorage.setLoggedOut();

      // Dispatch the event
      dispatch(setUserStatus({isLoggedIn: false, message: error?.message}));
    });
  }
}

/**
 * Allows to perform the logout of a user.
 */
export const logout = (): AppThunk => {
  return dispatch => {
    // Store inside the local storage
    UserStorage.setLoggedOut();

    dispatch(setUserStatus({isLoggedIn: false}));
  }
}
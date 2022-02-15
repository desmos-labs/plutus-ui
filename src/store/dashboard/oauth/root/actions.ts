import {AppThunk} from "store/index";
import {OAuthParams, Platform} from "types/oauth";
import {OAuthAPIs} from "apis/oauth";
import {OAuthStorage} from "store/dashboard/oauth/storage";
import {initOAuthPopupState} from "store/dashboard/oauth/popup/actions";
import {UserWallet} from "types/cosmos/wallet";

/**
 * Initializes the OAuth state.
 */
export function initOAuthState(params: OAuthParams): AppThunk {
  return async dispatch => {
    await Promise.all([
      dispatch(initOAuthPopupState(params)),
    ]);
  }
}

/**
 * Stats the authorization process for the given platform.
 */
export function startAuthorization(platform: Platform): AppThunk {
  return _ => {
    const desmosAddress = UserWallet.getAddress();
    if (!desmosAddress) {
      console.error("Invalid user address")
      return
    }

    // Get the nonce and the URL
    const {nonce, url} = OAuthAPIs.startConnection(platform);

    // Store the nonce locally
    OAuthStorage.storeData(nonce, platform, desmosAddress);

    // Redirect the user
    window.location.href = url;
  }
}

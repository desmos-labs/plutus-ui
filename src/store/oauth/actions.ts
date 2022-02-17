import {OAuthParams, isSignDoc, UserWallet, Platform} from "../../types";
import {AppThunk} from "../index";
import {OAuthStorage, StoredData} from "./storage";
import {OAuthAPIs} from "../../apis";
import {MsgSendEncodeObject} from "@cosmjs/stargate";
import {OAuthPopupStatus, setError, setOAuthCode, setStatus, setStoredData} from "./index";
import {AuthInfo, SignDoc} from "cosmjs-types/cosmos/tx/v1beta1/tx";
import {Any} from "cosmjs-types/google/protobuf/any";
import {serializeSignDoc} from "@cosmjs/amino";

/**
 * Initializes the OAuth popup state.
 */
export function initOAuthPopupState({oAuthCode, oAuthState}: OAuthParams): AppThunk {
  return dispatch => {
    if (!oAuthCode || !oAuthState) {
      return
    }

    dispatch(setOAuthCode(oAuthCode));

    // Get the data from the local storage
    const data = OAuthStorage.getData(oAuthState);
    if (data == null) {
      dispatch(setError("Invalid OAuth state"));
      return
    }

    dispatch(setStoredData(data));
    dispatch(setStatus(OAuthPopupStatus.INITIALIZED));
  }
}

/**
 * Stats the authorization process for the given platform.
 */
export function startAuthorization(platform: Platform): AppThunk {
  return async _ => {
    const account = await UserWallet.getAccount();
    if (!account) {
      console.error("Invalid user account")
      return
    }

    // Get the nonce and the URL
    const {nonce, url} = OAuthAPIs.startConnection(platform);

    // Store the nonce locally
    OAuthStorage.storeData(nonce, platform, account.address);

    // Redirect the user
    window.location.href = url;
  }
}

/**
 * Finalizes the OAuth process associated with the given OAuth code and nonce.
 * The process is completed when we are sure the user performing the connection is the one that also
 * owns the current Desmos address. The verification is performed by asking the user to sign a transaction and
 * sending the signed transaction along with the OAuth code to the APIs that will associate the two together.
 */
export function finalizeOAuth(oAuthCode?: string, data?: StoredData): AppThunk {
  return async dispatch => {
    if (!oAuthCode) {
      dispatch(setError("Invalid OAuth code"));
      return
    }

    if (!data) {
      dispatch(setError("Invalid stored data"));
      return
    }

    // Build the message
    const msgSend: MsgSendEncodeObject = {
      typeUrl: "/cosmos.bank.v1beta1.MsgSend",
      value: {
        fromAddress: data.desmosAddress,
        toAddress: data.desmosAddress,
        amount: [{
          denom: '',
          amount: '0',
        }]
      }
    }

    // Ask the user to sign
    dispatch(setStatus(OAuthPopupStatus.REQUESTED_SIGNATURE));
    const txResult = await UserWallet.signTransaction(data.desmosAddress, [msgSend], {memo: oAuthCode});
    if (txResult instanceof Error) {
      dispatch(setError(txResult.message));
      return
    }

    // Get the auth bytes
    const authInfo = AuthInfo.decode(txResult.txRaw.authInfoBytes);
    const pubKey = authInfo.signerInfos[0].publicKey;
    if (!pubKey) {
      dispatch(setError("Invalid returned public key"))
      return
    }
    const pubKeyBytes = Any.encode(pubKey).finish();

    // Get the signed bytes
    const signedBytes = isSignDoc(txResult.signDoc) ?
      SignDoc.encode(txResult.signDoc).finish() :
      serializeSignDoc(txResult.signDoc);

    // Get the signature bytes
    const signatureBytes = txResult.txRaw.signatures[0];

    dispatch(setStatus(OAuthPopupStatus.VERIFYING));
    try {
      const res = await OAuthAPIs.sendAuthorizationRequest({
        oAuthCode: oAuthCode,
        desmosAddress: data.desmosAddress,
        platform: data.platform,
        pubKeyBytes: Buffer.from(pubKeyBytes).toString('hex'),
        signedBytes: Buffer.from(signedBytes).toString('hex'),
        signatureBytes: Buffer.from(signatureBytes).toString('hex'),
      })
      if (!res.ok) {
        dispatch(setError(await res.text()));
        return
      }

      dispatch(setStatus(OAuthPopupStatus.CONNECTED));
    } catch (error: any) {
      dispatch(setError(error.message));
    }
  }
}
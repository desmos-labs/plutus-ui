import {AppThunk} from "store/index";
import {OAuthStatus, Platform} from "types/oauth";
import {setError, setStatus} from "store/oauth/index";
import {OAuthAPIs} from "apis/oauth";
import OAuthStorage from "store/oauth/storage";
import UserStorage from "store/user/storage";
import {UserWallet} from "types/crypto/wallet";
import {TxBody} from "cosmjs-types/cosmos/tx/v1beta1/tx";
import {MsgSend} from "cosmjs-types/cosmos/bank/v1beta1/tx";
import {util} from "protobufjs";
import Long from "long";

/**
 * Stats the authorization process for the given platform.
 */
export const startAuthorization = (platform: Platform): AppThunk => {
  return _ => {
    const desmosAddress = UserStorage.getUserAddress();

    // Get the nonce and the URL
    const {nonce, url} = OAuthAPIs.startConnection(platform);

    // Store the nonce locally
    OAuthStorage.storeData(nonce, platform, desmosAddress);

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
export const finalizeOAuth = (oAuthCode: string | null, nonce: string | null): AppThunk => {
  return async dispatch => {
    if (oAuthCode == null) {
      dispatch(setError("Invalid OAuth code"))
      return
    }
    if (nonce == null) {
      dispatch(setError("Invalid OAuth state"))
      return
    }

    // Reset the state
    dispatch(setStatus(OAuthStatus.LOADING));

    // Get the data from the local storage
    const data = OAuthStorage.getData(nonce);
    if (data == null) {
      dispatch(setError("Invalid OAuth state"));
      return
    }

    // Build the message
    const msgSend = {
      fromAddress: data.desmosAddress,
      toAddress: data.desmosAddress,
      amount: [{
        denom: '',
        amount: '0',
      }]
    }

    // Build the transaction to be signed
    const txBody: TxBody = {
      memo: oAuthCode,
      messages: [
        {
          typeUrl: '/cosmos.bank.v1beta1.MsgSend',
          value: MsgSend.encode(msgSend).finish(),
        }
      ],
      extensionOptions: [],
      nonCriticalExtensionOptions: [],
      timeoutHeight: Long.fromNumber(0),
    }

    dispatch(setStatus(OAuthStatus.REQUESTING_SIGNATURE));
    const txResult = await UserWallet.signTransaction(txBody);
    if (txResult instanceof Error) {
      dispatch(setError(txResult.message));
      return
    }

    dispatch(setStatus(OAuthStatus.VERIFYING));
    const res = await OAuthAPIs.sendAuthorizationRequest({
      oAuthCode: oAuthCode,
      desmosAddress: data.desmosAddress,
      platform: data.platform,
      pubKeyBytes: Buffer.from(txResult.pubKeyBytes).toString('hex'),
      signedBytes: Buffer.from(txResult.signDocBytes).toString('hex'),
      signatureBytes: Buffer.from(txResult.signatureBytes).toString('hex'),
    })
    if (!res.ok) {
      dispatch(setError(await res.text()));
      return
    }

    dispatch(setStatus(OAuthStatus.CONNECTED));
  }
}
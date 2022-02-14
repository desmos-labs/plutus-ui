import {OAuthParams} from "types/oauth";
import {AppThunk} from "store/index";
import {OAuthStorage, StoredData} from "store/dashboard/oauth/storage";
import {OAuthAPIs} from "apis/oauth";
import {AminoMsgSend} from "@cosmjs/stargate";
import {UserWallet} from "types/crypto/wallet";
import {MsgSend} from "cosmjs-types/cosmos/bank/v1beta1/tx";
import {OAuthPopupStatus, setError, setOAuthCode, setStatus, setStoredData} from "store/dashboard/oauth/popup/index";

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

async function signAmino(oAuthCode: string, data: StoredData) {
  // Build the message
  const msgSend: AminoMsgSend = {
    type: "cosmos-sdk/MsgSend",
    value: {
      from_address: data.desmosAddress,
      to_address: data.desmosAddress,
      amount: [{
        denom: '',
        amount: '0',
      }]
    },
  }

  return await UserWallet.signTransactionAmino([msgSend], oAuthCode);
}

async function signDirect(oAuthCode: string, data: StoredData) {
  // Build the message
  const msgSend = {
    fromAddress: data.desmosAddress,
    toAddress: data.desmosAddress,
    amount: [{
      denom: '',
      amount: '0',
    }]
  }

  return await UserWallet.signTransactionDirect({
    memo: oAuthCode,
    messages: [
      {
        typeUrl: '/cosmos.bank.v1beta1.MsgSend',
        value: MsgSend.encode(msgSend).finish(),
      }
    ],
  });
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

    dispatch(setStatus(OAuthPopupStatus.REQUESTED_SIGNATURE));
    const txResult = await signDirect(oAuthCode, data);
    if (txResult instanceof Error) {
      dispatch(setError(txResult.message));
      return
    }

    dispatch(setStatus(OAuthPopupStatus.VERIFYING));
    try {
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

      dispatch(setStatus(OAuthPopupStatus.CONNECTED));
    } catch (error: any) {
      dispatch(setError(error.message));
    }
  }
}
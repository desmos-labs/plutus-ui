import {getSignatureData, Platform, UserWallet} from "../../types";
import {AppThunk} from "../index";
import {IntegrationPopupStep, setError, setPlatform, setStatus} from "./index";
import {PlutusAPI} from "../../apis";
import {refreshUserState} from "../user";
import {MsgAuthenticateEncodeObject} from "@desmoslabs/desmjs";

/**
 * Starts the disconnection from the given platform.
 */
export function startDisconnection(platform: Platform): AppThunk {
  return dispatch => {
    dispatch(setPlatform(platform));
    dispatch(setStatus(IntegrationPopupStep.CONFIRMATION_REQUESTED));
  }
}

/**
 * Effectively disconnects the user from the given platform.
 */
export function disconnect(platform: Platform): AppThunk {
  return async dispatch => {
    // Get the user data
    const account = await UserWallet.getAccount();
    if (!account) {
      dispatch(setError("Invalid user account"))
      return
    }

    // Build the message to be signed
    const msgSend: MsgAuthenticateEncodeObject = {
      typeUrl: "/desmjs.v1.MsgAuthenticate",
      value: {
        user: account.address,
      }
    }

    dispatch(setStatus(IntegrationPopupStep.TX_REQUEST_SENT));
    const result = await UserWallet.signTransaction(account.address, [msgSend], {
      memo: platform.toString()
    });
    if (result instanceof Error) {
      dispatch(setError(result.message));
      return
    }

    const signedData = getSignatureData(result);
    if (signedData instanceof Error) {
      dispatch(setError(signedData.message));
      return
    }

    dispatch(setStatus(IntegrationPopupStep.DISCONNECTING));
    try {
      const res = await PlutusAPI.sendDisconnectionRequest({
        desmosAddress: account.address,
        platform: platform,
        pubKeyBytes: Buffer.from(signedData.pubKeyBytes).toString('hex'),
        signedBytes: Buffer.from(signedData.signedBytes).toString('hex'),
        signatureBytes: Buffer.from(signedData.signatureBytes).toString('hex'),
      })
      if (!res.ok) {
        dispatch(setError(await res.text()));
        return
      }

      dispatch(refreshUserState());
      dispatch(setStatus(IntegrationPopupStep.DISCONNECTED));
    } catch (error: any) {
      dispatch(setError(error.message));
    }
  }
}
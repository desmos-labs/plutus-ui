import {DonationStatus, reset, setStatus} from "store/donation";
import {setTxError, setTxStatus, setTxSuccess, TransactionData, TransactionStatus} from "./index";
import {TxOptions, UserWallet} from "types/cosmos/wallet";
import {RootState} from "../index";
import {ThunkAction} from "redux-thunk";
import {Action} from "@reduxjs/toolkit";
import {DeliverTxResponse} from "@cosmjs/stargate";
import {EncodeObject} from "@cosmjs/proto-signing";

export type TxThunk = ThunkAction<Promise<DeliverTxResponse | Error>, RootState, null, Action<string>>

/**
 * Allows to send the given transaction and update the transaction popup during the whole process.
 * @param sender {string}: Address of the transaction sender.
 * @param messages {EncodeObject[]}: List of messages to be included inside the transaction.
 * @param options {TxOptions | undefined}: Options for the transaction.
 */
export function sendTx(sender: string, messages: EncodeObject[], options?: TxOptions): TxThunk {
  return async dispatch => {
    dispatch(setStatus(DonationStatus.CONFIRMING_TX));

    const txData: TransactionData = {
      messages: messages,
      memo: options?.memo,
    }

    // Try signing the transaction
    dispatch(setTxStatus([TransactionStatus.TX_REQUEST_SENT, txData]));
    const result = await UserWallet.signTransaction(sender, messages, options);
    if (result instanceof Error) {
      dispatch(setTxError(result.message));
      return new Error(result.message);
    }

    try {
      // Broadcast the transaction
      dispatch(setTxStatus([TransactionStatus.BROADCASTING, txData]));
      const response = await UserWallet.broadcastTx(result.txRaw);
      if (response.code != 0) {
        dispatch(setTxError(response.rawLog));
        return new Error(response.rawLog);
      }

      dispatch(setTxSuccess(response.transactionHash));
      return response;
    } catch (e: any) {
      dispatch(setTxError('Broadcasting error'));
      return new Error(e.message);
    }
  }
}
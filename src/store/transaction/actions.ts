import {DonationStatus, reset, setStatus} from "store/donation";
import {Chain} from "types/cosmos/chain";
import {TxBody} from "cosmjs-types/cosmos/tx/v1beta1/tx";
import {setTxError, setTxStatus, setTxSuccess, TransactionStatus} from "store/transaction/index";
import {UserWallet} from "types/cosmos/wallet";
import {RootState} from "store/index";
import {ThunkAction} from "redux-thunk";
import {Action} from "@reduxjs/toolkit";
import {DeliverTxResponse} from "@cosmjs/stargate";

export type TxThunk = ThunkAction<Promise<DeliverTxResponse | Error>, RootState, null, Action<string>>

/**
 * Allows to send the given transaction and update the transaction popup during the whole process.
 * @param tx {Partial<TxBody>}: Transaction to be sent.
 */
export function sendTx(tx: Partial<TxBody>): TxThunk {
  return async dispatch => {
    dispatch(setStatus(DonationStatus.CONFIRMING_TX));

    // Try signing the transaction
    const result = await UserWallet.signTransactionDirect(tx);
    if (result instanceof Error) {
      dispatch(setTxError(result.message));
      return new Error(result.message);
    }
    dispatch(setTxStatus([TransactionStatus.TX_REQUEST_SENT, tx]));

    try {
      // Broadcast the transaction
      dispatch(setTxStatus([TransactionStatus.BROADCASTING, tx]));
      const response = await Chain.broadcastTx(result.signedTxBytes);
      if (response.code != 0) {
        setTxError(response.rawLog);
        return new Error(response.rawLog);
      }

      setTxSuccess(response.transactionHash);
      return response;
    } catch (e: any) {
      dispatch(setTxError('Broadcasting error'));
      return new Error(e.message);
    }
  }
}
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EncodeObject } from "@cosmjs/proto-signing";
import type { RootState } from "../index";
import { TxOptions, UserWallet } from "../../types";
import {
  TransactionData,
  TransactionState,
  TransactionStatus,
  TxThunk,
} from "./state";

export * from "./state";

// --- STATE ---
const initialState: TransactionState = {
  status: TransactionStatus.NOTHING,
};

// --- SLICE ---
export const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setTxStatus(
      state,
      action: PayloadAction<[TransactionStatus, TransactionData]>
    ) {
      const [status, body] = action.payload;
      state.status = status;
      state.txBody = body;
    },
    setTxError(state, action: PayloadAction<string | undefined>) {
      state.status = TransactionStatus.ERROR;
      state.error = action.payload;
      state.txHash = undefined;
    },
    setTxSuccess(state, action: PayloadAction<string>) {
      state.status = TransactionStatus.SUCCESS;
      state.error = undefined;
      state.txHash = action.payload;
    },
    resetTxPopup(state) {
      state.status = initialState.status;
      state.txBody = initialState.txBody;
      state.txHash = initialState.txHash;
      state.error = initialState.error;
    },
  },
});

// --- ACTIONS ---
const { setTxStatus, setTxError, setTxSuccess } = transactionSlice.actions;
export const { resetTxPopup } = transactionSlice.actions;

/**
 * Allows to send the given transaction and update the transaction popup during the whole process.
 * @param sender {string}: Address of the transaction sender.
 * @param messages {EncodeObject[]}: List of messages to be included inside the transaction.
 * @param options {TxOptions | undefined}: Options for the transaction.
 */
export function sendTx(
  sender: string,
  messages: EncodeObject[],
  options?: TxOptions
): TxThunk {
  return async (dispatch) => {
    const txData: TransactionData = {
      messages,
      memo: options?.memo,
    };

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
      if (response.code !== 0) {
        dispatch(setTxError(response.rawLog));
        return new Error(response.rawLog);
      }

      dispatch(setTxSuccess(response.transactionHash));
      return response;
    } catch (e: any) {
      dispatch(setTxError("Broadcasting error"));
      return new Error(e.message);
    }
  };
}

// --- SELECTORS ---
export const getTransactionState = (state: RootState) => state.transaction;

export default transactionSlice.reducer;

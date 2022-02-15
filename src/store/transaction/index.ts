import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "store/index";
import {TxBody} from "cosmjs-types/cosmos/tx/v1beta1/tx";

// --- STATE ---
export enum TransactionStatus {
  NOTHING,
  TX_REQUEST_SENT,
  BROADCASTING,
  ERROR,
  SUCCESS,
}

export type TransactionState = {
  status: TransactionStatus,
  txBody?: Partial<TxBody>,
  txHash?: string;
  error?: string;
}

const initialState: TransactionState = {
  status: TransactionStatus.NOTHING,
}

// --- SLICE ---
export const transactionSlice = createSlice({
  name: 'transaction',
  initialState: initialState,
  reducers: {
    setTxStatus(state, action: PayloadAction<[TransactionStatus, Partial<TxBody>]>) {
      state.status = action.payload[0];
      state.txBody = action.payload[1];
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
export const {
  setTxStatus,
  setTxError,
  setTxSuccess,
  resetTxPopup,
} = transactionSlice.actions;

// --- SELECTORS ---
export const getTransactionState = (state: RootState) => {
  return state.transaction;
}

export default transactionSlice.reducer

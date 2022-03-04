import { EncodeObject } from "@cosmjs/proto-signing";
import { ThunkAction } from "redux-thunk";
import { DeliverTxResponse } from "@cosmjs/stargate";
import { Action } from "@reduxjs/toolkit";
import type { RootState } from "../index";

export type TxThunk = ThunkAction<
  Promise<DeliverTxResponse | Error>,
  RootState,
  null,
  Action<string>
>;

export enum TransactionStatus {
  NOTHING,
  TX_REQUEST_SENT,
  BROADCASTING,
  ERROR,
  SUCCESS,
}

export type TransactionData = {
  messages: EncodeObject[];
  memo?: string;
};

export type TransactionState = {
  status: TransactionStatus;
  txBody?: TransactionData;
  txHash?: string;
  error?: string;
};

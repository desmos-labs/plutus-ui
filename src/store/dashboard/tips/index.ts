import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "store/index";
import {act} from "react-dom/test-utils";

export enum TipsStatus {
  DEFAULT,
  REQUESTED_SIGNATURE,
  BROADCASTING_TX,
  SUCCESS,
  ERROR,
}

export type TipsState = {
  status: TipsStatus;
  grantedAmount: number;
  grantAmount: string;
  txHash?: string;
  error?: string;
}

const initialState: TipsState = {
  status: TipsStatus.DEFAULT,
  grantedAmount: 0,
  grantAmount: '0',
}

// --- SLICE ---
const tipsSlice = createSlice({
  name: 'tips',
  initialState: initialState,
  reducers: {
    setStatus(state, action: PayloadAction<TipsStatus>) {
      state.status = action.payload;
      state.error = undefined;
      state.txHash = undefined;
    },
    setGrantedAmount(state, action: PayloadAction<number>) {
      state.grantedAmount = action.payload;
    },
    setGrantAmount(state, action: PayloadAction<string>) {
      state.grantAmount = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.status = TipsStatus.ERROR;
      state.error = action.payload;
    },
    setSuccess(state, action: PayloadAction<string>) {
      state.status = TipsStatus.SUCCESS;
      state.txHash = action.payload;
    }
  }
})

// --- ACTIONS ---
export const {
  setStatus,
  setGrantedAmount,
  setGrantAmount,
  setError,
  setSuccess,
} = tipsSlice.actions;

// --- SELECTORS ---
export function getTipsState(state: RootState) {
  return state.dashboard.tips;
}

export default tipsSlice.reducer
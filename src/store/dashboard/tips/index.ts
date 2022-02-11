import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "store/index";

export enum TipsStatus {
  DEFAULT,
  REQUESTED_SIGNATURE,
  BROADCASTING_TX,
  SUCCESS,
  ERROR,
}

export type TipsState = {
  status: TipsStatus;
  error?: string;
}

const initialState: TipsState = {
  status: TipsStatus.DEFAULT,
}

// --- SLICE ---
const tipsSlice = createSlice( {
  name: 'tips',
  initialState: initialState,
  reducers: {
    setStatus(state, action:PayloadAction<TipsStatus>) {
      state.status = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.status = TipsStatus.ERROR;
      state.error = action.payload;
    }
  }
})

// --- ACTIONS ---
export const {
  setStatus,
  setError
} = tipsSlice.actions;

// --- SELECTORS ---
export function getTipsState(state: RootState) {
  return state.dashboard.tips;
}

export default tipsSlice.reducer
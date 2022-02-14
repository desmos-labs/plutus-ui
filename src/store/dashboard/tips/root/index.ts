import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "store/index";
import {Coin} from "cosmjs-types/cosmos/base/v1beta1/coin";

// --- STATE ---
export type TipsState = {
  grantedAmount?: Coin[];
  error?: string;
}

const initialState: TipsState = {
}

// --- SLICE ---
const tipsSlice = createSlice({
  name: 'tips',
  initialState: initialState,
  reducers: {
    setGrantedAmount(state, action: PayloadAction<Coin[]|undefined>) {
      state.grantedAmount = action.payload;
    },
    setError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload;
    }
  }
})

// --- ACTIONS ---
export const {
  setGrantedAmount,
  setError,
} = tipsSlice.actions;

// --- SELECTORS ---
export function getTipsState(state: RootState) {
  return state.dashboard.tips.root;
}

export default tipsSlice.reducer
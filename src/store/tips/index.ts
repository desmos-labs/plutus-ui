import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../index";
import {UserWallet} from "../../types";

export * from "./actions";

export enum TipsStep {
  HIDDEN,
  INPUT_DATA,
  CONFIRMATION_REQUIRED,
  SUCCESS,
  ERROR,
}

export type TipsState = {
  step: TipsStep;
  grantDenom: string;
  grantAmount: string;
  txHash?: string;
  error?: string;
}

// --- SLICE ---
const tipsSlice = createSlice({
  name: 'tips',
  initialState: (): TipsState => {
    return  {
      step: TipsStep.HIDDEN,
      grantDenom: UserWallet.getFeeDenom(),
      grantAmount: '0',
    }
  },
  reducers: {
    setStep(state, action: PayloadAction<TipsStep>) {
      state.step = action.payload;
      state.error = undefined;
      state.txHash = undefined;
    },
    setGrantAmount(state, action: PayloadAction<string>) {
      state.grantAmount = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.step = TipsStep.ERROR;
      state.error = action.payload;
    },
    setSuccess(state, action: PayloadAction<string>) {
      state.step = TipsStep.SUCCESS;
      state.txHash = action.payload;
    },
    resetTipsPopup(state) {
      state.step = TipsStep.HIDDEN;
      state.grantAmount = '0';
    }
  }
})

// --- ACTIONS ---
export const {
  setStep,
  setGrantAmount,
  setError,
  setSuccess,
  resetTipsPopup,
} = tipsSlice.actions;

// --- SELECTORS ---
export function getTipsPopupState(state: RootState) {
  return state.tips;
}

export default tipsSlice.reducer
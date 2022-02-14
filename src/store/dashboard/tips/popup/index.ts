import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "store/index";
import {initState} from "store/dashboard/root/actions";

export enum TipsPopupStep {
  DEFAULT,
  CONFIRMATION_REQUIRED,
  SUCCESS,
  ERROR,
}

export type TipsPopupState = {
  shown: boolean;
  step: TipsPopupStep;
  grantAmount: string;
  txHash?: string;
  error?: string;
}

const initialState: TipsPopupState = {
  shown: false,
  step: TipsPopupStep.DEFAULT,
  grantAmount: '0',
}

// --- SLICE ---
const tipsPopupSlice = createSlice({
  name: 'popup',
  initialState: initialState,
  reducers: {
    setShown(state, action:PayloadAction<boolean>) {
      state.shown = action.payload;
    },
    setStep(state, action: PayloadAction<TipsPopupStep>) {
      state.step = action.payload;
      state.error = undefined;
      state.txHash = undefined;
    },
    setGrantAmount(state, action: PayloadAction<string>) {
      state.grantAmount = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.step = TipsPopupStep.ERROR;
      state.error = action.payload;
    },
    setSuccess(state, action: PayloadAction<string>) {
      state.step = TipsPopupStep.SUCCESS;
      state.txHash = action.payload;
    },
    resetTipsPopup(state) {
      state.shown = initialState.shown;
      state.step = initialState.step;
      state.grantAmount = initialState.grantAmount;
    }
  }
})

// --- ACTIONS ---
export const {
  setShown,
  setStep,
  setGrantAmount,
  setError,
  setSuccess,
  resetTipsPopup,
} = tipsPopupSlice.actions;

// --- SELECTORS ---
export function getTipsPopupState(state: RootState) {
  return state.dashboard.tips.popup;
}

export default tipsPopupSlice.reducer
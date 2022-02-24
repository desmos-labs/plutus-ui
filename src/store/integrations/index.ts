import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../index";
import {Platform} from "../../types";

export * from "./actions";

// --- STATE ---
export enum IntegrationPopupStep {
  NOTHING,
  CONFIRMATION_REQUESTED,
  TX_REQUEST_SENT,
  DISCONNECTING,
  ERROR,
  DISCONNECTED
}

export type IntegrationPopupState = {
  step: IntegrationPopupStep,
  platform: Platform,
  error?: string,
}

const initialState: IntegrationPopupState = {
  step: IntegrationPopupStep.NOTHING,
  platform: Platform.UNKNOWN,
}

// --- SLICE ---
const integrationsSlice = createSlice({
  name: 'integrations-popup',
  initialState: initialState,
  reducers: {
    setStatus(state, action: PayloadAction<IntegrationPopupStep>) {
      state.step = action.payload;
    },
    setPlatform(state, action: PayloadAction<Platform>) {
      state.platform = action.payload;
    },
    setError(state, action: PayloadAction<string | undefined>) {
      if (action.payload) {
        state.step = IntegrationPopupStep.ERROR;
      }
      state.error = action.payload;
    },
    resetIntegrationsPopup(state) {
      state.step = initialState.step;
      state.error = undefined;
    }
  }
})

// --- ACTIONS ---
export const {
  setStatus,
  setPlatform,
  setError,
  resetIntegrationsPopup,
} = integrationsSlice.actions;

// --- SELECTORS ---
export const getIntegrationsPopupState = (state: RootState) => {
  return state.integrations;
}

export default integrationsSlice.reducer
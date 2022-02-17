import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../index";
import {StoredData} from "./storage";

export * from "./storage";
export * from "./actions";

// --- STATE ---
export enum OAuthPopupStatus {
  NOTHING,
  INITIALIZED,
  REQUESTED_SIGNATURE,
  VERIFYING,
  CONNECTED,
  ERROR,
}

export type OAuthPopupState = {
  status: OAuthPopupStatus,
  oAuthCode?: string,
  data?: StoredData,
  error?: string;
}

const initialState: OAuthPopupState = {
  status: OAuthPopupStatus.NOTHING,
};

// --- SLICE ---
const oAuthSlice = createSlice({
  name: 'popup',
  initialState: initialState,
  reducers: {
    setStatus(state, action: PayloadAction<OAuthPopupStatus>) {
      state.status = action.payload;
    },
    setOAuthCode(state, action: PayloadAction<string>) {
      state.oAuthCode = action.payload;
    },
    setStoredData(state, action: PayloadAction<StoredData>) {
      state.data = action.payload;
    },
    setError(state, action: PayloadAction<string | undefined>) {
      if (action.payload) {
        state.status = OAuthPopupStatus.ERROR;
      }
      state.error = action.payload;
    },
    resetOAuthPopup(state) {
      state.status = initialState.status;
    }
  }
})

// --- ACTIONS ---
export const {
  setStatus,
  setOAuthCode,
  setStoredData,
  setError,
  resetOAuthPopup,
} = oAuthSlice.actions;

// --- SELECTORS ---
export const getOAuthPopupState = (state: RootState) => {
  return state.oauth;
}

export default oAuthSlice.reducer
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "store/index";

// --- STATE ---
export enum OAuthStatus {
  LOADING,
  REQUESTING_SIGNATURE,
  VERIFYING,
  CONNECTED,
  ERROR,
}

export type OAuthState = {
  status?: OAuthStatus,
  error?: string;
}

const initialState = {
  status: undefined,
  error: undefined
} as OAuthState;

// --- SLICE ---
const oAuthSlice = createSlice({
  name: 'oauth',
  initialState: initialState,
  reducers: {
    setStatus(state, action: PayloadAction<OAuthStatus>) {
      state.status = action.payload;
    },
    setError(state, action: PayloadAction<string | undefined>) {
      if (action.payload) {
        state.status = OAuthStatus.ERROR;
      }
      state.error = action.payload;
    }
  }
})

// --- ACTIONS ---
export const {
  setStatus,
  setError,
} = oAuthSlice.actions;

// --- SELECTORS ---
export const getOAuthState = (state: RootState) => {
  return state.dashboard.oAuth;
}

export default oAuthSlice.reducer
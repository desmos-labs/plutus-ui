import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {OAuthState, OAuthStatus} from "types/oauth";
import {RootState} from "store/index";

const initialState = {status: undefined, error: undefined} as OAuthState;

// --- SLICE ---
export const oAuthSlice = createSlice({
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
  return state.oAuth;
}

export default oAuthSlice.reducer
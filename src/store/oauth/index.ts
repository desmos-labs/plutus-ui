import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {OAuthState} from "types/oauth";
import {RootState} from "store/index";

const initialState = {isLoading: true} as OAuthState;

// --- SLICE ---
export const oAuthSlice = createSlice({
  name: 'oauth',
  initialState: initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload;
    }
  }
})

// --- ACTIONS ---
export const {
  setLoading,
  setError,
} = oAuthSlice.actions;

// --- SELECTORS ---
export const getOAuthState = (state: RootState) => {
  return state.oAuth;
}

export default oAuthSlice.reducer
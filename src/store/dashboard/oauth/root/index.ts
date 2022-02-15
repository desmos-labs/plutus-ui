import {createSlice} from "@reduxjs/toolkit";
import {RootState} from "store/index";

// --- STATE ---
export type OAuthState = {}

const initialState = {} as OAuthState;

// --- SLICE ---
const oAuthSlice = createSlice({
  name: 'oauth',
  initialState: initialState,
  reducers: {}
})

// --- ACTIONS ---
export const {} = oAuthSlice.actions;

// --- SELECTORS ---
export const getOAuthState = (state: RootState) => {
  return state.dashboard.oAuth;
}

export default oAuthSlice.reducer
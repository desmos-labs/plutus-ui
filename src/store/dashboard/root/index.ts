import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "store/index";
import {Profile} from "types/desmos";

// --- STATE ---
export enum DashoardStatus {
  LOADING,
  LOADED,
}

export type DashboardState = {
  status: DashoardStatus,
  userProfile: Profile,
}

const initialState: DashboardState = {
  status: DashoardStatus.LOADING,
  userProfile: {address: ''},
}

// --- SLICE ---
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: initialState,
  reducers: {
    setStatus(state, action: PayloadAction<DashoardStatus>) {
      state.status = action.payload;
    },
    setUserProfile(state, action: PayloadAction<Profile>) {
      state.userProfile = action.payload;
    }
  }
})

// --- ACTIONS ---
export const {
  setStatus,
  setUserProfile,
} = dashboardSlice.actions;

// --- SELECTORS ---
export function getDashboardState(state: RootState) {
  return state.dashboard.root;
}

export default dashboardSlice.reducer;
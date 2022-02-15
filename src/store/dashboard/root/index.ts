import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "store/index";
import {Profile} from "types/desmos";

// --- STATE ---
export enum DashboardStatus {
  LOADING,
  ERROR,
  LOADED,
}

export type DashboardState = {
  status: DashboardStatus;
  userProfile: Profile;
  error?: string;
}

const initialState: DashboardState = {
  status: DashboardStatus.LOADING,
  userProfile: {address: ''},
}

// --- SLICE ---
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: initialState,
  reducers: {
    setStatus(state, action: PayloadAction<DashboardStatus>) {
      state.status = action.payload;
      state.error = undefined;
    },
    setUserProfile(state, action: PayloadAction<Profile>) {
      state.userProfile = action.payload;
    },
    setError(state, action:PayloadAction<string>) {
      state.status = DashboardStatus.ERROR;
      state.error = action.payload;
    }
  }
})

// --- ACTIONS ---
export const {
  setStatus,
  setUserProfile,
  setError,
} = dashboardSlice.actions;

// --- SELECTORS ---
export function getDashboardState(state: RootState) {
  return state.dashboard.root;
}

export default dashboardSlice.reducer;
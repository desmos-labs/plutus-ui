import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "store/index";

// --- STATE ---
export enum DashboardStatus {
  NOTHING,
  ENABLING_TIPS,
}

export type DashboardState = {
  status: DashboardStatus,
}

const initialState: DashboardState = {
  status: DashboardStatus.NOTHING,
}

// --- SLICE ---
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: initialState,
  reducers: {
    setStatus(state, action: PayloadAction<DashboardStatus>) {
      state.status = action.payload;
    }
  }
})

// --- ACTIONS ---
export const {
  setStatus
} = dashboardSlice.actions;

// --- SELECTORS ---
export function getDashboardState(state: RootState) {
  return state.dashboard.root;
}

export default dashboardSlice.reducer;
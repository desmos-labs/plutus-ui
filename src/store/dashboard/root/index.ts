import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "store/index";

// --- STATE ---
export type DashboardState = {}

const initialState: DashboardState = {}

// --- SLICE ---
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: initialState,
  reducers: {}
})

// --- ACTIONS ---
export const {} = dashboardSlice.actions;

// --- SELECTORS ---
export function getDashboardState(state: RootState) {
  return state.dashboard.root;
}

export default dashboardSlice.reducer;
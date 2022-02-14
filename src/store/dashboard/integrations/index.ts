import {createSlice} from "@reduxjs/toolkit";
import {RootState} from "store/index";

// --- STATE ---
export type IntegrationsState = {}

const initialState: IntegrationsState = {}

// --- SLICE ---
const integrationsSlice = createSlice({
  name: 'integrations',
  initialState: initialState,
  reducers: {}
})

// --- ACTIONS ---
export const {} = integrationsSlice.actions;

// --- SELECTORS ---
export function getIntegrationsState(state: RootState) {
  return state.dashboard.integrations;
}

export default integrationsSlice.reducer
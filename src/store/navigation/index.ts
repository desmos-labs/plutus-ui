import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../index";

// --- STATE ---
export type NavigationState = {
  showPopup: boolean;
};

const initialState: NavigationState = {
  showPopup: false,
};

// --- SLICE ---
export const navigationSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    showPopup(state) {
      state.showPopup = true;
    },
    hidePopup(state) {
      state.showPopup = false;
    },
  },
});

// --- ACTIONS ---
export const { showPopup, hidePopup } = navigationSlice.actions;

// --- SELECTORS ---
export const getNavigationState = (state: RootState) => state.navigation;

export default navigationSlice.reducer;

import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../index";

// --- STATE ---
export type NavigationState = {
  showPopup: boolean
}

const initialState: NavigationState = {
  showPopup: false,
}

// --- SLICE ---
export const navigationSlice = createSlice({
  name: 'transaction',
  initialState: initialState,
  reducers: {
    showPopup(state, action: PayloadAction) {
      state.showPopup = true;
    },
    hidePopup(state, action: PayloadAction) {
      state.showPopup = false;
    }
  },
});

// --- ACTIONS ---
export const {
  showPopup,
  hidePopup,
} = navigationSlice.actions;

// --- SELECTORS ---
export const getNavigationState = (state: RootState) => {
  return state.navigation;
}

export default navigationSlice.reducer

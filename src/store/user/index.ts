import {RootState} from "../index";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {LoggedIn, LoginStep, UserState} from "./state";

export * from "./state"
export * from "./actions";

// --- SLICE ---
export const userSlice = createSlice({
  name: 'user',
  initialState: (): UserState => {
    return {step: LoginStep.LOADING}
  },
  reducers: {
    setUserStatus(state, action: PayloadAction<UserState>) {
      return action.payload;
    },
  },
});

// --- ACTIONS ---
export const {
  setUserStatus
} = userSlice.actions;

// --- SELECTORS ---
export const getUserState = (state: RootState) => {
  return state.user;
}

export const getLoggedInUser = (state: RootState) => {
  return (state.user as LoggedIn).account;
}

export default userSlice.reducer

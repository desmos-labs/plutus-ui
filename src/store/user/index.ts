import {RootState} from "store/index";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AccountData} from "@cosmjs/amino";

export * from "store/user/actions";

// --- STATE ---
export interface LoggedOut {
  isLoggedIn: false
  message?: string;
}

export interface LoggedIn {
  isLoggedIn: true
  account: AccountData;
}

export type UserState = LoggedOut | LoggedIn

// --- SLICE ---
export const userSlice = createSlice({
  name: 'user',
  initialState: (): UserState => {
    return {isLoggedIn: false}
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

export default userSlice.reducer

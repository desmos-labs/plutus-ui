import {RootState} from "store/index";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {UserWallet} from "types/cosmos/wallet";

export * from "store/user/actions";

// --- STATE ---
export interface LoggedOut {
  isLoggedIn: false
  message?: string;
}

export interface LoggedIn {
  isLoggedIn: true
  desmosAddress: string;
}

export type UserState = LoggedOut | LoggedIn

// --- SLICE ---
export const userSlice = createSlice({
  name: 'user',
  initialState: (): UserState => {
    const address = UserWallet.getAddress();
    return address ?
      {isLoggedIn: true, desmosAddress: address} :
      {isLoggedIn: false}
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

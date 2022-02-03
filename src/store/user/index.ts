import {RootState} from "store/index";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {UserState} from "types/user";
import UserStorage from "store/user/storage";

export * from "types/user";
export * from "store/user/actions";

// --- SLICE ---
export const userSlice = createSlice({
  name: 'user',
  initialState: (): UserState => {
    return UserStorage.isLoggedIn() ?
      {isLoggedIn: true, desmosAddress: UserStorage.getUserAddress()} :
      {isLoggedIn: false}
  },
  reducers: {
    setUserStatus(state, action: PayloadAction<UserState>) {
      return action.payload;
    },
  },
});

// --- ACTIONS ---
export const {setUserStatus} = userSlice.actions;

// --- SELECTORS ---
export const getUserState = (state: RootState) => {
  return state.user;
}

export default userSlice.reducer

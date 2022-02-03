import {Action, combineReducers, configureStore} from "@reduxjs/toolkit";
import {ThunkAction} from "redux-thunk";
import user from "store/user";
import oAuth from "store/oauth";
import donation from "store/donation";

const rootReducer = combineReducers({
  user: user,
  oAuth: oAuth,
  donation: donation,
})

export const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>
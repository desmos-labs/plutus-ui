import {Action, combineReducers, configureStore} from "@reduxjs/toolkit";
import {ThunkAction} from "redux-thunk";
import user from "store/user";
import donation from "store/donation";
import dashboard from "store/dashboard";

const rootReducer = combineReducers({
  user: user,
  donation: donation,
  dashboard: dashboard,
})

export const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>
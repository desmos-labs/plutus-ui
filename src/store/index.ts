import {Action, combineReducers, configureStore} from "@reduxjs/toolkit";
import {ThunkAction} from "redux-thunk";
import user from "./user";
import donation from "./donation";
import transaction from "./transaction";
import oauth from "./oauth";
import tips from "./tips";
import {ThunkDispatch} from "redux-thunk/src/types";
import integrations from "./integrations";
import navigation from "./navigation";

const rootReducer = combineReducers({
  donation: donation,
  integrations: integrations,
  oauth: oauth,
  navigation: navigation,
  tips: tips,
  transaction: transaction,
  user: user,
})

export const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>
export type AppDispatch = ThunkDispatch<RootState, null, Action<string>>
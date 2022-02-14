import {combineReducers} from "@reduxjs/toolkit";
import root from "./root";
import oAuth from "./oauth"
import tips from "./tips";
import integrations from "./integrations";

const reducer = combineReducers({
  root: root,
  oAuth: oAuth,
  tips: tips,
  integrations: integrations,
})

export default reducer;
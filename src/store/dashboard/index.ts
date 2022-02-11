import {combineReducers} from "@reduxjs/toolkit";
import root from "./root";
import oAuth from "./oauth"
import tips from "./tips";

const reducer = combineReducers({
  root: root,
  oAuth: oAuth,
  tips: tips,
})

export default reducer;
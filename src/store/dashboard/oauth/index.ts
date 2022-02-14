import {combineReducers} from "@reduxjs/toolkit";
import popup from "./popup";
import root from "./root";

const reducer = combineReducers({
  popup: popup,
  root: root,
});

export default reducer;
import {combineReducers} from "@reduxjs/toolkit";
import popup from "store/dashboard/tips/popup";
import root from "store/dashboard/tips/root";

const reducer = combineReducers({
  root: root,
  popup: popup,
})

export default reducer;
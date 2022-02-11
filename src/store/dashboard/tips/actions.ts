import {AppThunk} from "store/index";
import {setStatus, TipsStatus} from "store/dashboard/tips/index";

export function startTipAuthorizationProcess(): AppThunk {
  return dispatch => {
    dispatch(setStatus(TipsStatus.BROADCASTING_TX));

    // TODO
  }
}
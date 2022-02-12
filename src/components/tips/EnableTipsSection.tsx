import EnableTipsPopup from "components/tips/EnableTipsPopup";
import {DashboardStatus, getDashboardState, setStatus} from "store/dashboard/root";
import * as React from "react";
import {useDispatch, useSelector} from "react-redux";

function EnableTipsSection() {
  const rootState = useSelector(getDashboardState);
  const dispatch = useDispatch();

  function handleClickEnableTips() {
    dispatch(setStatus(DashboardStatus.ENABLING_TIPS))
  }

  function handleClosePopup() {
    dispatch(setStatus(DashboardStatus.NOTHING))
  }

  return (
    <div>
      <p className="mt-2">Looks like you have not enabled social tips. Do you want to do it now?</p>
      <button className="mt-2" onClick={handleClickEnableTips}>Enable tips</button>
      <EnableTipsPopup
        visible={rootState.status == DashboardStatus.ENABLING_TIPS}
        onClose={handleClosePopup}
      />
    </div>
  );
}

export default EnableTipsSection;
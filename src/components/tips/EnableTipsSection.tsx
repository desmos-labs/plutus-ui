import EnableTipsPopup from "components/tips/EnableTipsPopup";
import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import {getTipsPopupState, setShown} from "store/dashboard/tips/popup";

/**
 * Represents the section that allows to enable the social tips.
 */
function EnableTipsSection() {
  const popupState = useSelector(getTipsPopupState);
  const dispatch = useDispatch();

  function handleClickEnableTips() {
    dispatch(setShown(true))
  }

  return (
    <div>
      <p>Looks like you have not enabled social tips. Do you want to do it now?</p>
      <button className="mt-2" onClick={handleClickEnableTips}>Enable tips</button>
      <EnableTipsPopup visible={popupState.shown} />
    </div>
  );
}

export default EnableTipsSection;
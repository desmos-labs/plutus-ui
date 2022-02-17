import GrantAmountPopup from "components/tips/GrantAmountPopup";
import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import {getTipsPopupState, setStep, TipsStep} from "../../store/tips";

/**
 * Represents the section that allows to enable the social tips.
 */
function EnableTipsSection() {
  const popupState = useSelector(getTipsPopupState);
  const dispatch = useDispatch();

  function handleClickEnableTips() {
    dispatch(setStep(TipsStep.INPUT_DATA))
  }

  return (
    <div>
      <p>Looks like you have not enabled social tips. Do you want to do it now?</p>
      <button className="mt-2" onClick={handleClickEnableTips}>Enable tips</button>
      <GrantAmountPopup visible={popupState.step != TipsStep.HIDDEN}/>
    </div>
  );
}

export default EnableTipsSection;
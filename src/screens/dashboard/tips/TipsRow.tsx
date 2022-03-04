import DashboardRow from "../components/DashboardRow";
import tipsIcon from "../../../assets/icons/tips.svg";
import * as React from "react";
import PrimaryButton from "../../../components/buttons/PrimaryButton";
import {useDispatch} from "react-redux";
import {setStep, TipsStep} from "../../../store/tips";

function TipsRow() {
  const dispatch = useDispatch();

  function handleClickEnableTips() {
    dispatch(setStep(TipsStep.INPUT_DATA));
  }

  return (
    <div>
      <DashboardRow
        icon={tipsIcon}
        title="Tips"
        text="Enable social tips in order to send DSM on supported social networks"
        button={
          <PrimaryButton disabled onClick={handleClickEnableTips}>
            Coming soon
          </PrimaryButton>
        }
      />
    </div>
  )
}

export default TipsRow
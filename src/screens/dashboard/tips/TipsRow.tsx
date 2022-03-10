import * as React from "react";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import DashboardRow from "../components/DashboardRow";
import tipsIcon from "../../../assets/icons/tips.svg";
import PrimaryButton from "../../../components/buttons/PrimaryButton";
import { showPopup } from "../../../store/tips";

function TipsRow() {
  const dispatch = useDispatch();

  const handleClickEnableTips = useCallback(() => {
    dispatch(showPopup());
  }, []);

  return (
    <div>
      <DashboardRow
        icon={tipsIcon}
        title="Tips"
        text="Enable social tips in order to send DSM on supported social networks"
        button={
          <PrimaryButton
            className="w-full md:w-max-min"
            disabled
            onClick={handleClickEnableTips}
          >
            Coming soon
          </PrimaryButton>
        }
      />
    </div>
  );
}

export default TipsRow;

import React from "react";
import { ReactComponent as SuccessIcon } from "../../../../assets/icons/sucess.svg";
import PrimaryButton from "../../../buttons/PrimaryButton";
import BaseContent from "../../../popups/BaseContent";

function BroadcastingContent() {
  return (
    <BaseContent
      icon={<SuccessIcon className="mx-auto" />}
      title="Broadcasting..."
    >
      <div>
        <p>Broadcasting your transaction on chain...</p>

        <PrimaryButton
          disabled
          className="mt-10 w-full button-red"
          onClick={() => {}}
        >
          Close
        </PrimaryButton>
      </div>
    </BaseContent>
  );
}

export default BroadcastingContent;

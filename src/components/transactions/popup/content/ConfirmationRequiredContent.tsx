import React from "react";
import { useSelector } from "react-redux";
import BaseContent from "../../../popups/BaseContent";
import { getTransactionState } from "../../../../store/transaction";
import TxMessage from "../../messages/TxMessage";
import MemoField from "../../messages/fields/MemoField";

interface ConfirmationRequiredPopupProps {
  readonly onClose: () => void;
}

function ConfirmationRequiredContent({
  onClose,
}: ConfirmationRequiredPopupProps) {
  const state = useSelector(getTransactionState);

  return (
    <BaseContent title="Confirmation required">
      <div>
        <p className="mt-2">
          The following transaction has been sent to DPM in order to be
          confirmed. Please continue there.
        </p>

        <div className="text-left mt-4 space-y-3">
          {state.txBody?.messages?.map((msg) => (
            <TxMessage key={msg.value} msg={msg} />
          ))}

          <MemoField memo={state.txBody?.memo || ""} />
        </div>

        <button
          type="button"
          className="mt-10 w-full button-primary"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </BaseContent>
  );
}

export default ConfirmationRequiredContent;

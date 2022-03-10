import React from "react";
import { useSelector } from "react-redux";
import { ReactComponent as SuccessIcon } from "../../../../assets/icons/sucess.svg";
import { getTxLink } from "../../../utils";
import { getTransactionState } from "../../../../store/transaction";
import PrimaryButton from "../../../buttons/PrimaryButton";
import BaseContent from "../../../popups/BaseContent";

interface SuccessContentProps {
  onClose: () => void;
}

function SuccessContent({ onClose }: SuccessContentProps) {
  const state = useSelector(getTransactionState);
  return (
    <BaseContent
      icon={<SuccessIcon className="mx-auto" />}
      title="Transaction successful!"
    >
      <div>
        <p>
          You can check your transaction{" "}
          <a
            target="_blank"
            href={`${getTxLink(state.txHash)}`}
            rel="noreferrer"
          >
            here
          </a>
        </p>

        <PrimaryButton className="mt-10 w-full" onClick={onClose}>
          Done
        </PrimaryButton>
      </div>
    </BaseContent>
  );
}

export default SuccessContent;

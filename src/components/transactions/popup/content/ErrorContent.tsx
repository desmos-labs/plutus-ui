import React from "react";
import { useSelector } from "react-redux";
import { getTransactionState } from "../../../../store/transaction";
import BaseContent from "../../../popups/BaseContent";
import PrimaryButton from "../../../buttons/PrimaryButton";

interface ErrorContentProps {
  onClose: () => void;
}

function ErrorContent({ onClose }: ErrorContentProps) {
  const state = useSelector(getTransactionState);

  return (
    <BaseContent title="Error">
      <div>
        <p>{state.error}</p>

        <PrimaryButton className="mt-10 w-full" onClick={onClose}>
          Close
        </PrimaryButton>
      </div>
    </BaseContent>
  );
}

export default ErrorContent;

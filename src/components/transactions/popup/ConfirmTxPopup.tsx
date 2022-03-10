import { useDispatch, useSelector } from "react-redux";
import React, { useCallback } from "react";
import Popup from "../../popups/Popup";
import {
  getTransactionState,
  resetTxPopup,
  TransactionStatus,
} from "../../../store/transaction";
import ConfirmationRequiredContent from "./content/ConfirmationRequiredContent";
import BroadcastingContent from "./content/BroadcastingContent";
import SuccessContent from "./content/SuccessContent";
import ErrorContent from "./content/ErrorContent";

/**
 * Represents the popup to confirm a generic tx.
 */
function ConfirmTxPopup() {
  const dispatch = useDispatch();
  const state = useSelector(getTransactionState);

  const handleClosePopup = useCallback(() => {
    dispatch(resetTxPopup());
  }, []);

  return (
    <Popup visible={state.status !== TransactionStatus.NOTHING}>
      <div className="text-center">
        {state.status === TransactionStatus.TX_REQUEST_SENT && (
          <ConfirmationRequiredContent onClose={handleClosePopup} />
        )}

        {state.status === TransactionStatus.BROADCASTING && (
          <BroadcastingContent />
        )}

        {state.status === TransactionStatus.SUCCESS && (
          <SuccessContent onClose={handleClosePopup} />
        )}

        {state.status === TransactionStatus.ERROR && (
          <ErrorContent onClose={handleClosePopup} />
        )}
      </div>
    </Popup>
  );
}

export default ConfirmTxPopup;

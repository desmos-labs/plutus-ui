import { useDispatch, useSelector } from "react-redux";
import React, { useCallback } from "react";
import Popup from "../../popups/Popup";
import {
  getTransactionState,
  resetTxPopup,
  TransactionState,
  TransactionStatus,
} from "../../../store/transaction";
import TxMessage from "../TxMessage";
import { getTxLink } from "../../utils";
import LoadingIcon from "../../LoadingIcon";
import PrimaryButton from "../../buttons/PrimaryButton";

/**
 * Represents the popup to confirm a generic tx.
 */
function ConfirmTxPopup() {
  const dispatch = useDispatch();
  const state = useSelector(getTransactionState);

  /**
   * Returns the proper title and content to be used based on the given state.
   */
  function getTitleAndContent(txState: TransactionState): {
    title: string;
    content: JSX.Element;
  } {
    switch (txState.status) {
      case TransactionStatus.BROADCASTING:
        return {
          title: "Broadcasting transaction",
          content: (
            <div>
              <p>Broadcasting your transaction to the chain...</p>
              <LoadingIcon />
            </div>
          ),
        };

      case TransactionStatus.SUCCESS:
        return {
          title: "Transaction sent successfully",
          content: (
            <p>
              The transaction has been sent successfully. You can check it
              <span> </span>
              <a
                target="_blank"
                href={`${getTxLink(txState.txHash)}`}
                rel="noreferrer"
              >
                here
              </a>
            </p>
          ),
        };

      case TransactionStatus.ERROR:
        return {
          title: "Error",
          content: (
            <p>
              Error while confirming the transaction:
              {txState.error?.toLowerCase()}
            </p>
          ),
        };

      default:
        return {
          title: "Confirmation required",
          content: (
            <div>
              <p>Please confirm the following transaction using DPM:</p>
              <div className="text-left mt-4 px-8 space-y-2">
                {txState.txBody?.messages?.map((msg) => (
                  <TxMessage key={msg.value} msg={msg} />
                ))}

                <div>
                  <p className="font-bold">Memo</p>
                  <p>{txState.txBody?.memo || ""}</p>
                </div>
              </div>
            </div>
          ),
        };
    }
  }

  const handleClosePopup = useCallback(() => {
    dispatch(resetTxPopup());
  }, []);

  const { title, content } = getTitleAndContent(state);

  return (
    <Popup visible={state.status !== TransactionStatus.NOTHING}>
      <div className="text-center">
        <h4 className="mt-2">{title}</h4>

        {content}

        <div className="flex flex-row mt-6 space-x-5">
          {state.status === TransactionStatus.TX_REQUEST_SENT && (
            <button
              type="button"
              className="w-full button-red rounded-lg"
              onClick={handleClosePopup}
            >
              Cancel
            </button>
          )}

          {state.status === TransactionStatus.ERROR && (
            <button
              type="button"
              className="w-full button-red rounded-lg"
              onClick={handleClosePopup}
            >
              Close
            </button>
          )}

          {state.status === TransactionStatus.BROADCASTING && (
            <PrimaryButton
              disabled
              className="w-full button-red rounded-lg"
              onClick={handleClosePopup}
            >
              Close
            </PrimaryButton>
          )}

          {state.status === TransactionStatus.SUCCESS && (
            <PrimaryButton
              className="w-full rounded-lg"
              onClick={handleClosePopup}
            >
              Done
            </PrimaryButton>
          )}
        </div>
      </div>
    </Popup>
  );
}

export default ConfirmTxPopup;

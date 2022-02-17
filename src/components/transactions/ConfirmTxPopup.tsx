import Popup from "../Popup";
import {useDispatch, useSelector} from "react-redux";
import {getTransactionState, resetTxPopup, TransactionState, TransactionStatus} from "../../store/transaction";
import * as React from "react";
import TxMessage from "../transactions/TxMessage";
import {getTxLink} from "../utils";
import LoadingIcon from "../LoadingIcon";

/**
 * Represents the popup to confirm a generic tx.
 */
function ConfirmTxPopup() {
  const dispatch = useDispatch();
  const state = useSelector(getTransactionState);

  /**
   * Returns the proper title and content to be used based on the given state.
   */
  function getTitleAndContent(state: TransactionState): { title: string, content: JSX.Element } {
    switch (state.status) {


      case TransactionStatus.BROADCASTING:
        return {
          title: 'Broadcasting transaction',
          content: <div>
            <p>Broadcasting your transaction to the chain...</p>
            <LoadingIcon/>
          </div>
        }


      case TransactionStatus.SUCCESS:
        return {
          title: 'Transaction sent successfully',
          content: <p>
            The transaction has been sent successfully. You can check it
            <span> </span><a target="_blank" href={`${getTxLink(state.txHash)}`}>here</a>
          </p>
        }

      case TransactionStatus.ERROR:
        return {
          title: 'Error',
          content: <p>Error while confirming the transaction: {state.error?.toLowerCase()}</p>
        }

      default:
        return {
          title: 'Confirmation required',
          content: <div>
            <p>Please confirm the following transaction using DPM:</p>
            <div className="mt-4 px-8">
              {state.txBody?.messages?.map((msg) => <TxMessage key={msg.value} msg={msg}/>)}
            </div>
          </div>
        }
    }
  }

  function handleClosePopup() {
    dispatch(resetTxPopup());
  }

  const {title, content} = getTitleAndContent(state);

  return (
    <Popup visible={state.status != TransactionStatus.NOTHING}>
      <div className="text-center">
        <h4 className="mt-2">{title}</h4>
        {content}

        <div className="flex flex-row mt-6">
          {state.status == TransactionStatus.TX_REQUEST_SENT &&
            <button className="w-full button-red rounded-lg" onClick={handleClosePopup}>Cancel</button>
          }

          {state.status == TransactionStatus.ERROR &&
            <button className="w-full button-red rounded-lg" onClick={handleClosePopup}>Close</button>
          }

          {state.status == TransactionStatus.BROADCASTING &&
            <button disabled={true} className="w-full button-red rounded-lg" onClick={handleClosePopup}>Close</button>
          }

          {state.status == TransactionStatus.SUCCESS &&
            <button className="w-full rounded-lg" onClick={handleClosePopup}>Done</button>
          }
        </div>

      </div>
    </Popup>
  )
}

export default ConfirmTxPopup;
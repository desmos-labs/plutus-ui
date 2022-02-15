import Popup from "components/Popup";
import * as React from "react";
import {ChangeEvent} from "react";
import {ReactComponent as Icon} from "assets/authorization.svg";
import {useDispatch, useSelector} from "react-redux";
import {getTipsPopupState, resetTipsPopup, setGrantAmount, TipsPopupStep} from "store/dashboard/tips/popup";
import {startTipAuthorizationProcess} from "store/dashboard/tips/popup/actions";
import {getTxLink} from "types/cosmos/chain";

type EnableTipsPopupProps = {
  visible: boolean,
}

/**
 * Represents the popup that is shown to the user when they want to enable social tips.
 */
function EnableTipsPopup({visible}: EnableTipsPopupProps) {
  const state = useSelector(getTipsPopupState);
  const dispatch = useDispatch();

  /**
   * Returns the proper title and content for the given step.
   * @param step {TipsPopupStep}: Current step of the popup.
   */
  function getTitleAndContent(step: TipsPopupStep): { title: string, content: JSX.Element } {
    switch (step) {
      case TipsPopupStep.CONFIRMATION_REQUIRED:
        return {
          title: 'Confirmation required',
          content: <p>Please confirm the transaction using DPM</p>
        }
      case TipsPopupStep.ERROR:
        return {
          title: 'Error',
          content: <p>{state.error || ''}</p>,
        }
      case TipsPopupStep.SUCCESS:
        return {
          title: 'Success',
          content: <p>
            The authorization has been granted successfully. You can check the transaction
            <span> </span><a target="_blank" href={`${getTxLink(state.txHash)}`}>here</a>
          </p>
        }
      default:
        return {
          title: 'Grant required',
          content: <p>
            In order to enable social tips you need to grant DesmosTipBot the authorization to send
            tokens on your behalf. Once the authorization is granted, DesmosTipBot will be able to send DSM using
            your balance when you want to tip someone on centralized social networks. How many DSM would you like
            to grant the authorization for?
          </p>
        }
    }
  }

  /**
   * Handles the change of the amount to be granted.
   */
  function handleGrantAmountChanged(e: ChangeEvent<HTMLInputElement>) {
    dispatch(setGrantAmount(e.target.value));
  }

  /**
   * Handles the click on the grant button.
   */
  function onClickGrant() {
    const amount = parseFloat(state.grantAmount) || 10;
    dispatch(startTipAuthorizationProcess(amount));
  }

  /**
   * Handles the closing of the popup.
   */
  function handleClosePopup() {
    dispatch(resetTipsPopup());
  }

  const {title, content} = getTitleAndContent(state.step);

  return (
    <Popup visible={visible}>
      <div className="text-center">
        <Icon className="mx-auto w-10 h-10"/>
        <h4 className="mt-2">{title}</h4>
        {content}

        {state.step == TipsPopupStep.DEFAULT &&
          <div className="mt-4 flex flex-row">
            <input className="w-full" type="number" value={state.grantAmount} onChange={handleGrantAmountChanged}/>
            <p className="mx-3 my-auto">DSM</p>
          </div>
        }

        <div className="flex flex-row mt-6">
          {state.step != TipsPopupStep.SUCCESS &&
            <button className="w-full button-red rounded-lg" onClick={handleClosePopup}>Cancel</button>
          }
          {state.step == TipsPopupStep.DEFAULT &&
            <button className="ml-5 w-full button-yellow rounded-lg" onClick={onClickGrant}>Grant</button>
          }
          {state.step == TipsPopupStep.ERROR &&
            <button className="ml-5 w-full button-yellow rounded-lg" onClick={onClickGrant}>Retry</button>
          }
          {state.step == TipsPopupStep.SUCCESS &&
            <button className="w-full rounded-lg" onClick={handleClosePopup}>Done</button>
          }

        </div>
      </div>
    </Popup>
  );
}

export default EnableTipsPopup;
import Popup from "components/Popup";
import * as React from "react";
import {ChangeEvent} from "react";
import {ReactComponent as Icon} from "assets/authorization.svg";
import {useDispatch, useSelector} from "react-redux";
import {getTipsState, setGrantAmount, TipsStatus} from "store/dashboard/tips";
import {startTipAuthorizationProcess} from "store/dashboard/tips/actions";
import {useAuth} from "components/auth/AuthProvider";
import {LoggedIn} from "store/user";

const EXPLORER_URL = process.env.REACT_APP_EXPLORER_ENDPOINT as string;

type EnableTipsPopupProps = {
  visible: boolean,
  onClose: () => void,
}

/**
 * Represents the popup that is shown to the user when they want to enable social tips.
 */
function EnableTipsPopup({visible, onClose}: EnableTipsPopupProps) {
  const state = useSelector(getTipsState);
  const dispatch = useDispatch();

  const userStatus = useAuth().userState as LoggedIn;

  function getTitleAndContent(status: TipsStatus): { title: string, content: JSX.Element } {
    switch (status) {
      case TipsStatus.BROADCASTING_TX:
        return {
          title: 'Confirmation required',
          content: <p>Please confirm the transaction using DPM</p>
        }
      case TipsStatus.ERROR:
        return {
          title: 'Error',
          content: <p>state.error || ''</p>,
        }
      case TipsStatus.SUCCESS:
        return {
          title: 'Success',
          content: <p>
            The authorization has been granted successfully. You can check the transaction
            <span> </span><a target="_blank" href={`${EXPLORER_URL}/transactions/${state.txHash}`}>here</a>
          </p>
        }
      default:
        return {
          title: 'Grant required',
          content: <p>
            In order to enable social tips you need to grant DesmosTipBot the authorization to send
            tokens on your behalf. Once that authorization is granted, DesmosTipBot will be able to send DSM using
            your balance when you want to tip someone on centralized social networks. How many DSM would you like
            to grant the authorization for?
          </p>
        }
    }
  }

  function handleGrantAmountChanged(e: ChangeEvent<HTMLInputElement>) {
    dispatch(setGrantAmount(e.target.value));
  }

  function onClickGrant() {
    dispatch(startTipAuthorizationProcess({
      granter: userStatus.desmosAddress,
      amount: parseFloat(state.grantAmount) || 10,
    }));
  }

  const {title, content} = getTitleAndContent(state.status);

  return (
    <Popup visible={visible}>
      <div className="p-6 text-center">
        <Icon className="mx-auto w-10 h-10"/>
        <h4 className="mt-2">{title}</h4>
        {content}

        {state.status == TipsStatus.DEFAULT &&
          <div className="mt-4 flex flex-row">
            <input className="w-full" type="number" value={state.grantAmount} onChange={handleGrantAmountChanged}/>
            <p className="mx-3 my-auto">DSM</p>
          </div>
        }

        <div className="flex flex-row mt-4">
          {state.status != TipsStatus.SUCCESS &&
            <button className="w-full button-red rounded-lg" onClick={onClose}>Cancel</button>
          }
          {state.status == TipsStatus.DEFAULT &&
            <button className="ml-5 w-full button-yellow rounded-lg" onClick={onClickGrant}>Grant</button>
          }
          {state.status == TipsStatus.ERROR &&
            <button className="ml-5 w-full button-yellow rounded-lg" onClick={onClickGrant}>Retry</button>
          }
          {state.status == TipsStatus.SUCCESS &&
            <button className="w-full rounded-lg" onClick={onClose}>Done</button>
          }

        </div>
      </div>
    </Popup>
  );
}

export default EnableTipsPopup;
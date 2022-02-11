import Popup from "components/Popup";
import * as React from "react";
import {ReactComponent as Icon} from "assets/authorization.svg";
import {useDispatch, useSelector} from "react-redux";
import {getTipsState, TipsStatus} from "store/dashboard/tips";
import {startTipAuthorizationProcess} from "store/dashboard/tips/actions";

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

  function getTitleAndContent(): { title: string, content: string } {
    switch (state.status) {
      case TipsStatus.BROADCASTING_TX:
        return {
          title: 'Confirmation required',
          content: 'Please confirm the transaction using DPM'
        }
      default:
        return {
          title: 'Authorization required',
          content: `In order to enable social tips you need to grant DesmosTipBot the authorization to sign 
          transactions on your behalf. Would you like to proceed now?`
        }
    }
  }

  function onClickStartProcess() {
    dispatch(startTipAuthorizationProcess());
  }

  const {title, content} = getTitleAndContent();

  return (
    <Popup visible={visible}>
      <div className="p-6 text-center">
        <Icon className="mx-auto w-10 h-10"/>
        <h4 className="mt-2">{title}</h4>
        <p>{content}</p>

        <div className="flex flex-row mt-4">
          <button className="w-full button-red rounded-lg" onClick={onClose}>Cancel</button>

          {state.status == TipsStatus.DEFAULT &&
            <button className="ml-5 w-full button-yellow rounded-lg" onClick={onClickStartProcess}>Proceed</button>
          }
          {state.status == TipsStatus.ERROR &&
            <button className="ml-5 w-full button-yellow rounded-lg" onClick={onClickStartProcess}>Retry</button>
          }

        </div>
      </div>
    </Popup>
  );
}

export default EnableTipsPopup;
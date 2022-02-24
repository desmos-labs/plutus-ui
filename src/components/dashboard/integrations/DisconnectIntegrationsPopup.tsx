import Popup from "../../Popup";
import {useDispatch, useSelector} from "react-redux";
import {
  disconnect,
  getIntegrationsPopupState,
  IntegrationPopupStep,
  resetIntegrationsPopup
} from "../../../store/integrations";
import * as React from "react";

function DisconnectIntegrationsPopup() {
  const dispatch = useDispatch();
  const state = useSelector(getIntegrationsPopupState);

  function getTitleAndContent(step: IntegrationPopupStep): { title: string, content: JSX.Element } {
    switch (step) {
      case IntegrationPopupStep.CONFIRMATION_REQUESTED:
        return {
          title: `Disconnect from ${state.platform.toString()}`,
          content: <p>
            You are disconnecting your account from {state.platform.toString()}.
            This will stop all future notifications for donations made through DesmosTipBot.
            Do you want to continue?
          </p>
        }

      case IntegrationPopupStep.TX_REQUEST_SENT:
        return {
          title: 'Authentication requested',
          content: <p>
            In order to make sure it's you, we have sent a fake transaction to be signed to your DPM app.
            Please make sure you sign it in order to continue.
          </p>
        }

      case IntegrationPopupStep.DISCONNECTING:
        return {
          title: 'Disconnecting',
          content: <p>
            We are disconnecting you from {state.platform.toString()}...
          </p>
        }

      case IntegrationPopupStep.DISCONNECTED:
        return {
          title: 'Disconnected',
          content: <p>
            You have successfully disconnected your account from {state.platform.toString()}!
          </p>
        }

      default:
        return {
          title: 'Error',
          content: <p>{state.error}</p>
        }
    }
  }

  function handleClickContinue() {
    dispatch(disconnect(state.platform));
  }

  function handleClosePopup() {
    dispatch(resetIntegrationsPopup());
  }

  const {title, content} = getTitleAndContent(state.step);
  return (
    <Popup visible={state.step != IntegrationPopupStep.NOTHING}>
      <div className="text-center">
        <h4>{title}</h4>
        {content}

        {state.step == IntegrationPopupStep.CONFIRMATION_REQUESTED &&
          <div className="flex flex-row mt-6 space-x-5">
            <button className="w-full button-red rounded-lg" onClick={handleClosePopup}>Cancel</button>
            <button className="w-full rounded-lg" onClick={handleClickContinue}>Continue</button>
          </div>
        }

        {state.step == IntegrationPopupStep.TX_REQUEST_SENT &&
          <button className="w-full button-red rounded-lg" onClick={handleClosePopup}>Cancel</button>
        }

        {state.step == IntegrationPopupStep.DISCONNECTING &&
          <button disabled className="w-full rounded-lg" onClick={handleClosePopup}>Done</button>
        }

        {state.step == IntegrationPopupStep.DISCONNECTED &&
          <button className="w-full rounded-lg" onClick={handleClosePopup}>Done</button>
        }

        {state.step == IntegrationPopupStep.ERROR &&
          <button className="w-full button-red rounded-lg" onClick={handleClosePopup}>Close</button>
        }

      </div>
    </Popup>
  );
}

export default DisconnectIntegrationsPopup;
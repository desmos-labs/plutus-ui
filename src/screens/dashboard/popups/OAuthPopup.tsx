import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import history from "history/browser";
import { useSearchParams } from "react-router-dom";
import { useCallback, useEffect } from "react";
import {
  getOAuthPopupState,
  initOAuthPopupState,
  OAuthPopupStatus,
  resetOAuthPopup,
  finalizeOAuth,
} from "../../../store/oauth";
import Popup from "../../../components/popups/Popup";
import LoadingIcon from "../../../components/LoadingIcon";
import PrimaryButton from "../../../components/buttons/PrimaryButton";

/**
 * Represents the page that is called from OAuth as the callback.
 */
function OAuthPopup() {
  const dispatch = useDispatch();
  const state = useSelector(getOAuthPopupState);

  // Get the params sent using OAuth
  const [searchParams] = useSearchParams();
  const oAuthCode = searchParams.get("code");
  const oAuthState = searchParams.get("state");
  const oAuthError = searchParams.get("error");

  useEffect(() => {
    dispatch(
      initOAuthPopupState({
        oAuthCode,
        oAuthState,
        oAuthError,
      })
    );
  }, [false]);

  function onClose() {
    // Remove the search params (code and state)
    history.replace({});
  }

  /**
   * Returns the title and content to be used based on the given status.
   */
  function getTitleAndContent(status: OAuthPopupStatus): {
    title: string;
    content: JSX.Element;
  } {
    switch (status) {
      case OAuthPopupStatus.INITIALIZED:
        return {
          title: "Login successful",
          content: (
            <div>
              <p>
                You have successfully logged in using{" "}
                {state.data?.platform.toString()}. Now we need to make sure
                it&apos;s you. Clicking the following button will prompt you to
                sign a fake transaction used to authenticate you.
              </p>
            </div>
          ),
        };

      case OAuthPopupStatus.REQUESTED_SIGNATURE:
        return {
          title: "Signature requested",
          content: (
            <p>
              A fake transaction has been sent to your DPM. Please sign it in
              order to authenticate yourself and complete the linkage.
            </p>
          ),
        };

      case OAuthPopupStatus.VERIFYING:
        return {
          title: "Verifying the signature",
          content: (
            <div>
              <p>Verifying the fake transaction to make sure it&apos;s you.</p>
              <LoadingIcon />
            </div>
          ),
        };

      case OAuthPopupStatus.ERROR: {
        if (state.error === "access_denied") {
          return {
            title: "Request denied",
            content: <p>You have denied the request</p>,
          };
        }

        return {
          title: "Error",
          content: <p>{state.error}</p>,
        };
      }

      case OAuthPopupStatus.CONNECTED:
        return {
          title: "Connected",
          content: (
            <p>
              You have successfully connected {state.data?.platform.toString()}!
              From now on, you will receive alerts for donations made through
              DesmosTipBot.
            </p>
          ),
        };

      default:
        return { title: "", content: <div /> };
    }
  }

  /**
   * Handles the click on the verify button.
   */
  const handleClickVerify = useCallback(() => {
    dispatch(finalizeOAuth(state.oAuthCode, state.data));
  }, []);

  const closePopup = useCallback(() => {
    onClose();
    dispatch(resetOAuthPopup());
  }, []);

  const { title, content } = getTitleAndContent(state.status);

  return (
    <Popup visible={state.status !== OAuthPopupStatus.NOTHING}>
      <div>
        <h4 className="mt-2">{title}</h4>
        {content}

        <div className="mt-6">
          {state.status === OAuthPopupStatus.INITIALIZED && (
            <div className="flex flex-row space-x-5">
              <button
                type="button"
                className="button-red w-full rounded-lg"
                onClick={closePopup}
              >
                Cancel
              </button>
              <PrimaryButton
                className="w-full rounded-lg"
                onClick={handleClickVerify}
              >
                Continue
              </PrimaryButton>
            </div>
          )}
          {state.status === OAuthPopupStatus.REQUESTED_SIGNATURE && (
            <button
              type="button"
              className="button-red w-full rounded-lg"
              onClick={closePopup}
            >
              Cancel
            </button>
          )}
          {state.status === OAuthPopupStatus.ERROR && (
            <PrimaryButton
              className="button-red w-full rounded-lg"
              onClick={closePopup}
            >
              Close
            </PrimaryButton>
          )}
          {state.status === OAuthPopupStatus.VERIFYING && (
            <button
              type="button"
              className="button-red w-full rounded-lg"
              onClick={closePopup}
            >
              Cancel
            </button>
          )}
          {state.status === OAuthPopupStatus.CONNECTED && (
            <PrimaryButton className="w-full rounded-lg" onClick={closePopup}>
              Done
            </PrimaryButton>
          )}
        </div>
      </div>
    </Popup>
  );
}

export default OAuthPopup;

import * as React from "react"
import {useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getOAuthState} from "store/oauth";
import {finalizeOAuth} from "store/oauth/actions";
import {OAuthStatus} from "types/oauth";

/**
 * Represents the page that is called from OAuth as the callback.
 */
function OAuthCallback() {
  const dispatch = useDispatch();
  const state = useSelector(getOAuthState);

  // Get the params sent using OAuth
  const [searchParams] = useSearchParams();
  const oAuthCode = searchParams.get('code') as string | null;
  const oAuthState = searchParams.get('state') as string | null;

  function handleVerifyClick() {
    dispatch(finalizeOAuth(oAuthCode, oAuthState))
  }

  return (
    <div className="p-[10px]">
      <p>You have successfully logged in using Streamlabs.</p>
      <p>Now we need to make sure it's you.</p>
      <p>Clicking the following button will prompt you to sign a fake transaction used to authenticate you.</p>
      <button className="btn-orange" onClick={handleVerifyClick}>Verify with DPM</button>

      {state.status == OAuthStatus.LOADING &&
        <p>Loading...</p>
      }

      {state.status == OAuthStatus.REQUESTING_SIGNATURE &&
        <p>Please confirm the transaction using DPM</p>
      }

      {state.status == OAuthStatus.ERROR &&
        <p>Error: {state.error}</p>
      }

      {state.status == OAuthStatus.CONNECTED &&
        <p>Your account has been linked successfully!</p>
      }
    </div>
  );
}

export default OAuthCallback;
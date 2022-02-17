import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Platform} from "types/oauth";
import {getLoggedInUser, logout} from "store/user";
import {useEffect} from "react";
import EnableTipsSection from "components/tips/EnableTipsSection";
import TipsEnabledSection from "components/tips/TipsEnabledSection";
import {useSearchParams} from "react-router-dom";
import OAuthPopup from "components/oauth/OAuthPopup";
import {initOAuthPopupState, startAuthorization} from "../store/oauth";
import {getDisplayName} from "../components/utils";
import {isZero} from "../types";

/**
 * Represents the dashboard of the app for logged in users.
 * @returns {JSX.Element}
 * @constructor
 */
function DashboardPage() {
  const dispatch = useDispatch();

  // Get the user state
  const user = useSelector(getLoggedInUser);

  // Get the params sent using OAuth
  const [searchParams] = useSearchParams();
  const oAuthCode = searchParams.get('code') as string | undefined;
  const oAuthState = searchParams.get('state') as string | undefined;

  useEffect(() => {
    dispatch(initOAuthPopupState({
      oAuthCode: oAuthCode,
      oAuthState: oAuthState,
    }));
  }, [false])

  function handleClickStreamlabs() {
    dispatch(startAuthorization(Platform.STREAMLABS));
  }

  function handleClickLogout() {
    dispatch(logout());
  }

  return (
    <div>
      <h3 className="mt-3">Account</h3>
      <p>You are currently logged in as {getDisplayName(user.profile)}.</p>
      <button className="mt-2" onClick={handleClickLogout}>Logout</button>

      <h3 className="mt-8">Integrations</h3>
      <OAuthPopup/>
      <p>
        Do you want to received Streamlabs alerts for upcoming donations?
        Connect your Streamlabs account now!
      </p>
      <button className="mt-2" onClick={handleClickStreamlabs}>Connect Streamlabs</button>

      <h3 className="mt-8">Social tips</h3>
      {isZero(user.grantedAmount) ?
        <EnableTipsSection/> :
        <TipsEnabledSection grantedAmount={user.grantedAmount}/>
      }
    </div>
  );
}

export default DashboardPage;
import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Platform} from "types/oauth";
import {getLoggedInUser, logout} from "store/user";
import {useEffect} from "react";
import EnableTipsSection from "components/tips/EnableTipsSection";
import TipsEnabledSection from "components/tips/TipsEnabledSection";
import {useLocation, useSearchParams} from "react-router-dom";
import history from "history/browser";
import OAuthPopup from "components/oauth/OAuthPopup";
import {initOAuthPopupState, startAuthorization} from "../store/oauth";
import {getDisplayName} from "../components/utils";
import {isZero} from "../types";
import IntegrationsSection from "../components/integrations/IntegrationsSection";

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
  const oAuthCode = searchParams.get('code');
  const oAuthState = searchParams.get('state');
  const oAuthError = searchParams.get('error');

  useEffect(() => {
    dispatch(initOAuthPopupState({
      oAuthCode: oAuthCode,
      oAuthState: oAuthState,
      oAuthError: oAuthError,
    }));
  }, [false])

  function onOAuthClose() {
    // Remove the search params (code and state)
    history.replace({})
  }

  function handleClickLogout() {
    dispatch(logout());
  }

  return (
    <div>
      <h3 className="mt-3">Account</h3>
      <p>You are currently logged in as {getDisplayName(user.profile)}.</p>
      <button className="mt-2 button-red text-sm" onClick={handleClickLogout}>Logout</button>

      <IntegrationsSection />
      <OAuthPopup onClose={onOAuthClose}/>

      <h3 className="mt-8">Social tips</h3>
      {isZero(user.grantedAmount) ?
        <EnableTipsSection/> :
        <TipsEnabledSection grantedAmount={user.grantedAmount}/>
      }
    </div>
  );
}

export default DashboardPage;
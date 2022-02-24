import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import {getLoggedInUser} from "store/user";
import {useEffect} from "react";
import EnableTipsSection from "components/dashboard/tips/EnableTipsSection";
import TipsEnabledSection from "components/dashboard/tips/TipsEnabledSection";
import {useSearchParams} from "react-router-dom";
import history from "history/browser";
import OAuthPopup from "components/oauth/OAuthPopup";
import {initOAuthPopupState} from "../store/oauth";
import {getDisplayName} from "../components/utils";
import {isZero} from "../types";
import IntegrationsSection from "../components/dashboard/integrations/IntegrationsSection";

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

  return (
    <div>
      <h1 className="mt-3">Dashboard</h1>
      <p>
        Welcome, {getDisplayName(user.profile)}.
        From here you can manage your settings within DesmosTipBot.
      </p>

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
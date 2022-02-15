import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import {startAuthorization} from "store/dashboard/oauth/root/actions";
import {Platform} from "types/oauth";
import {logout} from "store/user";
import {useEffect} from "react";
import {getTipsState} from "store/dashboard/tips/root";
import EnableTipsSection from "components/tips/EnableTipsSection";
import TipsEnabledSection from "components/tips/TipsEnabledSection";
import {initState} from "store/dashboard/root/actions";
import {DashboardStatus, getDashboardState} from "store/dashboard/root";
import {getDisplayName} from "types/desmos";
import LoadingPage from "screens/LoadingPage";
import {useSearchParams} from "react-router-dom";
import OAuthPopup from "components/oauth/OAuthPopup";

/**
 * Represents the dashboard of the app for logged in users.
 * @returns {JSX.Element}
 * @constructor
 */
function DashboardPage() {
  const dispatch = useDispatch();

  const rootState = useSelector(getDashboardState);
  const tipsState = useSelector(getTipsState);

  // Get the params sent using OAuth
  const [searchParams] = useSearchParams();
  const oAuthCode = searchParams.get('code') as string | undefined;
  const oAuthState = searchParams.get('state') as string | undefined;

  useEffect(() => {
    dispatch(initState({
      oAuthParams: {oAuthCode: oAuthCode, oAuthState: oAuthState},
    }));
  }, [false])

  function handleClickStreamlabs() {
    dispatch(startAuthorization(Platform.STREAMLABS));
  }

  function handleClickLogout() {
    dispatch(logout());
  }

  if (rootState.status == DashboardStatus.LOADING) {
    return <LoadingPage/>;
  }

  return (
    <div>
      <h3 className="mt-3">Account</h3>
      <p>You are currently logged in as {getDisplayName(rootState.userProfile)}.</p>
      <button className="mt-2" onClick={handleClickLogout}>Logout</button>

      <h3 className="mt-8">Integrations</h3>
      <OAuthPopup />
      <p>
        Do you want to received Streamlabs alerts for upcoming donations?
        Connect your Streamlabs account now!
      </p>
      <button className="mt-2" onClick={handleClickStreamlabs}>Connect Streamlabs</button>

      <h3 className="mt-8">Social tips</h3>
      {tipsState.grantedAmount ?
        <TipsEnabledSection grantedAmount={tipsState.grantedAmount}/> :
        <EnableTipsSection/>}
    </div>
  );
}

export default DashboardPage;
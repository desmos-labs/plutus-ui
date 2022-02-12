import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import {startAuthorization} from "store/dashboard/oauth/actions";
import {useAuth} from "components/auth/AuthProvider";
import {Platform} from "types/oauth";
import {LoggedIn, logout} from "store/user";
import {useEffect} from "react";
import {fetchGrantedAmount} from "store/dashboard/tips/actions";
import {getTipsState} from "store/dashboard/tips";
import EnableTipsSection from "components/tips/EnableTipsSection";
import TipsEnabledSection from "components/tips/TipsEnabledSection";

/**
 * Represents the dashboard of the app for logged in users.
 * @returns {JSX.Element}
 * @constructor
 */
function DashboardPage() {
  const tipsState = useSelector(getTipsState);
  const userState = useAuth().userState as LoggedIn;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGrantedAmount(userState.desmosAddress));
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
      <p>You are currently logged in as {userState.desmosAddress}.</p>
      <button className="mt-2" onClick={handleClickLogout}>Logout</button>

      <h3 className="mt-8">Integrations</h3>
      <p className="mt-2">
        Do you want to received Streamlabs alerts for upcoming donations?
        Connect your Streamlabs account now!
      </p>
      <button className="mt-2" onClick={handleClickStreamlabs}>Connect Streamlabs</button>

      <h3 className="mt-8">Social tips</h3>
      {tipsState.grantedAmount == 0 ?
        <EnableTipsSection/> :
        <TipsEnabledSection/>
      }

    </div>
  );
}

export default DashboardPage;
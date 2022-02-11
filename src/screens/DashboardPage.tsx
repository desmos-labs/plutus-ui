import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import {startAuthorization} from "store/dashboard/oauth/actions";
import {useAuth} from "components/auth/AuthProvider";
import {Platform} from "types/oauth";
import {LoggedIn, logout} from "store/user";
import {useNavigate} from "react-router-dom";
import EnableTipsPopup from "components/tips/EnableTipsPopup";
import {DashboardStatus, getDashboardState, setStatus} from "store/dashboard/root";

/**
 * Represents the dashboard of the app for logged in users.
 * @returns {JSX.Element}
 * @constructor
 */
function DashboardPage() {
  const state = useSelector(getDashboardState);

  const navigate = useNavigate();
  const userState = useAuth().userState as LoggedIn;

  const dispatch = useDispatch();

  function handleClickStreamlabs() {
    dispatch(startAuthorization(Platform.STREAMLABS));
  }

  function handleClickLogout() {
    dispatch(logout());
  }

  function handleClickEnableTips() {
    dispatch(setStatus(DashboardStatus.ENABLING_TIPS))
  }

  function handleClosePopup() {
    dispatch(setStatus(DashboardStatus.NOTHING))
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
      <p className="mt-2">Looks like you have not enabled social tips. Do you want to do it now?</p>
      <button className="mt-2" onClick={handleClickEnableTips}>Enable tips</button>
      <EnableTipsPopup
        visible={state.status == DashboardStatus.ENABLING_TIPS}
        onClose={handleClosePopup}
      />

    </div>
  );
}

export default DashboardPage;
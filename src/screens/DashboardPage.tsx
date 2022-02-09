import * as React from "react";
import {LoggedIn} from "types/user";
import {useDispatch} from "react-redux";
import {startAuthorization} from "store/oauth/actions";
import {useAuth} from "components/AuthProvider";
import {Platform} from "types/oauth";
import {logout} from "store/user";
import {Link} from "react-router-dom";

/**
 * Represents the dashboard of the app for logged in users.
 * @returns {JSX.Element}
 * @constructor
 */
function DashboardPage() {
  // Get the user data
  const userState = useAuth().userState as LoggedIn;

  const dispatch = useDispatch();

  function handleClickStreamlabs() {
    dispatch(startAuthorization(Platform.STREAMLABS));
  }

  function handleClickLogout() {
    dispatch(logout());
  }

  return (
    <div className="p-[10px]">
      <p>Welcome {userState.desmosAddress}</p>

      <h2 className="mt-3 text-xl">Integrations</h2>
      <p className="mt-2">Connect your Streamlabs account now</p>
      <button className="btn-orange" onClick={handleClickStreamlabs}>
        Connect Streamlabs
      </button>

      <p className="mt-2">Looks like you have not enabled social tips. Do you want to do it now?</p>
      <Link to="/tips" className="btn-orange">
        Enable tips
      </Link>

      <h2 className="mt-3 text-xl">Account</h2>
      <p className="">Logout from your account</p>
      <button className="btn-orange" onClick={handleClickLogout}>
        Logout
      </button>
    </div>
  );
}

export default DashboardPage;
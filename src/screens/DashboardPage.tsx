import * as React from "react";
import {LoggedIn} from "types/user";
import {useDispatch} from "react-redux";
import {startAuthorization} from "store/oauth/actions";
import {useAuth} from "components/AuthProvider";
import {Platform} from "types/oauth";
import {logout} from "store/user";

/**
 * Represents the home screen of the app.
 * @returns {JSX.Element}
 * @constructor
 */
const DashboardPage: React.FC = () => {
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

      <p className="mt-2">Connect your Streamlabs account now</p>
      <button className="btn-orange" onClick={handleClickStreamlabs}>
        Connect Streamlabs
      </button>


      <p className="mt-2">Logout from your account</p>
      <button className="btn-orange" onClick={handleClickLogout}>
        Logout
      </button>
    </div>
  );
}

export default DashboardPage;
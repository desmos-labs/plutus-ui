import * as React from "react";
import {useSelector} from "react-redux";
import {getUserState, LoggedIn} from "store/user";
import {useLocation, Navigate} from "react-router-dom";


/**
 * Represents the root of the application that renders the screen based on the current state of the user.
 * @constructor
 */
function RequireAuth({children}: { children: JSX.Element }) {
  const state = useSelector(getUserState);
  const location = useLocation();

  if (!state.isLoggedIn) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{from: location}} replace/>
  }

  return children;
}

export default RequireAuth;
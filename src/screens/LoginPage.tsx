import * as React from 'react';
import {getUserState, LoggedOut} from "store/user";
import {useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "components/AuthProvider";
import {useSelector} from "react-redux";

/**
 * Represents the screen used to log into the application.
 * @constructor
 */
const LoginPage: React.FC = () => {
  const loginState = useSelector(getUserState);

  const navigate = useNavigate();
  const location = useLocation();

  // Get the path from where we are redirected
  const state = location.state as { from?: { pathname?: string } };
  const from = state?.from?.pathname || '/dashboard';

  const auth = useAuth();
  if (auth.userState.isLoggedIn) {
    goToFrom();
  }

  function goToFrom() {
    // Send them back to the page they tried to visit when they were
    // redirected to the login page. Use { replace: true } so we don't create
    // another entry in the history stack for the login page.  This means that
    // when they get to the protected page and click the back button, they
    // won't end up back on the login page, which is also really nice for the
    // user experience.
    navigate(from, {replace: true});
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    auth.performLogin(goToFrom);
  }

  return (
    <div>
      <h1>Login inside Desmos Tip Bot!</h1>

      <form onSubmit={handleSubmit}>
        <button type="submit" className="btn-orange">
          Login
        </button>
      </form>

      {!loginState.isLoggedIn && loginState.message &&
        <p>Error: {loginState.message}</p>
      }
    </div>
  );
}

export default LoginPage;
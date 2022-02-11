import * as React from 'react';
import {getUserState} from "store/user";
import {useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "components/auth/AuthProvider";
import {useSelector} from "react-redux";

/**
 * Represents the screen used to log into the application.
 * @constructor
 */
function LoginPage() {
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

  function handleSubmit(event: React.FormEvent<HTMLButtonElement>) {
    event.preventDefault();
    auth.performLogin(goToFrom);
  }

  return (
    <div className="pt-20 text-center">
      <h1>Login</h1>
      <button className="mt-10 btn-orange" onClick={handleSubmit}>
        Login with WalletConnect
      </button>

      {!loginState.isLoggedIn && loginState.message &&
        <p>Error: {loginState.message}</p>
      }
    </div>
  );
}

export default LoginPage;
import * as React from "react"
import {useEffect} from "react"
import {useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getOAuthState} from "store/oauth";
import {sendAuthorizationCode} from "store/oauth/actions";
import {Platform} from "types/oauth";
import {useAuth} from "components/AuthProvider";
import {LoggedIn} from "types/user";

/**
 * Represents the page that is called from OAuth as the callback.
 */
const OAuthCallback: React.FC = () => {
  // Get the user data
  const userState = useAuth().userState as LoggedIn;

  const dispatch = useDispatch();
  const state = useSelector(getOAuthState);

  // Get the params sent using OAuth
  const [searchParams] = useSearchParams();
  const oAuthCode = searchParams.get('code') as string;
  // TODO: Get the state param (we can get the platform from there)

  useEffect(() => {
    dispatch(sendAuthorizationCode(Platform.STREAMLABS, oAuthCode, userState.desmosAddress))
  }, []);


  if (state.isLoading) {
    return <p>Loading...</p>
  }

  if (state.error != null) {
    return <p>Error: {state.error}</p>;
  }

  return (
    <div>
      <p>Success!</p>
    </div>
  );
}

export default OAuthCallback;
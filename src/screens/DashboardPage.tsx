import * as React from "react" ;
import {LoggedIn} from "types/user";
import {useDispatch} from "react-redux";
import {startAuthorization} from "store/oauth/actions";
import {useAuth} from "components/AuthProvider";

/**
 * Represents the home screen of the app.
 * @returns {JSX.Element}
 * @constructor
 */
const DashboardPage: React.FC = () => {
  // Get the user data
  const userState = useAuth().userState as LoggedIn;

  const dispatch = useDispatch();

  function handleClick() {
    dispatch(startAuthorization)
  }

  return (
    <div>
      <p>Welcome {userState.desmosAddress}</p>

      <p>Connect your Streamlabs account now</p>
      <button className="btn-orange" onClick={handleClick}>
        Connect Streamlabs
      </button>
    </div>
  );
}

export default DashboardPage;
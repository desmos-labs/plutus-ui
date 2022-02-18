import * as React from "react";
import {ReactComponent as Logo} from "../assets/logo.svg";
import {useLocation, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {getUserState, LoginStep} from "store/user";

/**
 * Represents the application bar.
 * @returns {JSX.Element}
 * @constructor
 */
function AppBar() {
  const navigate = useNavigate();

  const location = useLocation();
  const isHomePage = location.pathname == "/";

  const state = useSelector(getUserState);

  function handleClickLogo() {
    navigate("/",);
  }

  function handleClickLogin() {
    navigate("/login");
  }

  function handleClickDashboard() {
    navigate("/dashboard");
  }

  function getButton() {
    switch (location.pathname) {
      case "/login":
      case "/dashboard":
        return <div />

      default: {
        switch (state.step) {
          case LoginStep.LOADING:
            return <div />
          case LoginStep.LOGGED_OUT:
            return <button className="px-8" onClick={handleClickLogin}>Login</button>
          default:
            return <button className="px-8" onClick={handleClickDashboard}>Dashboard</button>
        }
      }
    }
  }

  return (
    <div className="bg-transparent my-6 md:my-8 flex flex-wrap justify-between items-center h-auto">
      <Logo
        className={`inline h-12 ${isHomePage ? "cursor-default" : "cursor-pointer"}`}
        onClick={isHomePage ? undefined : handleClickLogo}
      />

      {getButton()}
    </div>
  );
}

export default AppBar;
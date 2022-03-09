import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserState, LoginStep } from "../../store/user";
import { ReactComponent as Logo } from "../../assets/logo.svg";
import UserPopupButton from "./UserPopupButton";
import LoginButton from "./LoginButton";

/**
 * Represents the application bar.
 * @returns {JSX.Element}
 * @constructor
 */
function NavigationBar() {
  const navigate = useNavigate();

  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const state = useSelector(getUserState);

  function handleClickLogo() {
    navigate("/");
  }

  return (
    <div className="bg-transparent my-6 md:my-8 flex flex-wrap justify-between items-center h-auto">
      <Logo
        className={`inline h-[40px] ${
          isHomePage ? "cursor-default" : "cursor-pointer"
        }`}
        onClick={isHomePage ? undefined : handleClickLogo}
      />

      {state.step === LoginStep.LOGGED_OUT && <LoginButton />}

      {state.step === LoginStep.LOGGED_IN && <UserPopupButton />}
    </div>
  );
}

export default NavigationBar;

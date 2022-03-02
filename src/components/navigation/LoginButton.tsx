import {useNavigate} from "react-router-dom";
import PrimaryButton from "../buttons/PrimaryButton";
import * as React from "react";

/**
 * Represents the button that should be used to log into the application.
 * @constructor
 */
function LoginButton() {
  const navigate = useNavigate();

  function handleClickLogin() {
    navigate("/login");
  }

  return <PrimaryButton onClick={handleClickLogin}>Login</PrimaryButton>
}

export default LoginButton;
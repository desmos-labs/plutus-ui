import { useNavigate } from "react-router-dom";
import * as React from "react";
import { useCallback } from "react";
import PrimaryButton from "../buttons/PrimaryButton";

/**
 * Represents the button that should be used to log into the application.
 * @constructor
 */
function LoginButton() {
  const navigate = useNavigate();

  const handleClickLogin = useCallback(() => {
    navigate("/login");
  }, []);

  return (
    <PrimaryButton className="text-sm md:text-base" onClick={handleClickLogin}>
      Login
    </PrimaryButton>
  );
}

export default LoginButton;

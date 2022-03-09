import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ReactComponent as IntegrationsIcon } from "../../assets/icons/integration.svg";
import { ReactComponent as LogoutIcon } from "../../assets/icons/user.svg";
import { logout } from "../../store/user";
import OutsideClickHandler from "../OutsideClickHandler";
import { getNavigationState, hidePopup } from "../../store/navigation";

/**
 * Represents the navigation bar popup that allows the user to either navigate to a custom screen or to log out.
 * @constructor
 */
function NavigationPopup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector(getNavigationState);

  const handleClickOutside = useCallback(() => {
    dispatch(hidePopup());
  }, []);
  const handleClickIntegrations = useCallback(() => {
    dispatch(hidePopup());
    navigate("/dashboard", { replace: false });
  }, []);

  const handleClickLogout = useCallback(() => {
    dispatch(hidePopup());
    dispatch(logout());
  }, []);

  return !state.showPopup ? null : (
    <OutsideClickHandler onClickOutside={handleClickOutside}>
      <div className="w-44 mt-2 mr-8 md:mr-16 bg-white rounded-md absolute origin-top-right right-0 rounded-md shadow-xl z-50">
        <button
          type="button"
          className="select-none flex flex-row p-4 cursor-pointer"
          onClick={handleClickIntegrations}
        >
          <IntegrationsIcon className="my-auto" />
          <p className="text-sm ml-2">Dashboard</p>
        </button>

        <div className="h-[1px] bg-divider" />

        <button
          type="button"
          className="select-none flex flex-row p-4 cursor-pointer"
          onClick={handleClickLogout}
        >
          <LogoutIcon className="my-auto" />
          <p className="text-sm ml-2">Logout</p>
        </button>
      </div>
    </OutsideClickHandler>
  );
}

export default NavigationPopup;

import * as React from "react";
import {ReactComponent as Logo} from "../assets/logo.svg";
import {useLocation, useNavigate} from "react-router-dom";


/**
 * Represents the application bar.
 * @returns {JSX.Element}
 * @constructor
 */
function AppBar() {
  const navigate = useNavigate();

  const location = useLocation();
  const isHomePage = location.pathname == "/";
  const isLoginPage = location.pathname == "/login";

  function handleClickLogo() {
    navigate("/",);
  }

  function handleClickLogin() {
    navigate("/login");
  }

  return (
    <div className="bg-[#F78432] h-auto p-[10px] flex flex-wrap justify-between items-center">
      <Logo
        className={`inline h-[40px] ${isHomePage ? "cursor-default" : "cursor-pointer"}`}
        onClick={isHomePage ? undefined : handleClickLogo}
      />

      {!isLoginPage &&
          <div className="w-auto block">
              <ul className="flex flex-row">
                  <button className="bg-black px-[20px] py-[5px] rounded-full text-white" onClick={handleClickLogin}>
                      Login
                  </button>
              </ul>
          </div>
      }
    </div>
  );
}

export default AppBar;
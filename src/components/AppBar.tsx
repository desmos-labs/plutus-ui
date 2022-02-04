import * as React from "react";
import {ReactComponent as Logo} from "../assets/logo.svg";

/**
 * Represents the application bar.
 * @returns {JSX.Element}
 * @constructor
 */
function AppBar() {
  return (
    <div className="bg-[#F78432] h-auto p-[10px] text-white text-center">
      <Logo className="inline h-[40px]"/>
    </div>
  );
}

export default AppBar;
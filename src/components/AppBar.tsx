import * as React from "react";
import {ReactComponent as Logo} from "../assets/logo.svg";

/**
 * Represents the application bar.
 * @returns {JSX.Element}
 * @constructor
 */
function AppBar() {
  return (
    <div className="bg-[#222] h-[150px] p-[20px] text-white text-center">
      <Logo className="inline h-[80px]"/>
      <h2 className="text-lg">Welcome to React</h2>
    </div>
  );
}

export default AppBar;
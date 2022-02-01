import React from "react";
import logo from "../assets/logo.svg";

/**
 * Represents the application bar.
 * @returns {JSX.Element}
 * @constructor
 */
function AppBar() {
  return (
    <div className="bg-[#222] h-[150px] p-[20px] text-white text-center">
      <img src={logo} className="inline h-[80px]" alt="logo"/>
      <h2 className="text-lg">Welcome to React</h2>
    </div>
  );
}

export default AppBar;
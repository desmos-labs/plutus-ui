import React from "react";
import LoadingIcon from "../components/LoadingIcon";

/**
 * Represents a loading screen.
 * @constructor
 */
function LoadingPage() {
  return (
    <div className="content-center h-full text-center">
      <LoadingIcon />
      <p>Loading...</p>
    </div>
  );
}

export default LoadingPage;

import React from "react";
import Lottie from "lottie-react";
import loadingHourglass from "../assets/lottie/loading-hourglass.json";

/**
 * Represents the loading icon.
 * @constructor
 */
function LoadingIcon() {
  return (
    <Lottie className="w-20 mx-auto" animationData={loadingHourglass} loop />
  );
}

export default LoadingIcon;

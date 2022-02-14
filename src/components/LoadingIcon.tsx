import loadingHourglass from "assets/lottie/loading-hourglass.json";
import Lottie from "lottie-react";

/**
 * Represents the loading icon.
 * @constructor
 */
function LoadingIcon() {
  return (
    <Lottie
      className="w-20 mx-auto"
      animationData={loadingHourglass}
      loop={true}
    />
  );
}

export default LoadingIcon;
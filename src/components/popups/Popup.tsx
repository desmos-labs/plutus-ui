import React from "react";

type PopupProps = {
  children: JSX.Element;
  visible: boolean;
};

/**
 * Represents a generic popup.
 */
function Popup({ children, visible }: PopupProps) {
  if (!visible) {
    return null;
  }

  return (
    <div className="bg-[rgba(168,168,168,0.3)] px-2 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0">
      <div className="popup-background p-4 rounded-2xl text-center w-full mx-8 md:w-3/5 lg:w-1/3">
        {children}
      </div>
    </div>
  );
}

export default Popup;

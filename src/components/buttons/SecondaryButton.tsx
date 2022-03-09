import React from "react";

interface Props {
  onClick: () => void;
}

/**
 * Represents a secondary button.
 * @param onClick: Action to be called when the button is clicked
 * @param children: Children of the button.
 * @constructor
 */
function SecondaryButton({
  onClick,
  children,
}: Props & JSX.ElementChildrenAttribute) {
  return (
    <button type="button" className="button-secondary" onClick={onClick}>
      {children}
    </button>
  );
}

export default SecondaryButton;

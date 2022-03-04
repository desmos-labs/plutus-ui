import React from "react";

type PrimaryButtonProps = React.ButtonHTMLAttributes<any> & {
  onClick: () => void;
}

/**
 * Represents a primary button.
 * @param onClick: Action to be called when the button is clicked
 * @param children: Children of the button.
 * @constructor
 */
function PrimaryButton({onClick, children, className, ...props}: PrimaryButtonProps) {
  return (
    <button
      {...props}
      className={`px-6 button-primary ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default PrimaryButton;
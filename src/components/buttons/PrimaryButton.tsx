import React from "react";

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<any> {
  onClick: () => void;
}

/**
 * Represents a primary button.
 * @constructor
 */
function PrimaryButton({
  onClick,
  children,
  className,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      {...props}
      type="button"
      className={`px-6 button-primary ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default PrimaryButton;

import {DOMAttributes, HTMLAttributes} from "react";

interface Props {
  onClick: () => void;
}

/**
 * Represents a primary button.
 * @param onClick: Action to be called when the button is clicked
 * @param children: Children of the button.
 * @constructor
 */
function PrimaryButton({onClick, children, className}: Props & JSX.ElementChildrenAttribute & HTMLAttributes<any>) {
  return <button className={`px-6 button-primary ${className}`} onClick={onClick}>{children}</button>
}

export default PrimaryButton;
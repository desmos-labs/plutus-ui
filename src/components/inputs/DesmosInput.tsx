import {InputProps} from "react-select";
import {HTMLAttributes, InputHTMLAttributes} from "react";

/**
 * Represents a generic Input element.
 * @constructor
 */
function DesmosInput(props: InputHTMLAttributes<any>) {
  return (
    <input
      {...props}
      className="outline-primary-light outline-[1px] border-primary-light border-[1px] rounded-md p-3"
    />
  )
}

export default DesmosInput;
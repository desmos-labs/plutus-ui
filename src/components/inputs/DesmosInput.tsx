import React, { InputHTMLAttributes } from "react";

/**
 * Represents a generic Input element.
 * @constructor
 */
function DesmosInput({ className, ...props }: InputHTMLAttributes<any>) {
  return (
    <input
      {...props}
      className={`${className} rounded-xl p-3 shadow-[0_16px_30px_10px_rgba(70,53,43,0.02)]`}
    />
  );
}

export default DesmosInput;

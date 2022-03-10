import React from "react";

interface FieldLabelProps {
  children: string;
}

function FieldLabel({ children }: FieldLabelProps) {
  return <p className="font-medium">{children}:</p>;
}

export default FieldLabel;

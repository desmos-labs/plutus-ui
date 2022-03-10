import React from "react";
import FieldLabel from "./FieldLabel";
import FieldValue from "./FieldValue";

interface MessageFieldProps {
  readonly label: string;
  readonly children: React.ReactNode;
}

function MessageField({ label, children }: MessageFieldProps) {
  return (
    <div className="text-sm">
      <FieldLabel>{label}</FieldLabel>
      {children && <FieldValue>{children}</FieldValue>}
    </div>
  );
}

export default MessageField;

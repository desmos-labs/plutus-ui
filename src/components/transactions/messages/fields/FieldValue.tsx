import React from "react";

interface FieldValueProps {
  readonly children: React.ReactNode;
}

function FieldValue({ children }: FieldValueProps) {
  return (
    <div className="truncate p-2 px-3 rounded-xl bg-[#F3F3F3]">{children}</div>
  );
}

export default FieldValue;

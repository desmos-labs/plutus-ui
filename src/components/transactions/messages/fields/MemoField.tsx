import React from "react";
import MessageField from "./MessageField";

interface MemoFieldProps {
  readonly memo: string;
}

function MemoField({ memo }: MemoFieldProps) {
  return <MessageField label="Memo">{memo}</MessageField>;
}

export default MemoField;

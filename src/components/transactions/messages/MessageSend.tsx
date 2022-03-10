import React from "react";
import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx";
import MessageField from "./fields/MessageField";
import AmountField from "./fields/AmountField";

type Props = {
  msg: MsgSend;
};

/**
 * Allows to display the details of a MsgSend message.
 */
function MessageSend({ msg }: Props) {
  return (
    <div className="space-y-3">
      <MessageField label="From">{msg.fromAddress}</MessageField>
      <MessageField label="To">{msg.toAddress}</MessageField>
      <AmountField amount={msg.amount} />
    </div>
  );
}

export default MessageSend;

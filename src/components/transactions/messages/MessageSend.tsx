import React from "react";
import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx";
import Amount from "./Amount";
import { coinToString } from "../../../types";

type Props = {
  msg: MsgSend;
};

/**
 * Allows to display the details of a MsgSend message.
 */
function MessageSend({ msg }: Props) {
  return (
    <div className="space-y-2">
      <div>
        <p className="font-bold">From:</p>
        <p>{msg.fromAddress}</p>
      </div>
      <div>
        <p className="font-bold">To:</p>
        <p>{msg.toAddress}</p>
      </div>
      <div>
        <p className="font-bold">Amount:</p>
        {msg.amount.map((coin) => (
          <Amount key={coinToString(coin)} amount={coin} />
        ))}
      </div>
    </div>
  );
}

export default MessageSend;

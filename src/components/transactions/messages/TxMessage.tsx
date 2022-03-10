import React from "react";
import { EncodeObject } from "@cosmjs/proto-signing";
import MessageSend from "./MessageSend";

type Props = {
  msg: EncodeObject;
};

/**
 * Returns the proper visualization for any kind of Cosmos message.
 */
function TxMessage({ msg }: Props) {
  const { typeUrl, value } = msg;
  switch (typeUrl) {
    case "/cosmos.bank.v1beta1.MsgSend":
      return <MessageSend msg={value} />;

    default:
      return null;
  }
}

export default TxMessage;

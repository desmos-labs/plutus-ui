import {Any} from "cosmjs-types/google/protobuf/any";
import {MsgSend} from "cosmjs-types/cosmos/bank/v1beta1/tx";
import MessageSend from "components/transactions/messages/MessageSend";
import {EncodeObject} from "@cosmjs/proto-signing";

type Props = {
  msg: EncodeObject,
}

/**
 * Returns the proper visualization for any kind of Cosmos message.
 * @param msg {Any}: Message object.
 */
function TxMessage({msg}: Props) {
  const {typeUrl, value} = msg;
  switch (typeUrl) {
    case "/cosmos.bank.v1beta1.MsgSend":
      return <MessageSend msg={value}/>

    default:
      return <div/>
  }
}

export default TxMessage;
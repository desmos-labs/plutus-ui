import {MsgSend} from "cosmjs-types/cosmos/bank/v1beta1/tx";
import Amount from "components/transactions/messages/Amount";

type Props = {
  msg: MsgSend
}

/**
 * Allows to display the details of a MsgSend message.
 */
function MessageSend({msg}: Props) {
  return (
    <div className="text-left">
      <p className="font-bold">From:</p>
      <p>{msg.fromAddress}</p>
      <p className="mt-2 font-bold">To:</p>
      <p>{msg.toAddress}</p>
      <p className="mt-2 font-bold">Amount:</p>
      {msg.amount.map((coin) => <Amount amount={coin} />)}
    </div>
  );
}

export default MessageSend;
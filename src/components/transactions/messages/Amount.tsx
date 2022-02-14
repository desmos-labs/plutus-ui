import {Coin} from "cosmjs-types/cosmos/base/v1beta1/coin";
import {coinToString} from "types/crypto/coins";

type Props = {
  amount: Coin
}

/**
 * Allows to display a coin amount properly.
 */
function Amount({amount}: Props) {
  return(
    <div>
      <p>{coinToString(amount)} ({amount.amount} {amount.denom})</p>
    </div>
  )
}

export default Amount;
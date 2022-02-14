import {Coin} from "cosmjs-types/cosmos/base/v1beta1/coin";
import {coinsToString} from "types/crypto/coins";

type TipsEnabledSectionProps = {
  grantedAmount: Coin[]
}

/**
 * Represents the tips section that is shown when the user has granted an amount of tokens.
 * @param grantedAmount {Coin[]}: Amount of tokens to be granted.
 */
function TipsEnabledSection({grantedAmount}: TipsEnabledSectionProps) {
  return (
    <div>
      <p>Currently you have allowed DesmosTipBot to send at most {coinsToString(grantedAmount)} on your behalf.</p>
      <p>Do you want to increase the grant allocation?</p>
      <button className="mt-2">Grant more</button>
    </div>
  )
}

export default TipsEnabledSection;
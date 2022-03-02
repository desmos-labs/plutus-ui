import {Coin} from "cosmjs-types/cosmos/base/v1beta1/coin";
import {isZero} from "../../../types";
import EnableTipsSection from "./EnableTipsSection";
import TipsEnabledSection from "./TipsEnabledSection";
import * as React from "react";
import {useSelector} from "react-redux";
import {getLoggedInUser} from "../../../store/user";

function TipsSection() {
  const user = useSelector(getLoggedInUser);

  return (
    <div>
      <h3 className="mt-8">Social tips</h3>
      {isZero(user.grantedAmount) ?
        <EnableTipsSection/> :
        <TipsEnabledSection grantedAmount={user.grantedAmount}/>
      }
    </div>
  );
}

export default TipsSection;
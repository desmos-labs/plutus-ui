import React from "react";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";
import { coinsToString } from "../../../../types";
import MessageField from "./MessageField";

interface AmountFieldProps {
  readonly amount: Coin[];
}

function AmountField({ amount }: AmountFieldProps) {
  return <MessageField label="Amount">{coinsToString(amount)}</MessageField>;
}

export default AmountField;

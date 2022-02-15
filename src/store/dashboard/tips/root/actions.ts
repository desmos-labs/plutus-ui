import {AppThunk} from "store/index";
import {setError, setGrantedAmount} from "store/dashboard/tips/root/index";
import {Chain} from "types/cosmos/chain";
import {PlutusAPI} from "apis/plutus";

/**
 * Fetches the granted amount.
 */
export function initTipsState(userAddress: string): AppThunk {
  return async dispatch => {
    const granteeAddress = await PlutusAPI.getGranteeAddress();
    if (granteeAddress instanceof Error) {
      dispatch(setError(granteeAddress.message));
      return
    }

    const amount = await Chain.getGrantAmount(userAddress, granteeAddress);
    dispatch(setGrantedAmount(amount));
  }
}
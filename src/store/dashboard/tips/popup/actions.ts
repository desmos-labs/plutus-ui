import {AppThunk} from "store/index";
import {SendAuthorization} from "cosmjs-types/cosmos/bank/v1beta1/authz";
import {Chain} from "types/cosmos/chain";
import {PlutusAPI} from "apis/plutus";
import {UserWallet} from "types/cosmos/wallet";
import {setError, setStep, setSuccess, TipsPopupStep} from "store/dashboard/tips/popup/index";
import {MsgGrantEncodeObject} from "types/cosmos/messages";
import {sendTx} from "store/transaction/actions";

/**
 * Starts the authorization process required to enable social tips.
 */
export function startTipAuthorizationProcess(amount: number): AppThunk {
  return async dispatch => {
    // Get the user wallet
    const account = await UserWallet.getAccount();
    if (!account) {
      dispatch(setError("Invalid user account"));
      return;
    }

    // Build the authorization
    const authorization: SendAuthorization = {
      spendLimit: [
        {
          amount: (amount * 1_000_000).toString(),
          denom: Chain.getFeeDenom(),
        }
      ]
    };

    // Build the message
    const grantee = await PlutusAPI.getGranteeAddress();
    if (grantee instanceof Error) {
      dispatch(setError(grantee.message));
      return;
    }

    const msg: MsgGrantEncodeObject = {
      typeUrl: "/cosmos.authz.v1beta1.MsgGrant",
      value: {
        grantee: grantee,
        granter: account.address,
        grant: {
          authorization: {
            typeUrl: '/cosmos.bank.v1beta1.SendAuthorization',
            value: SendAuthorization.encode(authorization).finish(),
          },
        }
      }
    };

    // Send the transaction
    dispatch(setStep(TipsPopupStep.CONFIRMATION_REQUIRED));
    const result = await dispatch(sendTx(account.address, [msg], {memo: 'DesmosTipBot grant'}));
    if (result instanceof Error) {
      dispatch(setError(result.message));
      return;
    }

    dispatch(setSuccess(result.transactionHash));
  }
}
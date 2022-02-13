import {TipGrant} from "types/tips";
import {AppThunk} from "store/index";
import {SendAuthorization} from "cosmjs-types/cosmos/bank/v1beta1/authz";
import {Chain} from "types/crypto/chain";
import {PlutusAPI} from "apis/plutus";
import {MsgGrant} from "cosmjs-types/cosmos/authz/v1beta1/tx";
import {TxBody} from "cosmjs-types/cosmos/tx/v1beta1/tx";
import {UserWallet} from "types/crypto/wallet";
import {setError, setStep, setSuccess, TipsPopupStep} from "store/dashboard/tips/popup/index";

/**
 * Starts the authorization process required to enable social tips.
 * @param tipGrant {TipGrant}: Grant to be requested.
 */
export function startTipAuthorizationProcess(tipGrant: TipGrant): AppThunk {
  return async dispatch => {
    // Build the authorization
    const authorization: SendAuthorization = {
      spendLimit: [
        {
          amount: (tipGrant.amount * 1_000_000).toString(),
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

    const msg: MsgGrant = {
      grantee: grantee,
      granter: tipGrant.granter,
      grant: {
        authorization: {
          typeUrl: '/cosmos.bank.v1beta1.SendAuthorization',
          value: SendAuthorization.encode(authorization).finish(),
        },
      }
    };

    // Build the transaction
    const transaction: Partial<TxBody> = {
      messages: [{
        typeUrl: '/cosmos.authz.v1beta1.MsgGrant',
        value: MsgGrant.encode(msg).finish(),
      }],
      memo: 'DesmosTipBot grant',
    };

    // Try signing the transaction
    dispatch(setStep(TipsPopupStep.CONFIRMATION_REQUIRED));
    const result = await UserWallet.signTransactionDirect(transaction);
    if (result instanceof Error) {
      dispatch(setError(result.message));
      return;
    }

    try {
      // Broadcast the transaction
      const response = await Chain.broadcastTx(result.signedTxBytes);
      dispatch(setSuccess(response.transactionHash));
    } catch (e) {
      console.log(e);
      dispatch(setError('Broadcasting error'));
    }
  }
}
import {AppThunk} from "store/index";
import {Donation} from "types/donation";
import {DonationsAPI} from "apis/donations";
import {setError, setLoading, setRecipientAddresses, setSuccess} from "store/donation/index";
import {UserWallet} from "types/crypto/wallet";
import {MsgSend} from "cosmjs-types/cosmos/bank/v1beta1/tx";
import {TxBody} from "cosmjs-types/cosmos/tx/v1beta1/tx";
import {Chain} from "types/crypto/chain";
import Graphql from "apis/graphql";

/**
 * Retrieves the recipient addresses based on the application and the username.
 */
export function getRecipientAddresses(application: string, username: string): AppThunk {
  return async dispatch => {
    dispatch(setLoading(true))

    const addresses = await Graphql.getAddresses(application, username)
    if (!addresses) {
      dispatch(setError("User not found on Desmos"))
      return
    }

    dispatch(setRecipientAddresses(addresses))
    dispatch(setLoading(false))
  }
}


/**
 * Allows donating to a user.
 */
export function sendDonation(donation: Donation): AppThunk {
  return async dispatch => {
    dispatch(setLoading(true))
    dispatch(setError(undefined))

    // Build the message
    const sendMsg: MsgSend = {
      fromAddress: donation.tipperAddress,
      toAddress: donation.recipientAddress,
      amount: [{
        amount: (donation.tipAmount * 1_000_000).toString(),
        denom: Chain.getFeeDenom(),
      }]
    };

    // Build the transaction
    const transaction: Partial<TxBody> = {
      messages: [{
        typeUrl: '/cosmos.bank.v1beta1.MsgSend',
        value: MsgSend.encode(sendMsg).finish(),
      }],
      memo: donation.message,
    };

    // Try signing the transaction
    const result = await UserWallet.signTransactionDirect(transaction);
    if (result instanceof Error) {
      dispatch(setError(result.message));
      return;
    }

    try {
      // Broadcast the transaction
      const response = await Chain.broadcastTx(result.signedTxBytes);
      console.log(response.transactionHash);

      // Call the APIs
      const error = await DonationsAPI.sendDonation(donation, response.transactionHash)
      if (error != null) {
        dispatch(setError(error.message))
        return
      }

      dispatch(setSuccess(true));
    } catch (e) {
      console.log(e);
      dispatch(setError('Broadcasting error'));
    }
  }
}
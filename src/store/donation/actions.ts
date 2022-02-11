import {AppThunk} from "store/index";
import {Donation} from "types/donation";
import {DonationsAPI} from "apis/donations";
import {
  DonationStatus,
  setError,
  setRecipientAddresses,
  setRecipientProfile,
  setStatus,
  setSuccess
} from "store/donation/index";
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
    const addresses = await Graphql.getAddresses(application, username)
    if (!addresses) {
      dispatch(setError("User not found on Desmos"))
      return
    }

    dispatch(setRecipientAddresses(addresses))
    dispatch(changeRecipientAddress(addresses[0]))
  }
}

/**
 * Retrieves the Desmos profile associated with the given Desmos address, if any.
 */
export function changeRecipientAddress(desmosAddress: string): AppThunk {
  return async dispatch => {
    const profile = await Graphql.getProfile(desmosAddress);
    dispatch(setRecipientProfile(profile));

    dispatch(setStatus(DonationStatus.INPUTTING_DATA))
  }
}

/**
 * Allows donating to a user.
 */
export function sendDonation(donation: Donation): AppThunk {
  return async dispatch => {
    dispatch(setStatus(DonationStatus.LOADING))

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
    dispatch(setStatus(DonationStatus.TX_REQUEST_SENT));
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
      const error = await DonationsAPI.sendDonation(donation, response.transactionHash);
      if (error != null) {
        dispatch(setError(error.message));
        return
      }

      dispatch(setSuccess(response.transactionHash));
    } catch (e) {
      console.log(e);
      dispatch(setError('Broadcasting error'));
    }
  }
}
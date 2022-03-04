import {AppThunk} from "../index";
import {Donation} from "types/donations";
import {PlutusAPI} from "apis/plutus";
import {
  DonationStatus,
  reset,
  setError,
  setRecipientAddresses,
  setRecipientProfile,
  setStatus,
} from "./index";
import {UserWallet} from "types/cosmos/wallet";
import Graphql from "apis/graphql";
import {sendTx} from "store/transaction/actions";
import {MsgSendEncodeObject} from "@cosmjs/stargate";

/**
 * Retrieves the recipient addresses based on the application and the username.
 */
export function initDonationState(application: string, username: string): AppThunk {
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

    dispatch(setStatus(DonationStatus.LOADED))
  }
}

/**
 * Allows donating to a user.
 */
export function sendDonation(donation: Donation): AppThunk {
  return async dispatch => {
    const account = await UserWallet.getAccount();
    if (!account) {
      dispatch(setError("Invalid account"));
      return
    }

    // Build the donation message
    const sendMsg: MsgSendEncodeObject = {
      typeUrl: "/cosmos.bank.v1beta1.MsgSend",
      value: {
        fromAddress: account.address,
        toAddress: donation.recipientAddress,
        amount: [{
          amount: (donation.tipAmount * 1_000_000).toString(),
          denom: UserWallet.getFeeDenom(),
        }]
      }
    };

    // Send the transaction
    const response = await dispatch(sendTx(account.address, [sendMsg], {memo: donation.message}));
    if (response instanceof Error) {
      dispatch(setError(response.message));
      return
    }

    // Call the APIs
    const error = await PlutusAPI.sendDonationAlert(donation, response.transactionHash);
    if (error != null) {
      dispatch(setError(error.message));
      return
    }

    // Reset the state
    dispatch(reset());
  }
}
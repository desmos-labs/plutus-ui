import {AppThunk} from "store/index";
import {Donation} from "types/donation";
import {DonationsAPI} from "apis/donations";
import {setError, setLoading} from "store/donation/index";
import {UserWallet} from "../../types/crypto/wallet";
import {MsgSend} from "cosmjs-types/cosmos/bank/v1beta1/tx";
import donationPage from "../../screens/DonationPage";
import {TxBody} from "cosmjs-types/cosmos/tx/v1beta1/tx";
import {Chain} from "../../types/crypto/chain";
import fa from "@walletconnect/qrcode-modal/dist/cjs/browser/languages/fa";

/**
 * Allows donating to a user.
 */
export const sendDonation = (donation: Donation): AppThunk => {
  return async dispatch => {
    dispatch(setLoading(true))
    dispatch(setError(undefined))

    // Get user address
    const userAddress = UserWallet.getAddress();
    if (userAddress == null) {
      dispatch(setError("You need to log in"));
      return
    }

    // Get the recipient address

    // Build the message
    const sendMsg: MsgSend = {
      fromAddress: userAddress,
      toAddress:,
      amount: [{
        amount: '',
        denom: ''
      }]
    };

    // Build the transaction
    const transaction: Partial<TxBody> = {
      messages: [{
        typeUrl: '/cosmos.bank.v1beta1.MsgSend',
        value: MsgSend.encode(sendMsg).finish(),
      }],
      memo: donation.donationMessage,
    };

    // Try signing the transaction
    const result = await UserWallet.signTransactionDirect(transaction);
    if (result instanceof Error) {
      dispatch(setError(result.message));
      return;
    }

    // Broadcast the transaction
    try {
      const response = await Chain.broadcastTx(result.signedTxBytes);
      console.log(response.transactionHash);
      dispatch(setLoading(false));
    } catch (e) {
      console.log(e);
      dispatch(setError('Broadcasting error'));
    }
  }
}
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MsgSendEncodeObject } from "@cosmjs/stargate";
import type { AppThunk, RootState } from "../index";
import { DesmosProfile, Donation, UserWallet } from "../../types";
import Graphql from "../../apis/graphql";
import { PlutusAPI } from "../../apis";
import { sendTx } from "../transaction";
import { DonationState, DonationStatus } from "./state";

export * from "./state";

// --- SLICE ---
export const donationSlice = createSlice({
  name: "donation",
  initialState: (): DonationState => ({
    status: DonationStatus.LOADING,
    denom: UserWallet.getFeeDenom(),
    recipientProfiles: [],
    selectedProfile: { address: "" },
    amount: "",
    username: "",
    message: "",
  }),
  reducers: {
    setStatus(state, action: PayloadAction<DonationStatus>) {
      state.status = action.payload;
      state.error = undefined;
    },
    setRecipientProfiles(state, action: PayloadAction<DesmosProfile[]>) {
      state.recipientProfiles = action.payload;
    },
    setSelectedProfile(state, action: PayloadAction<DesmosProfile>) {
      state.selectedProfile = action.payload;
    },
    setAmount(state, action: PayloadAction<string>) {
      state.amount = action.payload;
    },
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    setMessage(state, action: PayloadAction<string>) {
      state.message = action.payload;
    },
    setError(state, action: PayloadAction<string | undefined>) {
      state.status = DonationStatus.ERROR;
      state.error = action.payload;
      state.txHash = undefined;
    },
    reset(state) {
      state.status = DonationStatus.LOADED;
      state.amount = "";
      state.username = "";
      state.message = "";
    },
  },
});

// --- ACTIONS ---
const { setStatus, setRecipientProfiles, setSelectedProfile, setError, reset } =
  donationSlice.actions;
export const { setAmount, setUsername, setMessage } = donationSlice.actions;

/**
 * Retrieves the Desmos profile associated with the given Desmos address, if any.
 */
export function changeSelectedProfile(profile: DesmosProfile): AppThunk {
  return async (dispatch) => {
    dispatch(setSelectedProfile(profile));
    dispatch(setStatus(DonationStatus.LOADED));
  };
}

/**
 * Retrieves the recipient addresses based on the application and the username.
 */
export function initDonationState(
  application: string,
  username: string
): AppThunk {
  return async (dispatch) => {
    const profiles = await Graphql.getProfiles(application, username);
    if (!profiles) {
      dispatch(setError("User not found on Desmos"));
      return;
    }

    dispatch(setRecipientProfiles(profiles));
    dispatch(changeSelectedProfile(profiles[0]));
  };
}

/**
 * Allows donating to a user.
 */
export function sendDonation(donation: Donation): AppThunk {
  return async (dispatch) => {
    const account = await UserWallet.getAccount();
    if (!account) {
      dispatch(setError("Invalid account"));
      return;
    }

    // Build the donation message
    const sendMsg: MsgSendEncodeObject = {
      typeUrl: "/cosmos.bank.v1beta1.MsgSend",
      value: {
        fromAddress: account.address,
        toAddress: donation.recipientAddress,
        amount: [
          {
            amount: (donation.tipAmount * 1_000_000).toString(),
            denom: UserWallet.getFeeDenom(),
          },
        ],
      },
    };

    // Send the transaction
    const response = await dispatch(
      sendTx(account.address, [sendMsg], { memo: donation.message })
    );
    if (response instanceof Error) {
      dispatch(setError(response.message));
      return;
    }

    // Call the APIs
    const error = await PlutusAPI.sendDonationAlert(
      donation,
      response.transactionHash
    );
    if (error != null) {
      dispatch(setError(error.message));
      return;
    }

    // Reset the state
    dispatch(reset());
  };
}

// --- SELECTORS ---
export const getDonationState = (state: RootState) => state.donation;

export default donationSlice.reducer;

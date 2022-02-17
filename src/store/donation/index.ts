import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../index";
import {DesmosProfile, UserWallet} from "../../types";

export * from "./actions";

// --- STATE ---
export enum DonationStatus {
  LOADING,
  LOADED,
  CONFIRMING_TX,
  ERROR,
}

/**
 * Represents the state of the donation screen.
 */
export type DonationState = {
  status: DonationStatus,
  denom: string;
  recipientAddresses: string[];
  recipientProfile: DesmosProfile,
  amount: string;
  username: string;
  message: string;
  error?: string;
  txHash?: string;
}

// --- SLICE ---
export const donationSlice = createSlice({
  name: 'donation',
  initialState: () : DonationState => {
    return {
      status: DonationStatus.LOADING,
      denom: UserWallet.getFeeDenom(),
      recipientAddresses: [],
      recipientProfile: {address: ''},
      amount: '',
      username: "",
      message: "",
    }
  },
  reducers: {
    setStatus(state, action: PayloadAction<DonationStatus>) {
      state.status = action.payload;
      state.error = undefined;
    },
    setRecipientAddresses(state, action: PayloadAction<string[]>) {
      state.recipientAddresses = action.payload;
    },
    setRecipientProfile(state, action: PayloadAction<DesmosProfile>) {
      state.recipientProfile = action.payload;
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
    }
  },
});

// --- ACTIONS ---
export const {
  setStatus,
  setRecipientAddresses,
  setRecipientProfile,
  setAmount,
  setUsername,
  setMessage,
  setError,
  reset,
} = donationSlice.actions;

// --- SELECTORS ---
export const getDonationState = (state: RootState) => {
  return state.donation;
}

export default donationSlice.reducer
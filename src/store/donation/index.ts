import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "store/index";
import {Profile} from "types/desmos";
import {DashoardStatus} from "store/dashboard/root";

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
  recipientAddresses: string[];
  recipientProfile: Profile,
  amount: string;
  username: string;
  message: string;
  error?: string;
  txHash?: string;
}

const initialState = {
  status: DonationStatus.LOADING,
  recipientAddresses: [],
  recipientProfile: {address: ''},
  amount: '',
  username: "",
  message: "",
} as DonationState;


// --- SLICE ---
export const donationSlice = createSlice({
  name: 'donation',
  initialState: initialState,
  reducers: {
    setStatus(state, action: PayloadAction<DonationStatus>) {
      state.status = action.payload;
      state.error = undefined;
    },
    setRecipientAddresses(state, action: PayloadAction<string[]>) {
      state.recipientAddresses = action.payload;
    },
    setRecipientProfile(state, action: PayloadAction<Profile>) {
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
      state.amount = initialState.amount;
      state.username = initialState.username;
      state.message = initialState.message;
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
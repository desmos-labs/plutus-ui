import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "store/index";
import {DonationState, DonationStatus} from "types/donation";
import {Profile} from "types/desmos";

const initialState = {
  status: DonationStatus.LOADING,
  recipientAddresses: [],
  recipientAddress: '',
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
    setRecipientAddress(state, action: PayloadAction<string>) {
      state.recipientAddress = action.payload;
    },
    setRecipientProfile(state, action: PayloadAction<Profile | undefined>) {
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
    setSuccess(state, action: PayloadAction<string>) {
      state.status = DonationStatus.SUCCESS;
      state.error = undefined;
      state.txHash = action.payload;
    }
  },
});

// --- ACTIONS ---
export const {
  setStatus,
  setRecipientAddresses,
  setRecipientAddress,
  setRecipientProfile,
  setAmount,
  setUsername,
  setMessage,
  setError,
  setSuccess,
} = donationSlice.actions;

// --- SELECTORS ---
export const getDonationState = (state: RootState) => {
  return state.donation;
}

export default donationSlice.reducer
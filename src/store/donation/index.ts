import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "store/index";
import {DonationState} from "types/donation";

const initialState = {
  recipientAddresses: [],
  recipientAddress: '',
  amount: 0,
  username: "",
  message: "",
  isLoading: false,
  success: false,
} as DonationState;


// --- SLICE ---
export const donationSlice = createSlice({
  name: 'donation',
  initialState: initialState,
  reducers: {
    setRecipientAddresses(state, action: PayloadAction<string[]>) {
      state.recipientAddresses = action.payload;
      if (state.recipientAddress == '') {
        state.recipientAddress = action.payload[0];
      }
    },
    setRecipientAddress(state, action: PayloadAction<string>) {
      state.recipientAddress = action.payload;
    },
    setAmount(state, action: PayloadAction<number>) {
      state.amount = action.payload;
    },
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    setMessage(state, action: PayloadAction<string>) {
      state.message = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | undefined>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    setSuccess(state, action: PayloadAction<boolean>) {
      state.isLoading = false;
      state.success = action.payload;
    }
  },
});

// --- ACTIONS ---
export const {
  setRecipientAddresses,
  setRecipientAddress,
  setAmount,
  setUsername,
  setMessage,
  setLoading,
  setError,
  setSuccess,
} = donationSlice.actions;

// --- SELECTORS ---
export const getDonationState = (state: RootState) => {
  return state.donation;
}

export default donationSlice.reducer
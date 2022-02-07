import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "store/index";
import {DonationState} from "types/donation";

const initialState = {
  amount: 0,
  username: "",
  message: "",
  isLoading: false,
} as DonationState;


// --- SLICE ---
export const donationSlice = createSlice({
  name: 'donation',
  initialState: initialState,
  reducers: {
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
    setError(state, action: PayloadAction<string|undefined>) {
      state.isLoading = false;
      state.error = action.payload;
    }
  },
});

// --- ACTIONS ---
export const {
  setAmount,
  setUsername,
  setMessage,
  setLoading,
  setError,
} = donationSlice.actions;

// --- SELECTORS ---
export const getDonationState = (state: RootState) => {
  return state.donation;
}

export default donationSlice.reducer
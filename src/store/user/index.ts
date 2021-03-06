import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SignerObserver, SignerStatus } from "@desmoslabs/desmjs";
import { LoggedIn, LoginStep, UserState } from "./state";
import { UserStorage } from "./storage";
import type { AppDispatch, AppThunk, RootState } from "../index";
import {
  convertProfile,
  parsePlatform,
  UserData,
  UserWallet,
} from "../../types";
import { PlutusAPI } from "../../apis";

export * from "./state";

// --- SLICE ---
export const userSlice = createSlice({
  name: "user",
  initialState: (): UserState =>
    UserStorage.isLoggedIn()
      ? { step: LoginStep.LOGGED_IN, account: UserStorage.getUserData() }
      : { step: LoginStep.LOADING },
  reducers: {
    setUserStatus(state, action: PayloadAction<UserState>) {
      return action.payload;
    },
  },
});

// --- ACTIONS ---
const { setUserStatus } = userSlice.actions;

/**
 * Refreshes the user state.
 */
export function refreshUserState(): AppThunk {
  return async (dispatch) => {
    // Get the account
    const account = await UserWallet.getAccount();
    if (!account) {
      dispatch(setUserStatus({ step: LoginStep.LOGGED_OUT }));
      return;
    }

    // Get the profile
    const profile = await UserWallet.getProfile();

    // Get the user data from Plutus API
    const data = await PlutusAPI.getUserData(account.address);
    if (data instanceof Error) {
      dispatch(
        setUserStatus({ step: LoginStep.LOGGED_OUT, message: data.message })
      );
      return;
    }

    // Build the UserData instance
    const userData: UserData = {
      profile: convertProfile(account.address, profile),
      grantedAmount: data.granted_amount || [],
      enabledIntegrations: (data.enabled_integrations || []).map(parsePlatform),
    };

    // Store the data locally
    UserStorage.storeUserData(userData);

    dispatch(
      setUserStatus({
        step: LoginStep.LOGGED_IN,
        account: userData,
      })
    );
  };
}

/**
 * Returns a function that observes the status of the wallet emitting the proper events when needed.
 */
function observeWalletStatus(dispatch: AppDispatch): SignerObserver {
  return async (status: SignerStatus) => {
    if (status !== SignerStatus.Connected) {
      UserStorage.deleteUserData();
      dispatch(setUserStatus({ step: LoginStep.LOGGED_OUT }));
      return;
    }

    // Initialize the state
    await dispatch(refreshUserState());
  };
}

/**
 * Initializes the user state.
 */
export function initUserState(): AppThunk {
  return (dispatch) => {
    // Subscribe to the status changes
    UserWallet.addStatusObserver(observeWalletStatus(dispatch));

    // Refresh the state
    dispatch(refreshUserState());
  };
}

/**
 * Allows to perform the login of a user using WalletConnect.
 */
export function loginWithWalletConnect(): AppThunk {
  return async (dispatch) => {
    // Add the status observer
    UserWallet.addStatusObserver(observeWalletStatus(dispatch));

    // If the user is not connected, create a new session
    if (!UserWallet.isConnected()) {
      const error = await UserWallet.connect();
      if (error) {
        dispatch(
          setUserStatus({ step: LoginStep.LOGGED_OUT, message: error.message })
        );
      }
    }
  };
}

/**
 * Allows to perform the logout of a user.
 */
export function logout(): AppThunk {
  return (dispatch) => {
    // Disconnect the wallet
    UserWallet.disconnect();

    // Delete the local storage
    UserStorage.deleteUserData();

    dispatch(setUserStatus({ step: LoginStep.LOGGED_OUT }));
  };
}

// --- SELECTORS ---
export const getUserState = (state: RootState) => {
  return state.user;
};

export const getLoggedInUser = (state: RootState) => {
  return (state.user as LoggedIn).account;
};

export default userSlice.reducer;

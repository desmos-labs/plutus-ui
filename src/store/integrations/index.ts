import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MsgAuthenticateEncodeObject } from "@desmoslabs/desmjs";
import type { RootState, AppThunk } from "../index";
import { getSignatureData, Platform, UserWallet } from "../../types";
import { PlutusAPI } from "../../apis";
import { refreshUserState } from "../user";
import { IntegrationPopupState, IntegrationPopupStep } from "./state";

export * from "./state";

// --- STATE ---

const initialState: IntegrationPopupState = {
  step: IntegrationPopupStep.NOTHING,
  platform: Platform.UNKNOWN,
};

// --- SLICE ---
const integrationsSlice = createSlice({
  name: "integrations-popup",
  initialState,
  reducers: {
    setStatus(state, action: PayloadAction<IntegrationPopupStep>) {
      state.step = action.payload;
    },
    setPlatform(state, action: PayloadAction<Platform>) {
      state.platform = action.payload;
    },
    setError(state, action: PayloadAction<string | undefined>) {
      if (action.payload) {
        state.step = IntegrationPopupStep.ERROR;
      }
      state.error = action.payload;
    },
    resetIntegrationsPopup(state) {
      state.step = initialState.step;
      state.error = undefined;
    },
  },
});

// --- ACTIONS ---
const { setStatus, setPlatform, setError } = integrationsSlice.actions;
export const { resetIntegrationsPopup } = integrationsSlice.actions;

/**
 * Starts the disconnection from the given platform.
 */
export function startDisconnection(platform: Platform): AppThunk {
  return (dispatch) => {
    dispatch(setPlatform(platform));
    dispatch(setStatus(IntegrationPopupStep.CONFIRMATION_REQUESTED));
  };
}

/**
 * Effectively disconnects the user from the given platform.
 */
export function disconnect(platform: Platform): AppThunk {
  return async (dispatch) => {
    // Get the user data
    const account = await UserWallet.getAccount();
    if (!account) {
      dispatch(setError("Invalid user account"));
      return;
    }

    // Build the message to be signed
    const msgSend: MsgAuthenticateEncodeObject = {
      typeUrl: "/desmjs.v1.MsgAuthenticate",
      value: {
        user: account.address,
      },
    };

    dispatch(setStatus(IntegrationPopupStep.TX_REQUEST_SENT));
    const result = await UserWallet.signTransaction(
      account.address,
      [msgSend],
      {
        memo: platform.toString(),
      }
    );
    if (result instanceof Error) {
      dispatch(setError(result.message));
      return;
    }

    const signedData = getSignatureData(result);
    if (signedData instanceof Error) {
      dispatch(setError(signedData.message));
      return;
    }

    dispatch(setStatus(IntegrationPopupStep.DISCONNECTING));
    try {
      const res = await PlutusAPI.sendDisconnectionRequest({
        desmosAddress: account.address,
        platform,
        pubKeyBytes: Buffer.from(signedData.pubKeyBytes).toString("hex"),
        signedBytes: Buffer.from(signedData.signedBytes).toString("hex"),
        signatureBytes: Buffer.from(signedData.signatureBytes).toString("hex"),
      });
      if (!res.ok) {
        dispatch(setError(await res.text()));
        return;
      }

      dispatch(refreshUserState());
      dispatch(setStatus(IntegrationPopupStep.DISCONNECTED));
    } catch (error: any) {
      dispatch(setError(error.message));
    }
  };
}

// --- SELECTORS ---
export const getIntegrationsPopupState = (state: RootState) =>
  state.integrations;

export default integrationsSlice.reducer;

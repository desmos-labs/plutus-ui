import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MsgAuthenticateEncodeObject } from "@desmoslabs/desmjs";
import type { RootState, AppThunk } from "../index";
import { OAuthStorage, StoredData } from "./storage";
import {
  getSignatureData,
  OAuthParams,
  Platform,
  UserWallet,
} from "../../types";
import { OAuthAPIs, PlutusAPI } from "../../apis";
import { refreshUserState } from "../user";
import { OAuthPopupState, OAuthPopupStatus } from "./state";

export * from "./storage";
export * from "./state";

// --- STATE ---

const initialState: OAuthPopupState = {
  status: OAuthPopupStatus.NOTHING,
};

// --- SLICE ---
const oAuthSlice = createSlice({
  name: "oauth-popup",
  initialState,
  reducers: {
    setStatus(state, action: PayloadAction<OAuthPopupStatus>) {
      state.status = action.payload;
    },
    setOAuthCode(state, action: PayloadAction<string>) {
      state.oAuthCode = action.payload;
    },
    setStoredData(state, action: PayloadAction<StoredData>) {
      state.data = action.payload;
    },
    setError(state, action: PayloadAction<string | undefined>) {
      if (action.payload) {
        state.status = OAuthPopupStatus.ERROR;
      }
      state.error = action.payload;
    },
    resetOAuthPopup(state) {
      OAuthStorage.deleteData(state.oAuthCode || "");
      state.status = initialState.status;
    },
  },
});

// --- ACTIONS ---
const { setStatus, setOAuthCode, setStoredData, setError } = oAuthSlice.actions;
export const { resetOAuthPopup } = oAuthSlice.actions;

/**
 * Initializes the OAuth popup state.
 */
export function initOAuthPopupState({
  oAuthCode,
  oAuthState,
  oAuthError,
}: OAuthParams): AppThunk {
  return (dispatch) => {
    if (oAuthError) {
      dispatch(setError(oAuthError));
      return;
    }

    if (!oAuthCode || !oAuthState) {
      return;
    }

    dispatch(setOAuthCode(oAuthCode));

    // Get the data from the local storage
    const data = OAuthStorage.getData(oAuthState);
    if (data == null) {
      dispatch(setError("Invalid OAuth state"));
      return;
    }

    dispatch(setStoredData(data));
    dispatch(setStatus(OAuthPopupStatus.INITIALIZED));
  };
}

/**
 * Stats the authorization process for the given platform.
 */
export function startAuthorization(platform: Platform): AppThunk {
  return async () => {
    const account = await UserWallet.getAccount();
    if (!account) {
      return;
    }

    // Get the nonce and the URL
    const { nonce, url } = OAuthAPIs.startConnection(platform);

    // Store the nonce locally
    OAuthStorage.storeData(nonce, platform, account.address);

    // Redirect the user
    window.location.href = url;
  };
}

/**
 * Finalizes the OAuth process associated with the given OAuth code and nonce.
 * The process is completed when we are sure the user performing the connection is the one that also
 * owns the current Desmos address. The verification is performed by asking the user to sign a transaction and
 * sending the signed transaction along with the OAuth code to the APIs that will associate the two together.
 */
export function finalizeOAuth(oAuthCode?: string, data?: StoredData): AppThunk {
  return async (dispatch) => {
    if (!oAuthCode) {
      dispatch(setError("Invalid OAuth code"));
      return;
    }

    if (!data) {
      dispatch(setError("Invalid stored data"));
      return;
    }

    // Build the message to be signed
    const msgSend: MsgAuthenticateEncodeObject = {
      typeUrl: "/desmjs.v1.MsgAuthenticate",
      value: {
        user: data.desmosAddress,
      },
    };

    // Ask the user to sign
    dispatch(setStatus(OAuthPopupStatus.REQUESTED_SIGNATURE));
    const result = await UserWallet.signTransaction(
      data.desmosAddress,
      [msgSend],
      { memo: oAuthCode }
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

    dispatch(setStatus(OAuthPopupStatus.VERIFYING));
    try {
      const res = await PlutusAPI.sendAuthorizationRequest({
        oAuthCode,
        desmosAddress: data.desmosAddress,
        platform: data.platform,
        pubKeyBytes: Buffer.from(signedData.pubKeyBytes).toString("hex"),
        signedBytes: Buffer.from(signedData.signedBytes).toString("hex"),
        signatureBytes: Buffer.from(signedData.signatureBytes).toString("hex"),
      });
      if (!res.ok) {
        dispatch(setError(await res.text()));
        return;
      }

      dispatch(refreshUserState());
      dispatch(setStatus(OAuthPopupStatus.CONNECTED));
    } catch (error: any) {
      dispatch(setError(error.message));
    }
  };
}

// --- SELECTORS ---
export const getOAuthPopupState = (state: RootState) => state.oauth;

export default oAuthSlice.reducer;

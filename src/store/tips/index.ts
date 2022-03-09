import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SendAuthorization } from "cosmjs-types/cosmos/bank/v1beta1/authz";
import { MsgGrantEncodeObject } from "@desmoslabs/desmjs";
import type { RootState, AppThunk } from "../index";
import { UserWallet } from "../../types";
import { PlutusAPI } from "../../apis";
import { sendTx } from "../transaction";
import { refreshUserState } from "../user";
import { TipsState, TipsStep } from "./state";

export * from "./state";

// --- SLICE ---
const tipsSlice = createSlice({
  name: "tips",
  initialState: (): TipsState => ({
    step: TipsStep.HIDDEN,
    grantDenom: UserWallet.getFeeDenom(),
    grantAmount: "0",
  }),
  reducers: {
    showPopup(state) {
      state.step = TipsStep.INPUT_DATA;
    },
    setTipStep(state, action: PayloadAction<TipsStep>) {
      state.step = action.payload;
      state.error = undefined;
      state.txHash = undefined;
    },
    setGrantAmount(state, action: PayloadAction<string>) {
      state.grantAmount = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.step = TipsStep.ERROR;
      state.error = action.payload;
    },
    setSuccess(state, action: PayloadAction<string>) {
      state.step = TipsStep.SUCCESS;
      state.txHash = action.payload;
    },
    resetTipsPopup(state) {
      state.step = TipsStep.HIDDEN;
      state.grantAmount = "0";
    },
  },
});

// --- ACTIONS ---
const { setTipStep, setError, setSuccess } = tipsSlice.actions;
export const { showPopup, setGrantAmount, resetTipsPopup } = tipsSlice.actions;

/**
 * Starts the authorization process required to enable social tips.
 */
export function startTipAuthorizationProcess(amount: number): AppThunk {
  return async (dispatch) => {
    // Get the user wallet
    const account = await UserWallet.getAccount();
    if (!account) {
      dispatch(setError("Invalid user account"));
      return;
    }

    // Build the authorization
    const authorization: SendAuthorization = {
      spendLimit: [
        {
          amount: (amount * 1_000_000).toString(),
          denom: UserWallet.getFeeDenom(),
        },
      ],
    };

    // Build the message
    const grantee = await PlutusAPI.getGranteeAddress();
    if (grantee instanceof Error) {
      dispatch(setError(grantee.message));
      return;
    }

    const msg: MsgGrantEncodeObject = {
      typeUrl: "/cosmos.authz.v1beta1.MsgGrant",
      value: {
        grantee,
        granter: account.address,
        grant: {
          authorization: {
            typeUrl: "/cosmos.bank.v1beta1.SendAuthorization",
            value: SendAuthorization.encode(authorization).finish(),
          },
        },
      },
    };

    // Send the transaction
    dispatch(setTipStep(TipsStep.CONFIRMATION_REQUIRED));
    const result = await dispatch(
      sendTx(account.address, [msg], { memo: "DesmosTipBot grant" })
    );
    if (result instanceof Error) {
      dispatch(setError(result.message));
      return;
    }

    dispatch(setSuccess(result.transactionHash));
    dispatch(refreshUserState());
  };
}

// --- SELECTORS ---
export function getTipsPopupState(state: RootState) {
  return state.tips;
}

export default tipsSlice.reducer;

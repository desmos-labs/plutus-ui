import {AppThunk} from "store/index";
import {initTipsState} from "store/dashboard/tips/root/actions";
import GraphQL from "apis/graphql";
import {DashboardStatus, setError, setStatus, setUserProfile} from "store/dashboard/root/index";
import {initIntegrationsState,} from "store/dashboard/integrations/actions";
import {OAuthParams} from "types/oauth";
import {initOAuthState} from "store/dashboard/oauth/root/actions";
import {UserWallet} from "types/cosmos/wallet";

type InitStateParams = {
  oAuthParams: OAuthParams,
}

/**
 * Initializes the Dashboard state.
 */
export function initState(params: InitStateParams): AppThunk {
  return async dispatch => {
    dispatch(setStatus(DashboardStatus.LOADING));

    const address = UserWallet.getAddress();
    if (!address) {
      dispatch(setError("Invalid user address"));
      return
    }

    // Get the user profile
    const profile = await GraphQL.getProfile(address);
    dispatch(setUserProfile(profile));

    // Init the various subsection states
    await Promise.all([
      dispatch(initOAuthState(params.oAuthParams)),
      dispatch(initIntegrationsState(address)),
      dispatch(initTipsState(address)),
    ]);

    // Set everything as loaded
    dispatch(setStatus(DashboardStatus.LOADED));
  }
}
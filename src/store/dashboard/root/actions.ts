import {AppThunk} from "store/index";
import {initTipsState} from "store/dashboard/tips/root/actions";
import GraphQL from "apis/graphql";
import {DashoardStatus, setStatus, setUserProfile} from "store/dashboard/root/index";
import {initIntegrationsState,} from "store/dashboard/integrations/actions";
import {OAuthParams} from "types/oauth";
import {initOAuthState} from "store/dashboard/oauth/root/actions";

type InitStateParams = {
  userAddress: string,
  oAuthParams: OAuthParams,
}

/**
 * Initializes the Dashboard state.
 */
export function initState(params: InitStateParams): AppThunk {
  return async dispatch => {
    dispatch(setStatus(DashoardStatus.LOADING));

    // Get the user profile
    const profile = await GraphQL.getProfile(params.userAddress);
    dispatch(setUserProfile(profile));

    // Init the various subsection states
    await Promise.all([
      dispatch(initOAuthState(params.oAuthParams)),
      dispatch(initIntegrationsState(params.userAddress)),
      dispatch(initTipsState(params.userAddress)),
    ]);

    // Set everything as loaded
    dispatch(setStatus(DashoardStatus.LOADED));
  }
}